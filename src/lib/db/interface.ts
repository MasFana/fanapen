import type {
    User,
    UserSession,
    Project,
    ProjectCreate,
    ProjectUpdate
} from '../types';

/**
 * Abstract database interface - implement this for different database backends
 */
export interface IDatabase {
    // User operations
    createUser(username: string, passwordHash: string): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;

    // Session operations
    createSession(userId: string): Promise<UserSession>;
    getSession(sessionId: string): Promise<UserSession | null>;
    deleteSession(sessionId: string): Promise<void>;

    // Project operations
    createProject(data: ProjectCreate): Promise<Project>;
    getProject(id: string): Promise<Project | null>;
    getProjectsByUserId(userId: string): Promise<Project[]>;
    getProjectBySlug(userId: string, slug: string): Promise<Project | null>;
    getDeployedProjectByUserAndSlug(username: string, slug: string): Promise<Project | null>;
    incrementProjectViews(id: string): Promise<void>;
    updateProject(id: string, data: ProjectUpdate): Promise<Project | null>;
    deleteProject(id: string): Promise<boolean>;

    // Leaderboard operations
    getTopProjectsByViews(limit: number): Promise<Project[]>;
    getTopUsersByTotalViews(limit: number): Promise<{ user: User; totalViews: number }[]>;
}
