<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	let Preview: any = $state(null);

	// Dont change this also idk why but causing some bug
	let files = $state({
		html: data.project.files.html,
		css: data.project.files.css,
		js: data.project.files.js
	});

	// Load Preview component dynamically (client-side only)
	$effect(() => {
		if (browser) {
			import('$lib/components/Preview.svelte').then((module) => {
				Preview = module.default;
			});
		}
	});
</script>

<svelte:head>
	<title>{data.project.name} - by {data.author.username}</title>
	<meta name="description" content="View {data.project.name} by {data.author.username}" />
</svelte:head>

<div class="flex h-screen flex-col" style="background-color: #0d1117;">
	<!-- Compact Header -->
	<header class="border-b px-4 py-2" style="background-color: #161b22; border-color: #30363d;">
		<div class="flex items-center justify-between gap-4">
			<div class="flex min-w-0 flex-1 items-center gap-4">
				<a
					href="/"
					class="flex items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-80"
					style="color: #c9d1d9;"
				>
					<div
						class="overflow-hidden rounded-lg border"
						style="border-color: #30363d;"
					>
						<img src="/logo.webp" alt="FanaPen" class="h-8 w-8 object-cover" />
					</div>
					<span class="text-lg font-bold">
						FanaPen
					</span>
				</a>
				<span class="text-xs" style="color: #30363d;">|</span>
				<h1 class="truncate text-base font-semibold" style="color: #c9d1d9;">
					{data.project.name}
				</h1>
				<span class="text-xs whitespace-nowrap" style="color: #8b949e;">
					by <a href="/" class="hover:underline" style="color: #c9d1d9;">
						{data.author.username}
					</a>
					• {data.project.views} views
				</span>
			</div>
			<a
				href="/"
				class="rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
				style="background-color: #238636; color: #ffffff;"
				onmouseenter={(e) => (e.currentTarget.style.backgroundColor = '#2ea043')}
				onmouseleave={(e) => (e.currentTarget.style.backgroundColor = '#238636')}
			>
				Create Your Own
			</a>
		</div>
	</header>

	<!-- Preview -->
	<main class="flex-1 overflow-hidden">
		{#if Preview}
			<Preview
				html={files.html}
				css={files.css}
				js={files.js}
			/>
		{:else}
			<div class="flex h-full items-center justify-center bg-white text-black dark:bg-black dark:text-white">
				Loading preview...
			</div>
		{/if}
	</main>
</div>
