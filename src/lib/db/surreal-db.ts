import { Surreal } from 'surrealdb';
import { env } from '$env/dynamic/private';

import type { IDatabase } from './interface';
import type {
	User,
	UserSession,
	Project,
	ProjectCreate,
	ProjectUpdate,
	ProjectFiles
} from '../types';

type SurrealRecordId = { toString(): string } | string;

type SurrealUser = Omit<User, 'createdAt'> & { id: SurrealRecordId; createdAt: string | Date };

type SurrealSession = Omit<UserSession, 'expiresAt'> & {
	id: SurrealRecordId;
	expiresAt: string | Date;
};

type SurrealProject = Omit<Project, 'createdAt' | 'updatedAt'> & {
	id: SurrealRecordId;
	createdAt: string | Date;
	updatedAt: string | Date;
};

type SurrealQueryResponse<T> = {
	status: 'OK' | string;
	result: T;
};

export class SurrealDatabase implements IDatabase {
	private client = new Surreal();
	private connected = false;
	private connectPromise: Promise<void> | null = null;

	private getConfig() {
		const required = [
			'SURREAL_URL',
			'SURREAL_NAMESPACE',
			'SURREAL_DATABASE',
			'SURREAL_USERNAME',
			'SURREAL_PASSWORD'
		] as const;

		const missing = required.filter((key) => !env[key]);
		if (missing.length > 0) {
			throw new Error(`Missing SurrealDB env vars: ${missing.join(', ')}`);
		}

		return {
			url: env.SURREAL_URL,
			namespace: env.SURREAL_NAMESPACE,
			database: env.SURREAL_DATABASE,
			username: env.SURREAL_USERNAME,
			password: env.SURREAL_PASSWORD
		};
	}

	private async ensureConnected() {
		if (this.connected) return;

		if (!this.connectPromise) {
			const config = this.getConfig();
			this.connectPromise = this.client
				.connect(config.url)
				.then(async () => {
					await this.client.use({
						namespace: config.namespace,
						database: config.database
					});
					await this.client.signin({
						namespace: config.namespace,
						database: config.database,
						username: config.username,
						password: config.password
					});
				})
				.then(() => {
					this.connected = true;
				})
				.catch((error) => {
					this.connectPromise = null;
					throw error;
				});
		}

		await this.connectPromise;
	}

	private normalizeId(id: SurrealRecordId): string {
		return typeof id === 'string' ? id : id.toString();
	}

	private toDate(value: string | Date | undefined): Date {
		if (value instanceof Date) return value;
		if (typeof value === 'string') return new Date(value);
		return new Date();
	}

	private splitRecordId(id: string, table: string) {
		if (id.includes(':')) {
			const [recordTable, ...rest] = id.split(':');
			return { table: recordTable, key: rest.join(':') };
		}

		return { table, key: id };
	}

	private async queryMany<T>(sql: string, vars?: Record<string, unknown>): Promise<T[]> {
		await this.ensureConnected();
		try {
			const response = (await this.client.query(sql, vars)) as SurrealQueryResponse<T[]>[];
			if (!response || response.length === 0) {
				return [];
			}

			const [first] = response;

			if (Array.isArray(first)) {
				return first as T[];
			}

			if (!first) {
				return [];
			}

			if (typeof first !== 'object' || !('status' in first)) {
				throw new Error(`SurrealDB query failed: ${JSON.stringify(first)}`);
			}

			if (first.status !== 'OK') {
				const detail = (first as { detail?: string }).detail;
				const fallback = JSON.stringify(first);
				throw new Error(`SurrealDB query failed: ${detail ?? fallback}`);
			}

			const result = first.result as unknown;
			if (Array.isArray(result)) {
				return result as T[];
			}

			if (result == null) {
				return [];
			}

			return [result as T];
		} catch (error) {
			if (error instanceof Error && error.message.includes('SurrealDB query failed')) {
				throw error;
			}
			throw new Error(
				`SurrealDB query error: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	private async queryOne<T>(sql: string, vars?: Record<string, unknown>): Promise<T | null> {
		const rows = await this.queryMany<T>(sql, vars);
		return rows[0] ?? null;
	}

	private mapUser(record: SurrealUser): User {
		return {
			...record,
			id: this.normalizeId(record.id),
			createdAt: this.toDate(record.createdAt)
		};
	}

	private mapSession(record: SurrealSession): UserSession {
		return {
			...record,
			id: this.normalizeId(record.id),
			expiresAt: this.toDate(record.expiresAt)
		};
	}

	private mapProject(record: SurrealProject): Project {
		return {
			...record,
			id: this.normalizeId(record.id),
			createdAt: this.toDate(record.createdAt),
			updatedAt: this.toDate(record.updatedAt)
		};
	}

	// User operations
	async createUser(username: string, passwordHash: string): Promise<User> {
		const createdAt = new Date();
		const record = await this.queryOne<SurrealUser>('CREATE user CONTENT $data', {
			data: { username, passwordHash, createdAt }
		});

		if (!record) {
			throw new Error('Failed to create user');
		}

		return this.mapUser(record);
	}

	async getUserById(id: string): Promise<User | null> {
		const { table, key } = this.splitRecordId(id, 'user');
		const record = await this.queryOne<SurrealUser>('SELECT * FROM type::record($table, $id)', {
			table,
			id: key
		});

		return record ? this.mapUser(record) : null;
	}

	async getUserByUsername(username: string): Promise<User | null> {
		const record = await this.queryOne<SurrealUser>(
			'SELECT * FROM user WHERE username = $username LIMIT 1',
			{ username }
		);

		return record ? this.mapUser(record) : null;
	}

	// Session operations
	async createSession(userId: string): Promise<UserSession> {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const record = await this.queryOne<SurrealSession>('CREATE session CONTENT $data', {
			data: { userId, expiresAt }
		});

		if (!record) {
			throw new Error('Failed to create session');
		}

		return this.mapSession(record);
	}

	async getSession(sessionId: string): Promise<UserSession | null> {
		const { table, key } = this.splitRecordId(sessionId, 'session');
		const record = await this.queryOne<SurrealSession>('SELECT * FROM type::record($table, $id)', {
			table,
			id: key
		});

		if (!record) return null;

		const session = this.mapSession(record);
		if (new Date() > session.expiresAt) {
			await this.deleteSession(session.id);
			return null;
		}

		return session;
	}

	async deleteSession(sessionId: string): Promise<void> {
		const { table, key } = this.splitRecordId(sessionId, 'session');
		await this.queryMany('DELETE type::record($table, $id)', { table, id: key });
	}

	// Project operations
	async createProject(data: ProjectCreate): Promise<Project> {
		let slug = this.generateSlug(data.name);
		let counter = 1;
		while (await this.getProjectBySlug(data.userId, slug)) {
			slug = `${this.generateSlug(data.name)}-${counter}`;
			counter++;
		}

		const defaultFiles: ProjectFiles = {
			html:
				data.files?.html ||
				`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to FanaPen</title>
</head>
<body>
  <div class="container">
    <div class="hero">
      <img src="/logo.webp" alt="FanaPen Logo" class="logo">
      <h1 class="title">Welcome to FanaPen</h1>
      <p class="subtitle">Your creative coding playground</p>
    </div>

    <div class="cta">
      <button class="btn-primary" onclick="startCoding()">Start Coding</button>
      <p class="tip">Edit the HTML, CSS, and JS files to customize this page!</p>
    </div>
  </div>
</body>
</html>`,
			css:
				data.files?.css ||
				`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #ffffff;
}

.container {
  max-width: 900px;
  width: 100%;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.logo {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: #ffffff;
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.7;
  font-weight: 300;
  color: #cccccc;
}

.cta {
  text-align: center;
}

.btn-primary {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 16px 48px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover {
  background: #f0f0f0;
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.1);
}

.btn-primary:active {
  transform: scale(0.98);
}

.tip {
  margin-top: 24px;
  opacity: 0.6;
  font-size: 0.95rem;
  color: #aaaaaa;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }
}`,
			js:
				data.files?.js ||
				`console.log('Welcome to FanaPen!');

function startCoding() {
  const tip = document.querySelector('.tip');
  tip.textContent = 'Great! Now start editing the code to make it your own!';
  tip.style.fontSize = '1.1rem';
  tip.style.fontWeight = '600';
}`
		};

		const now = new Date();
		const record = await this.queryOne<SurrealProject>('CREATE project CONTENT $data', {
			data: {
				userId: data.userId,
				name: data.name,
				slug,
				files: defaultFiles,
				isDeployed: false,
				views: 0,
				createdAt: now,
				updatedAt: now
			}
		});

		if (!record) {
			throw new Error('Failed to create project');
		}

		return this.mapProject(record);
	}

	private generateSlug(name: string): string {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	async getProject(id: string): Promise<Project | null> {
		const { table, key } = this.splitRecordId(id, 'project');
		const record = await this.queryOne<SurrealProject>('SELECT * FROM type::record($table, $id)', {
			table,
			id: key
		});

		return record ? this.mapProject(record) : null;
	}

	async getProjectsByUserId(userId: string): Promise<Project[]> {
		const records = await this.queryMany<SurrealProject>(
			'SELECT * FROM project WHERE userId = $userId ORDER BY updatedAt DESC',
			{ userId }
		);

		return records.map((record) => this.mapProject(record));
	}

	async getProjectBySlug(userId: string, slug: string): Promise<Project | null> {
		const record = await this.queryOne<SurrealProject>(
			'SELECT * FROM project WHERE userId = $userId AND slug = $slug LIMIT 1',
			{ userId, slug }
		);

		return record ? this.mapProject(record) : null;
	}

	async getDeployedProjectByUserAndSlug(username: string, slug: string): Promise<Project | null> {
		const user = await this.getUserByUsername(username);
		if (!user) return null;

		const record = await this.queryOne<SurrealProject>(
			'SELECT * FROM project WHERE userId = $userId AND slug = $slug AND isDeployed = true LIMIT 1',
			{ userId: user.id, slug }
		);

		return record ? this.mapProject(record) : null;
	}

	async incrementProjectViews(id: string): Promise<void> {
		const { table, key } = this.splitRecordId(id, 'project');
		await this.queryMany('UPDATE type::record($table, $id) SET views += 1', {
			table,
			id: key
		});
	}

	async updateProject(id: string, data: ProjectUpdate): Promise<Project | null> {
		const existing = await this.getProject(id);
		if (!existing) return null;

		const updated: Project = {
			...existing,
			name: data.name ?? existing.name,
			slug: data.slug ?? existing.slug,
			isDeployed: data.isDeployed ?? existing.isDeployed,
			files: {
				html: data.files?.html ?? existing.files.html,
				css: data.files?.css ?? existing.files.css,
				js: data.files?.js ?? existing.files.js
			},
			updatedAt: new Date()
		};

		const { table, key } = this.splitRecordId(id, 'project');
		const record = await this.queryOne<SurrealProject>(
			'UPDATE type::record($table, $id) CONTENT $data',
			{
				table,
				id: key,
				data: {
					userId: updated.userId,
					name: updated.name,
					slug: updated.slug,
					files: updated.files,
					isDeployed: updated.isDeployed,
					views: updated.views,
					createdAt: updated.createdAt,
					updatedAt: updated.updatedAt
				}
			}
		);

		return record ? this.mapProject(record) : null;
	}

	async deleteProject(id: string): Promise<boolean> {
		const { table, key } = this.splitRecordId(id, 'project');
		const record = await this.queryOne<SurrealProject>('DELETE type::record($table, $id)', {
			table,
			id: key
		});

		return Boolean(record);
	}

	// Leaderboard operations
	async getTopProjectsByViews(limit: number): Promise<Project[]> {
		const records = await this.queryMany<SurrealProject>(
			'SELECT * FROM project WHERE isDeployed = true ORDER BY views DESC LIMIT $limit',
			{ limit }
		);

		return records.map((record) => this.mapProject(record));
	}

	async getTopUsersByTotalViews(limit: number): Promise<{ user: User; totalViews: number }[]> {
		const deployedProjects = await this.queryMany<{ userId: string; views: number }>(
			'SELECT userId, views FROM project WHERE isDeployed = true'
		);

		const totalsMap = new Map<string, number>();
		for (const project of deployedProjects) {
			totalsMap.set(project.userId, (totalsMap.get(project.userId) ?? 0) + project.views);
		}

		const sorted = Array.from(totalsMap.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit);

		const results: { user: User; totalViews: number }[] = [];
		for (const [userId, totalViews] of sorted) {
			const user = await this.getUserById(userId);
			if (user) {
				results.push({ user, totalViews });
			}
		}

		return results;
	}
}
