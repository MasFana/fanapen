<script lang="ts">
	import type { PageData } from './$types';
	import { Zap, Rocket, Code2, Trophy, Users, Sparkles, Eye, Share2, Layers } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>FanaPen - Build, Test & Share Front-end Code in Real-Time | Online Code Editor</title>
	<meta
		name="description"
		content="FanaPen is a powerful online code playground for front-end developers. Write HTML, CSS, and JavaScript with live preview, share your creations, and join a community of creators. Start building instantly, no setup required."
	/>
	<meta
		name="keywords"
		content="online code editor, code playground, HTML editor, CSS editor, JavaScript editor, live preview, code sharing, web development, front-end development"
	/>
	<meta property="og:title" content="FanaPen - Online Code Editor with Live Preview" />
	<meta
		property="og:description"
		content="Build, test, and share front-end code in real-time with FanaPen's powerful online code editor."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://web.fkom.my.id" />
</svelte:head>

<div class="min-h-screen" style="background-color: #0d1117;">
	<Header user={data.user} transparent={true} />

	<!-- Hero Section -->
	<section class="relative overflow-hidden border-b" style="border-color: #30363d;">
		<!-- Subtle Background Pattern -->
		<div
			class="absolute inset-0 opacity-3"
			style="background-image: repeating-linear-gradient(0deg, #30363d 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #30363d 0px, transparent 1px, transparent 40px);"
		></div>

		<div class="relative mx-auto max-w-7xl px-4 py-20 sm:py-32">
			<div class="text-center">
				<!-- Logo Display -->
				<div class="mb-8 flex justify-center">
					<div
						class="overflow-hidden rounded-2xl border-2 shadow-xl transition-transform hover:scale-105"
						style="border-color: #30363d;"
					>
						<img
							src="/logo.webp"
							alt="FanaPen Logo"
							class="h-24 w-24 object-cover sm:h-32 sm:w-32"
						/>
					</div>
				</div>

				<h1 class="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl" style="color: #c9d1d9;">
					FanaPen
				</h1>

				<p class="mb-4 text-2xl font-semibold sm:text-3xl" style="color: #c9d1d9;">
					Code. Create. Share. Instantly.
				</p>

				<p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed" style="color: #8b949e;">
					The modern playground for front-end developers. Build stunning web experiences with HTML,
					CSS & JavaScript. See your code come alive in real-time with zero configuration.
				</p>

				<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
					{#if data.user}
						<a
							href="/dashboard"
							class="rounded-lg px-8 py-4 text-base font-semibold transition-all hover:scale-105"
							style="background-color: #238636; color: #ffffff;"
						>
							Go to Dashboard
						</a>
					{:else}
						<a
							href="/register"
							class="rounded-lg px-8 py-4 text-base font-semibold transition-all hover:scale-105"
							style="background-color: #238636; color: #ffffff;"
						>
							Start Creating Free
						</a>
						<a
							href="/login"
							class="rounded-lg border px-8 py-4 text-base font-semibold transition-all hover:scale-105"
							style="border-color: #30363d; background-color: #21262d; color: #c9d1d9;"
						>
							Sign In
						</a>
					{/if}
				</div>

				<!-- Stats Bar -->
				<div class="mt-16 grid gap-6 sm:grid-cols-3">
					<div
						class="rounded-xl border p-6 transition-all hover:scale-105"
						style="background-color: #161b22; border-color: #30363d;"
					>
						<div class="text-4xl font-bold" style="color: #c9d1d9;">
							{data.topProjects.reduce((sum, p) => sum + p.views, 0).toLocaleString()}+
						</div>
						<div class="mt-2 text-sm font-medium" style="color: #8b949e;">Total Views</div>
					</div>
					<div
						class="rounded-xl border p-6 transition-all hover:scale-105"
						style="background-color: #161b22; border-color: #30363d;"
					>
						<div class="text-4xl font-bold" style="color: #c9d1d9;">
							{data.topProjects.length}
						</div>
						<div class="mt-2 text-sm font-medium" style="color: #8b949e;">Active Projects</div>
					</div>
					<div
						class="rounded-xl border p-6 transition-all hover:scale-105"
						style="background-color: #161b22; border-color: #30363d;"
					>
						<div class="text-4xl font-bold" style="color: #c9d1d9;">
							{data.topUsers.length}
						</div>
						<div class="mt-2 text-sm font-medium" style="color: #8b949e;">Creators</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Leaderboards Section -->
	<section class="mx-auto max-w-7xl px-4 py-20">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-extrabold" style="color: #c9d1d9;">Top Creators & Projects</h2>
			<p class="text-lg" style="color: #8b949e;">
				Join our community of talented developers and showcase your work
			</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Top Projects Leaderboard -->
			<div
				class="overflow-hidden rounded-2xl border shadow-lg transition-all hover:shadow-xl"
				style="background-color: #161b22; border-color: #30363d;"
			>
				<div class="border-b px-6 py-5" style="background-color: #0d1117; border-color: #30363d;">
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg"
							style="background-color: #f1e05a;"
						>
							<Trophy class="h-6 w-6" style="color: #0d1117;" />
						</div>
						<div>
							<h2 class="text-2xl font-bold" style="color: #c9d1d9;">Top Projects</h2>
							<p class="text-sm" style="color: #8b949e;">Most viewed this week</p>
						</div>
					</div>
				</div>
				<div class="p-6">
					{#if data.topProjects.length === 0}
						<div class="py-12 text-center">
							<Rocket class="mx-auto mb-4 h-16 w-16 opacity-20" style="color: #8b949e;" />
							<p class="text-sm font-medium" style="color: #8b949e;">
								No projects yet. Be the first to create!
							</p>
						</div>
					{:else}
						<div class="space-y-3">
							{#each data.topProjects as project, index}
								<a
									href="/{project.author}/{project.slug}"
									class="group flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-lg"
									style="background-color: #0d1117; border-color: #30363d;"
								>
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
										style={index < 3
											? index === 0
												? 'background-color: #f1e05a; color: #0d1117;'
												: index === 1
													? 'background-color: #c0c0c0; color: #0d1117;'
													: 'background-color: #cd7f32; color: #0d1117;'
											: 'background-color: #21262d; color: #8b949e;'}
									>
										{index + 1}
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate font-bold" style="color: #c9d1d9;">
											{project.name}
										</p>
										<p class="text-xs" style="color: #8b949e;">
											by {project.author}
										</p>
									</div>
									<div class="flex flex-col items-end">
										<div class="flex items-center gap-1">
											<Eye class="h-4 w-4" style="color: #8b949e;" />
											<p class="text-lg font-bold" style="color: #c9d1d9;">
												{project.views.toLocaleString()}
											</p>
										</div>
										<p class="text-xs" style="color: #8b949e;">views</p>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Top Users Leaderboard -->
			<div
				class="overflow-hidden rounded-2xl border shadow-lg transition-all hover:shadow-xl"
				style="background-color: #161b22; border-color: #30363d;"
			>
				<div class="border-b px-6 py-5" style="background-color: #0d1117; border-color: #30363d;">
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg"
							style="background-color: #21262d;"
						>
							<Users class="h-6 w-6" style="color: #c9d1d9;" />
						</div>
						<div>
							<h2 class="text-2xl font-bold" style="color: #c9d1d9;">Top Creators</h2>
							<p class="text-sm" style="color: #8b949e;">Most total views</p>
						</div>
					</div>
				</div>
				<div class="p-6">
					{#if data.topUsers.length === 0}
						<div class="py-12 text-center">
							<Users class="mx-auto mb-4 h-16 w-16 opacity-20" style="color: #8b949e;" />
							<p class="text-sm font-medium" style="color: #8b949e;">
								No creators yet. Be the first to join!
							</p>
						</div>
					{:else}
						<div class="space-y-3">
							{#each data.topUsers as user, index}
								<div
									class="flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-lg"
									style="background-color: #0d1117; border-color: #30363d;"
								>
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
										style={index < 3
											? index === 0
												? 'background-color: #f1e05a; color: #0d1117;'
												: index === 1
													? 'background-color: #c0c0c0; color: #0d1117;'
													: 'background-color: #cd7f32; color: #0d1117;'
											: 'background-color: #21262d; color: #8b949e;'}
									>
										{index + 1}
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-lg font-bold" style="color: #c9d1d9;">
											{user.username}
										</p>
										<p class="text-xs font-medium" style="color: #8b949e;"></p>
									</div>
									<div class="flex flex-col items-end">
										<div class="flex items-center gap-1">
											<Trophy class="h-4 w-4" style="color: #f1e05a;" />
											<p class="text-lg font-bold" style="color: #c9d1d9;">
												{user.totalViews.toLocaleString()}
											</p>
										</div>
										<p class="text-xs" style="color: #8b949e;">total views</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="border-t py-20" style="border-color: #30363d;">
		<div class="mx-auto max-w-7xl px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-4xl font-extrabold" style="color: #c9d1d9;">
					Everything You Need to Build Amazing Things
				</h2>
				<p class="text-lg" style="color: #8b949e;">
					Powerful features designed for modern web developers
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				<!-- Feature 1 -->
				<div
					class="rounded-xl border p-6 transition-all hover:-translate-y-2 hover:shadow-xl"
					style="background-color: #161b22; border-color: #30363d;"
				>
					<div
						class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all"
						style="background-color: #238636;"
					>
						<Zap class="h-7 w-7" style="color: #ffffff;" />
					</div>
					<h3 class="mb-3 text-xl font-bold" style="color: #c9d1d9;">Instant Live Preview</h3>
					<p class="text-sm leading-relaxed" style="color: #8b949e;">
						Watch your code transform into beautiful websites in real-time. No refresh, no delay
						just pure creative flow.
					</p>
				</div>

				<!-- Feature 2 -->
				<div
					class="rounded-xl border p-6 transition-all hover:-translate-y-2 hover:shadow-xl"
					style="background-color: #161b22; border-color: #30363d;"
				>
					<div
						class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all"
						style="background-color: #21262d;"
					>
						<Share2 class="h-7 w-7" style="color: #c9d1d9;" />
					</div>
					<h3 class="mb-3 text-xl font-bold" style="color: #c9d1d9;">Share Instantly</h3>
					<p class="text-sm leading-relaxed" style="color: #8b949e;">
						One click to share your masterpiece. Beautiful URLs perfect for portfolios,
						documentation, or collaboration.
					</p>
				</div>

				<!-- Feature 3 -->
				<div
					class="rounded-xl border p-6 transition-all hover:-translate-y-2 hover:shadow-xl"
					style="background-color: #161b22; border-color: #30363d;"
				>
					<div
						class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all"
						style="background-color: #21262d;"
					>
						<Layers class="h-7 w-7" style="color: #c9d1d9;" />
					</div>
					<h3 class="mb-3 text-xl font-bold" style="color: #c9d1d9;">Full Stack Support</h3>
					<p class="text-sm leading-relaxed" style="color: #8b949e;">
						Import any library via CDN. Complete control over HTML, CSS, and JavaScript. Build
						anything you imagine.
					</p>
				</div>

				<!-- Feature 4 -->
				<div
					class="rounded-xl border p-6 transition-all hover:-translate-y-2 hover:shadow-xl"
					style="background-color: #161b22; border-color: #30363d;"
				>
					<div
						class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all"
						style="background-color: #21262d;"
					>
						<Code2 class="h-7 w-7" style="color: #c9d1d9;" />
					</div>
					<h3 class="mb-3 text-xl font-bold" style="color: #c9d1d9;">Zero Setup Required</h3>
					<p class="text-sm leading-relaxed" style="color: #8b949e;">
						Start coding immediately. No downloads, no configuration. Just open and create. Perfect
						for learning and rapid prototyping.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t py-12" style="border-color: #30363d;">
		<div class="mx-auto max-w-7xl px-4">
			<div class="flex flex-col items-center justify-center gap-4">
				<div class="flex items-center gap-3">
					<div class="overflow-hidden rounded-lg border" style="border-color: #30363d;">
						<img src="/logo.webp" alt="FanaPen Logo" class="h-8 w-8 object-cover" />
					</div>
					<span class="text-xl font-bold" style="color: #c9d1d9;"> FanaPen </span>
				</div>
				<p class="text-sm" style="color: #8b949e;">
					© {new Date().getFullYear()} FanaPen. Built with ❤️
					<a href="https://github.com/MasFana" class="hover:underline" style="color: #c9d1d9;"
						>MasFana</a
					>.
				</p>
				<p class="text-xs" style="color: #8b949e;">
					Empowering developers to create amazing web experiences
				</p>
			</div>
		</div>
	</footer>
</div>
