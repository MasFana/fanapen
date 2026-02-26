<script lang="ts">
	import type { ActionData } from './$types';
	import AuthCard from '$lib/components/AuthCard.svelte';
	import Button from '$lib/components/Button.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<AuthCard title="Create Account" subtitle="Join FanaPen today">
	<form method="POST" class="mt-8 space-y-6">
		{#if form?.error}
			<div class="rounded-md p-4" style="background-color: #da363320;">
				<p class="text-sm" style="color: #f85149;">{form.error}</p>
			</div>
		{/if}

		<div class="space-y-4">
			<div>
				<label for="username" class="block text-sm font-medium" style="color: #c9d1d9;"
					>Username</label
				>
				<input
					id="username"
					name="username"
					type="text"
					required
					class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none"
					style="background-color: #0d1117; border-color: #30363d; color: #c9d1d9;"
					onfocus={(e) => (e.currentTarget.style.borderColor = '#8b949e')}
					onblur={(e) => (e.currentTarget.style.borderColor = '#30363d')}
				/>
				<p class="mt-1 text-xs" style="color: #8b949e;">
					At least 3 characters, letters, numbers, - and _ only
				</p>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium" style="color: #c9d1d9;"
					>Password</label
				>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none"
					style="background-color: #0d1117; border-color: #30363d; color: #c9d1d9;"
					onfocus={(e) => (e.currentTarget.style.borderColor = '#8b949e')}
					onblur={(e) => (e.currentTarget.style.borderColor = '#30363d')}
				/>
				<p class="mt-1 text-xs" style="color: #8b949e;">At least 6 characters</p>
			</div>
		</div>

		<div>
			<Button type="submit" variant="success" class="w-full">Create Account</Button>
		</div>

		<div class="text-center text-sm">
			<a href="/login" style="color: #c9d1d9;" class="hover:underline">
				Already have an account? Sign in
			</a>
		</div>
	</form>
</AuthCard>
