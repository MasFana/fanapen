<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
		type?: 'button' | 'submit';
		onclick?: () => void;
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'primary',
		type = 'button',
		onclick,
		class: className = '',
		children
	}: Props = $props();

	const variants = {
		primary: {
			bg: '#1f6feb',
			hover: '#388bfd',
			text: '#ffffff'
		},
		secondary: {
			bg: '#21262d',
			hover: '#30363d',
			text: '#c9d1d9',
			border: '#30363d'
		},
		danger: {
			bg: '#da3633',
			hover: '#f85149',
			text: '#ffffff'
		},
		success: {
			bg: '#238636',
			hover: '#2ea043',
			text: '#ffffff'
		},
		ghost: {
			bg: 'transparent',
			hover: '#30363d',
			text: '#c9d1d9',
			border: '#30363d'
		}
	};

	let hovered = $state(false);
	let style = $derived(() => {
		const v = variants[variant];
		const bgColor = hovered ? v.hover : v.bg;
		const borderStyle = 'border' in v ? `border: 1px solid ${v.border};` : '';
		return `background-color: ${bgColor}; color: ${v.text}; ${borderStyle}`;
	});
</script>

<button
	{type}
	{onclick}
	class="rounded-md px-4 py-2 transition-colors {className}"
	style="cursor: pointer; {style()}"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	{@render children()}
</button>
