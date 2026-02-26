<script lang="ts">
	import type { PageData } from './$types';
	import type { FileType } from '$lib/types';
	import { browser } from '$app/environment';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Check } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let MonacoEditor: any = $state(null);
	let Preview: any = $state(null);

	// Load components dynamically (client-side only)
	$effect(() => {
		if (browser) {
			import('$lib/components/MonacoEditor.svelte').then((module) => {
				MonacoEditor = module.default;
			});
			import('$lib/components/Preview.svelte').then((module) => {
				Preview = module.default;
			});
		}
	});

	// State
	let activeFile = $state<FileType>('html');
	// Dont change this
	let projectName = $state(data.project.name);
	let files = $state({
		html: data.project.files.html,
		css: data.project.files.css,
		js: data.project.files.js
	});

	let saveStatus = $state<'saved' | 'saving' | 'unsaved'>('saved');
	let autoSaveTimer: ReturnType<typeof setTimeout>;
	let isEditingName = $state(false);
	let showDeleteConfirm = $state(false);

	// Sync state when data changes (e.g., navigation)
	$effect(() => {
		projectName = data.project.name;
		files = {
			html: data.project.files.html,
			css: data.project.files.css,
			js: data.project.files.js
		};
	});

	// Resizable panels
	let editorWidth = $state(50); // percentage
	let isDragging = $state(false);

	// Language mapping for Monaco Editor
	const languageMap: Record<FileType, string> = {
		html: 'html',
		css: 'css',
		js: 'javascript'
	};

	// File tabs
	const fileTabs: { id: FileType; label: string; filename: string }[] = [
		{ id: 'html', label: 'HTML', filename: 'index.html' },
		{ id: 'css', label: 'CSS', filename: 'styles.css' },
		{ id: 'js', label: 'JS', filename: 'script.js' }
	];

	// Auto-save functionality
	function scheduleAutoSave() {
		saveStatus = 'unsaved';
		clearTimeout(autoSaveTimer);

		autoSaveTimer = setTimeout(async () => {
			await saveProject();
		}, 2000); // Auto-save after 2 seconds of inactivity
	}

	async function saveProject() {
		saveStatus = 'saving';

		const formData = new FormData();
		formData.append('name', projectName);
		formData.append('html', files.html);
		formData.append('css', files.css);
		formData.append('js', files.js);

		try {
			const response = await fetch(`/editor/${data.project.id}?/save`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				saveStatus = 'saved';
			}
		} catch (error) {
			console.error('Save failed:', error);
		}
	}

	function handleCodeChange(fileType: FileType, newValue: string) {
		files[fileType] = newValue;
		scheduleAutoSave();
	}

	function handleNameChange(name: string) {
		projectName = name;
		scheduleAutoSave();
	}

	async function handleDelete() {
		const formData = new FormData();
		await fetch(`/editor/${data.project.id}?/delete`, {
			method: 'POST',
			body: formData
		});
		window.location.href = '/dashboard';
	}

	// Resizable splitter handlers
	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = true;
		// Add cursor style to body to prevent cursor flicker
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';

		// Attach event listeners only when dragging starts
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		e.preventDefault();

		const container = document.querySelector('.flex.flex-1.overflow-hidden');
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

		// Constrain between 20% and 80%
		if (newWidth >= 20 && newWidth <= 80) {
			editorWidth = newWidth;
		}
	}

	function handleMouseUp() {
		if (isDragging) {
			isDragging = false;
			// Reset cursor and user-select
			document.body.style.cursor = '';
			document.body.style.userSelect = '';

			// Remove event listeners when dragging stops
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}
	}

	function handleSeparatorKeyDown(e: KeyboardEvent) {
		// Allow keyboard control for accessibility
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			editorWidth = Math.max(20, editorWidth - 2);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			editorWidth = Math.min(80, editorWidth + 2);
		}
	}

	// Keyboard shortcuts
	function handleKeyDown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault();
			saveProject();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="flex h-screen flex-col overflow-hidden bg-[#0d1117]">
	<!-- Top Bar with Split Headers -->
	<header class="flex border-b border-[#30363d] bg-[#161b22] text-white">
		<!-- Editor Header -->
		<div
			class="flex items-center justify-between border-r border-[#30363d] px-4 py-2"
			style="width: {editorWidth}%"
		>
			<div class="flex items-center gap-4">
				<a
					href="/dashboard"
					class="flex items-center gap-2 transition-opacity hover:opacity-80"
					aria-label="Back to dashboard"
				>
					<div class="overflow-hidden rounded-lg border border-[#30363d]">
						<img src="/logo.webp" alt="FanaPen" class="h-8 w-8 object-cover" />
					</div>
					<span class="text-lg font-bold text-[#c9d1d9]"> FanaPen </span>
				</a>

				{#if isEditingName}
					<input
						type="text"
						value={projectName}
						oninput={(e) => handleNameChange(e.currentTarget.value)}
						onblur={() => {
							isEditingName = false;
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								isEditingName = false;
							}
						}}
						class="rounded bg-[#21262d] px-2 py-1 text-[#c9d1d9]"
					/>
				{:else}
					<button onclick={() => (isEditingName = true)} class="cursor-pointer hover:opacity-80">
						<h1 class="text-lg font-semibold text-[#c9d1d9]">{projectName}</h1>
					</button>
				{/if}
			</div>

			<div class="flex items-center gap-1 text-sm">
				{#if saveStatus === 'saved'}
					<Check class="h-4 w-4 text-[#3fb950]" />
					<span class="text-[#3fb950]">Saved</span>
				{:else if saveStatus === 'saving'}
					<span class="text-[#d29922]">Saving...</span>
				{:else}
					<span class="text-[#8b949e]">Unsaved changes</span>
				{/if}
			</div>
		</div>

		<!-- Resizable Divider in Header -->
		<button
			type="button"
			class="group relative flex w-2 cursor-col-resize items-center justify-center border-0 p-0 transition-colors"
			class:bg-[#1f6feb]={isDragging}
			class:bg-[#30363d]={!isDragging}
			onmousedown={handleMouseDown}
			onkeydown={handleSeparatorKeyDown}
			aria-label="Resize panels - drag or use arrow keys to adjust width"
		>
			<!-- Grip indicator dots -->
			<div class="flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
				<div class="h-0.5 w-0.5 rounded-full bg-[#8b949e]"></div>
				<div class="h-0.5 w-0.5 rounded-full bg-[#8b949e]"></div>
				<div class="h-0.5 w-0.5 rounded-full bg-[#8b949e]"></div>
				<div class="h-0.5 w-0.5 rounded-full bg-[#8b949e]"></div>
				<div class="h-0.5 w-0.5 rounded-full bg-[#8b949e]"></div>
			</div>
			{#if isDragging}
				<div
					class="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded bg-[#1f6feb] px-2 py-1 text-xs text-white shadow-lg"
				>
					{Math.round(editorWidth)}%
				</div>
			{/if}
		</button>

		<!-- Preview Header -->
		<div class="flex items-center justify-end gap-4 px-4 py-2" style="width: {100 - editorWidth}%">
			<Button onclick={() => (showDeleteConfirm = true)} variant="danger" class="text-sm">
				Delete
			</Button>

			<Button onclick={saveProject} variant="success" class="text-sm">Save</Button>
		</div>
	</header>

	<!-- Main Content -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Editor Panel -->
		<div class="flex flex-col" style="width: {editorWidth}%">
			<!-- File Tabs -->
			<div class="flex border-b border-[#30363d] bg-[#161b22]">
				{#each fileTabs as tab}
					<button
						onclick={() => (activeFile = tab.id)}
						class="border-r border-[#30363d] px-4 py-2 text-sm transition"
						class:bg-[#0d1117]={activeFile === tab.id}
						class:bg-[#161b22]={activeFile !== tab.id}
						class:text-[#c9d1d9]={activeFile === tab.id}
						class:text-[#8b949e]={activeFile !== tab.id}
						class:hover:bg-[#21262d]={activeFile !== tab.id}
					>
						{tab.filename}
					</button>
				{/each}
			</div>

			<!-- Editor -->
			<div class="flex-1">
				{#if MonacoEditor}
					<MonacoEditor
						value={files[activeFile]}
						language={languageMap[activeFile]}
						onchange={(value: string) => handleCodeChange(activeFile, value)}
					/>
				{:else}
					<div class="flex h-full items-center justify-center text-[#8b949e]">
						Loading editor...
					</div>
				{/if}
			</div>
		</div>

		<!-- Visual Divider Line (non-interactive, subtle) -->
		<div class="w-px" style="background-color: #30363d;"></div>

		<!-- Preview Panel -->
		<div style="width: {100 - editorWidth}%">
			{#if Preview}
				<Preview html={files.html} css={files.css} js={files.js} />
			{:else}
				<div class="flex h-full items-center justify-center bg-black">Loading preview...</div>
			{/if}
		</div>
	</div>
</div>

<!-- Delete Confirmation Dialog -->
<Modal show={showDeleteConfirm} onclose={() => (showDeleteConfirm = false)}>
	<h2 class="mb-4 text-xl font-semibold" style="color: #c9d1d9;">Delete Project</h2>
	<p class="mb-6" style="color: #8b949e;">
		Are you sure you want to delete "{projectName}"? This action cannot be undone.
	</p>
	<div class="flex justify-end gap-2">
		<Button onclick={() => (showDeleteConfirm = false)} variant="secondary">Cancel</Button>
		<Button onclick={handleDelete} variant="danger">Delete</Button>
	</div>
</Modal>
