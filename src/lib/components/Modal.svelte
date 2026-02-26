<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		show: boolean;
		onclose: () => void;
		children: Snippet;
	}

	let { show, onclose, children }: Props = $props();
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center"
		style="background-color: rgba(13, 17, 23, 0.25);"
		onclick={(e) => {
			if (e.target === e.currentTarget) onclose();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') onclose();
		}}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="w-full max-w-md rounded-lg p-6 shadow-xl" style="background-color: #161b22;">
			{@render children()}
		</div>
	</div>
{/if}
