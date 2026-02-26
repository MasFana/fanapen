<script lang="ts">
	import type { PageData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Globe, Lock, Clipboard, CheckCircle2, XCircle, ExternalLink } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let showNewProjectDialog = $state(false);
	let projectName = $state('');
	let showDeployModal = $state(false);
	let selectedProject = $state<any>(null);
	let copyLinkFeedback = $state('');
	let editSlug = $state(false);
	let newSlug = $state('');

	function openDeployModal(project: any) {
		selectedProject = project;
		newSlug = project.slug;
		editSlug = false;
		showDeployModal = true;
	}

	function getShareableUrl(project: any) {
		if (typeof window === 'undefined') return '';
		return `${window.location.origin}/${data.user?.username}/${project.slug}`;
	}

	function copyShareableLink(project: any) {
		const url = getShareableUrl(project);
		navigator.clipboard.writeText(url);
		copyLinkFeedback = 'Copied!';
		setTimeout(() => {
			copyLinkFeedback = '';
		}, 2000);
	}

	function sanitizeSlug(slug: string): string {
		return slug
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}
</script>

<div class="min-h-screen" style="background-color: #0d1117;">
	<Header user={data.user} />

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-semibold" style="color: #c9d1d9;">Your Projects</h2>
			<Button onclick={() => (showNewProjectDialog = true)} variant="success">+ New Project</Button>
		</div>

		<!-- Projects Grid -->
		{#if data.projects.length === 0}
			<div
				class="rounded-lg border-2 border-dashed p-12 text-center"
				style="border-color: #30363d;"
			>
				<p style="color: #8b949e;">No projects yet. Create your first project!</p>
			</div>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.projects as project}
					<div
						class="rounded-lg border p-6 shadow-sm transition"
						style="background-color: #161b22; border-color: #30363d;"
					>
						<div class="mb-4">
							<a href="/editor/{project.id}" class="block hover:underline">
								<h3 class="font-semibold" style="color: #c9d1d9;">{project.name}</h3>
							</a>
							<p class="mt-1 text-xs" style="color: #8b949e;">
								Updated {new Date(project.updatedAt).toLocaleDateString()}
							</p>
							<div class="mt-2 flex items-center gap-2">
								<span
									class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
									style={project.isDeployed
										? 'background-color: #238636; color: #ffffff;'
										: 'background-color: #21262d; color: #8b949e;'}
								>
									{#if project.isDeployed}
										<Globe class="h-3 w-3" />
										Deployed
									{:else}
										<Lock class="h-3 w-3" />
										Private
									{/if}
								</span>
								{#if project.isDeployed}
									<span class="text-xs" style="color: #8b949e;">
										{project.views} views
									</span>
								{/if}
							</div>
							{#if project.isDeployed}
								<div
									class="mt-3 flex items-center gap-2 rounded border px-2 py-1.5"
									style="background-color: #0d1117; border-color: #30363d;"
								>
									<input
										type="text"
										readonly
										value={getShareableUrl(project)}
										class="flex-1 border-0 bg-transparent text-xs outline-none"
										style="color: #8b949e;"
										onclick={(e) => e.currentTarget.select()}
									/>
									<button
										onclick={() => copyShareableLink(project)}
										class="flex items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors"
										style="background-color: #21262d; color: #58a6ff; cursor: pointer;"
										onmouseenter={(e) => (e.currentTarget.style.backgroundColor = '#30363d')}
										onmouseleave={(e) => (e.currentTarget.style.backgroundColor = '#21262d')}
										title="Copy link"
									>
										<Clipboard class="h-3 w-3" />
									</button>
								</div>
							{/if}
						</div>
						<div class="flex gap-2">
							<a
								href="/editor/{project.id}"
								class="flex-1 rounded-md px-3 py-2 text-center text-sm transition-colors"
								style="background-color: #21262d; color: #c9d1d9; cursor: pointer;"
								onmouseenter={(e) => (e.currentTarget.style.backgroundColor = '#30363d')}
								onmouseleave={(e) => (e.currentTarget.style.backgroundColor = '#21262d')}
							>
								Edit
							</a>
							<Button onclick={() => openDeployModal(project)} variant="success" class="flex-1">
								Deploy
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>

<!-- New Project Dialog -->
<Modal show={showNewProjectDialog} onclose={() => (showNewProjectDialog = false)}>
	<h2 class="mb-4 text-xl font-semibold" style="color: #c9d1d9;">Create New Project</h2>
	<form method="POST" action="?/createProject">
		<div class="mb-4">
			<label for="name" class="block text-sm font-medium" style="color: #c9d1d9;"
				>Project Name</label
			>
			<input
				id="name"
				name="name"
				type="text"
				bind:value={projectName}
				placeholder="My Awesome Project"
				class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none"
				style="background-color: #0d1117; border-color: #30363d; color: #c9d1d9;"
				onfocus={(e) => (e.currentTarget.style.borderColor = '#1f6feb')}
				onblur={(e) => (e.currentTarget.style.borderColor = '#30363d')}
			/>
		</div>
		<div class="flex justify-end gap-2">
			<Button type="button" onclick={() => (showNewProjectDialog = false)} variant="secondary">
				Cancel
			</Button>
			<Button type="submit" variant="success">Create</Button>
		</div>
	</form>
</Modal>

<!-- Deploy/Share Project Modal -->
{#if selectedProject}
	<Modal show={showDeployModal} onclose={() => (showDeployModal = false)}>
		<h2 class="mb-4 text-xl font-semibold" style="color: #c9d1d9;">
			Deploy & Share: {selectedProject.name}
		</h2>

		<div class="space-y-4">
			<!-- Deployment Status -->
			<div class="rounded-lg border p-4" style="background-color: #0d1117; border-color: #30363d;">
				<div class="mb-2 flex items-center justify-between">
					<span class="font-medium" style="color: #c9d1d9;">Deployment Status</span>
					<form method="POST" action="?/toggleDeploy">
						<input type="hidden" name="projectId" value={selectedProject.id} />
						<input type="hidden" name="isDeployed" value={!selectedProject.isDeployed} />
						<Button
							type="submit"
							variant={selectedProject.isDeployed ? 'danger' : 'success'}
							class="text-sm"
						>
							{selectedProject.isDeployed ? 'Undeploy' : 'Deploy Now'}
						</Button>
					</form>
				</div>
				<p class="flex items-center gap-2 text-sm" style="color: #8b949e;">
					{#if selectedProject.isDeployed}
						<CheckCircle2 class="h-4 w-4" style="color: #3fb950;" />
						Your project is live and accessible
					{:else}
						<XCircle class="h-4 w-4" style="color: #f85149;" />
						Your project is private
					{/if}
				</p>
			</div>

			<!-- Project Stats -->
			<div class="rounded-lg border p-4" style="background-color: #0d1117; border-color: #30363d;">
				<h3 class="mb-2 font-medium" style="color: #c9d1d9;">Settings</h3>
				<div class="space-y-3">
					<div>
						<p class="mb-1 text-sm font-medium" style="color: #8b949e;">Project Slug</p>
						{#if editSlug}
							<form method="POST" action="?/updateSlug" class="flex gap-2">
								<input type="hidden" name="projectId" value={selectedProject.id} />
								<input
									type="text"
									name="slug"
									bind:value={newSlug}
									oninput={(e) => (newSlug = sanitizeSlug(e.currentTarget.value))}
									class="flex-1 rounded-md border px-3 py-2 text-sm"
									style="background-color: #0d1117; border-color: #30363d; color: #c9d1d9;"
									placeholder="my-project"
								/>
								<Button type="submit" variant="success" class="text-sm">Save</Button>
								<Button
									type="button"
									onclick={() => {
										editSlug = false;
										newSlug = selectedProject.slug;
									}}
									variant="secondary"
									class="text-sm"
								>
									Cancel
								</Button>
							</form>
						{:else}
							<div class="flex items-center justify-between">
								<p class="font-mono text-sm" style="color: #c9d1d9;">{selectedProject.slug}</p>
								<button
									onclick={() => (editSlug = true)}
									class="text-sm hover:underline"
									style="color: #58a6ff; cursor: pointer;"
								>
									Edit
								</button>
							</div>
						{/if}
					</div>
					<div>
						<p class="mb-1 text-sm font-medium" style="color: #8b949e;">Total Views</p>
						<p class="text-2xl font-bold" style="color: #c9d1d9;">{selectedProject.views}</p>
					</div>
				</div>
			</div>

			<!-- Shareable Link -->
			{#if selectedProject.isDeployed}
				<div
					class="rounded-lg border p-4"
					style="background-color: #0d1117; border-color: #30363d;"
				>
					<h3 class="mb-2 font-medium" style="color: #c9d1d9;">Shareable Link</h3>
					<div class="flex gap-2">
						<input
							type="text"
							readonly
							value={getShareableUrl(selectedProject)}
							class="flex-1 rounded-md border px-3 py-2 text-sm"
							style="background-color: #0d1117; border-color: #30363d; color: #8b949e;"
						/>
						<Button
							onclick={() => copyShareableLink(selectedProject)}
							variant="success"
							class="text-sm"
						>
							{copyLinkFeedback || 'Copy'}
						</Button>
					</div>
					<a
						href={getShareableUrl(selectedProject)}
						target="_blank"
						class="mt-2 inline-flex items-center gap-1 text-xs hover:underline"
						style="color: #58a6ff;"
					>
						Open in new tab
						<ExternalLink class="h-3 w-3" />
					</a>
				</div>
			{/if}
		</div>

		<div class="mt-6 flex justify-end">
			<Button onclick={() => (showDeployModal = false)} variant="secondary">Close</Button>
		</div>
	</Modal>
{/if}
