<script lang="ts">
	import { page } from '$app/stores';
	import { Search, Ban, AlertTriangle, XOctagon } from 'lucide-svelte';

	$: status = $page.status;
	$: message = $page.error?.message || 'An error occurred';

	const errorMessages: Record<number, { title: string; description: string; icon: any }> = {
		404: {
			title: 'Page Not Found',
			description: "The page you are looking for doesn't exist or has been moved.",
			icon: Search
		},
		403: {
			title: 'Access Denied',
			description: "You don't have permission to access this resource.",
			icon: Ban
		},
		500: {
			title: 'Server Error',
			description: 'Something went wrong on our end. Please try again later.',
			icon: AlertTriangle
		}
	};

	$: errorInfo = errorMessages[status] || {
		title: 'Error',
		description: message,
		icon: XOctagon
	};
</script>

<svelte:head>
	<title>{status} - {errorInfo.title}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 bg-gh-primary">
	<div class="w-full max-w-2xl text-center">
		<!-- Error Code with Animation -->
		<div class="mb-8">
			<div class="mb-4 text-9xl font-bold text-gh-hover">
				{status}
			</div>
			<div class="mb-6 flex justify-center">
				<svelte:component this={errorInfo.icon} class="h-24 w-24 text-gh-error" />
			</div>
		</div>

		<!-- Error Title -->
		<h1 class="mb-4 text-4xl font-bold text-gh-primary">
			{errorInfo.title}
		</h1>

		<!-- Error Description -->
		<p class="mb-8 text-lg text-gh-muted">
			{errorInfo.description}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-md bg-gh-accent-green px-6 py-3 text-base font-medium text-gh-white transition-all hover:scale-105"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
					/>
				</svg>
				Go Home
			</a>
			<button
				onclick={() => window.history.back()}
				class="inline-flex items-center gap-2 rounded-md border border-gh-border bg-gh-secondary px-6 py-3 text-base font-medium text-gh-primary transition-all hover:scale-105"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				Go Back
			</button>
		</div>

		<!-- Decorative Elements -->
		<div class="mt-8 flex justify-center gap-2">
			<div class="h-1 w-1 animate-pulse rounded-full bg-gh-accent-green"></div>
			<div
				class="h-1 w-1 animate-pulse rounded-full bg-gh-info"
			></div>
			<div
				class="h-1 w-1 animate-pulse rounded-full bg-gh-error"
			></div>
		</div>
	</div>
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
