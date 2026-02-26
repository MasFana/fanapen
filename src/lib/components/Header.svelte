<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		user?: { username: string } | null;
		transparent?: boolean;
	}

	let { user = null, transparent = false }: Props = $props();
</script>

<header
	class="sticky top-0 z-50 border-b backdrop-blur-sm"
	style={transparent
		? 'background-color: rgba(13, 17, 23, 0.8); border-color: #30363d;'
		: 'background-color: #161b22; border-color: #30363d;'}
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<a href="/" class="flex items-center gap-3 transition-transform hover:scale-105">
			<div
				class="overflow-hidden rounded-lg border shadow-lg transition-all hover:shadow-xl"
				style="border-color: #30363d;"
			>
				<img src="/logo.webp" alt="FanaPen Logo" class="h-10 w-10 object-cover" />
			</div>
			<span class="text-2xl font-bold" style="color: #c9d1d9;"> FanaPen </span>
		</a>

		<nav class="flex items-center gap-4">
			{#if user}
				<a
					href="/dashboard"
					class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
					style="color: #c9d1d9; background-color: #21262d; cursor: pointer;"
					onmouseenter={(e) => (e.currentTarget.style.backgroundColor = '#30363d')}
					onmouseleave={(e) => (e.currentTarget.style.backgroundColor = '#21262d')}
				>
					Dashboard
				</a>
				<span class="text-sm" style="color: #8b949e;">
					<strong style="color: #c9d1d9;">{user.username}</strong>
				</span>
				<form method="POST" action="/?/logout">
					<Button type="submit" variant="secondary">Logout</Button>
				</form>
			{:else}
				<a
					href="/login"
					class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
					style="color: #c9d1d9; cursor: pointer;"
					onmouseenter={(e) => (e.currentTarget.style.backgroundColor = '#21262d')}
					onmouseleave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
				>
					Sign In
				</a>
				<a
					href="/register"
					class="rounded-md px-4 py-2 text-sm font-semibold transition-all hover:scale-105"
					style="background-color: #238636; color: #ffffff; cursor: pointer;"
				>
					Get Started
				</a>
			{/if}
		</nav>
	</div>
</header>
