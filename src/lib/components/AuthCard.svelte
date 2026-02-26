<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle: string;
		children: Snippet;
	}

	let { title, subtitle, children }: Props = $props();
</script>

<div class="flex min-h-screen items-center justify-center" style="background-color: #0d1117;">
	<div
		class="w-full max-w-md space-y-8 rounded-lg p-8 shadow-md"
		style="background-color: #161b22;"
	>
		<div class="text-center">
			<a
				href="/"
				class="mb-6 inline-flex flex-col items-center gap-4 transition-transform hover:scale-105"
			>
				<div class="overflow-hidden rounded-xl border shadow-xl" style="border-color: #30363d;">
					<img src="/logo.webp" alt="FanaPen Logo" class="h-20 w-20 object-cover" />
				</div>
				<h2 class="text-3xl font-bold" style="color: #c9d1d9;">FanaPen</h2>
			</a>
			<p class="mt-2 text-sm" style="color: #8b949e;">{subtitle}</p>
		</div>
		{@render children()}
	</div>
</div>
