<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		html: string;
		css: string;
		js: string;
	}

	let { html, css, js }: Props = $props();

	let iframeSrc = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Optional: You can display this variable in an input above the iframe
	// to act like the StackBlitz address bar!
	let simulatedUrl = $state('/');

	function constructPreview(rawHtml: string, rawCss: string, rawJs: string): string {
		const baseHref = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';
		const htmlLower = (rawHtml || '').trim().toLowerCase();
		const hasDoctype = htmlLower.startsWith('<!doctype');
		const hasHtmlTag = htmlLower.includes('<html');

		// THE STACKBLITZ-STYLE INTERCEPTOR SCRIPT
		const injectedScripts = `
			<script>
				// 1. Error trapping
				window.onerror = function(msg, url, lineNo, columnNo, error) {
					console.error('Error: ' + msg + '\\nLine: ' + lineNo);
					return false;
				};

				// 2. Intercept ALL link clicks
				document.addEventListener('click', function(e) {
					const target = e.target.closest('a');
					if (!target) return;

					const href = target.getAttribute('href');
					if (!href) return;

					// Allow internal anchor/hash links to jump around the page normally (#top)
					if (href.startsWith('#')) return;

					// STOP the browser from doing its default navigation
					e.preventDefault();

					// STACKBLITZ RULE 1: External links MUST open in a new tab
					// This prevents iframe connection refusals (X-Frame-Options)
					if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
						window.open(href, '_blank', 'noopener,noreferrer');
						return;
					}

					// STACKBLITZ RULE 2: Internal links simulate routing
					// Example: href="/" or href="/about.html"

					// Tell the Svelte parent component that the URL changed
					window.parent.postMessage({
						source: 'preview-iframe',
						type: 'NAVIGATE',
						url: href
					}, '*');

					// Try to update the iframe's internal history (fails safely on some blob URLs)
					try {
						window.history.pushState(null, '', href);
					} catch(err) {}

					console.log('Simulated navigation to:', href);

					// If this is a single-file previewer, reloading simulates going back to index
					if (href === '/' || href === 'index.html') {
						window.location.reload();
					} else {
						// Here you would normally swap out the HTML content for the new file
						console.warn('File ' + href + ' does not exist in this preview.');
					}
				});
			<\/script>
		`;

		if (hasDoctype || hasHtmlTag) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(rawHtml, 'text/html');

			if (doc.head) {
				const base = doc.createElement('base');
				base.href = baseHref;
				doc.head.insertBefore(base, doc.head.firstChild);
			}

			if (rawCss.trim()) {
				const style = doc.createElement('style');
				style.textContent = rawCss;
				doc.head.appendChild(style);
			}

			if (rawJs.trim()) {
				const script = doc.createElement('script');
				script.textContent = rawJs;
				doc.body.appendChild(script);
			}

			const scriptContainer = document.createElement('div');
			scriptContainer.innerHTML = injectedScripts;
			if (doc.head) doc.head.insertBefore(scriptContainer.firstElementChild!, doc.head.firstChild);

			return `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
		}

		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<base href="${baseHref}">
			${injectedScripts}
			<style>${rawCss || ''}</style>
		</head>
		<body>
			${rawHtml || ''}
			<script>${rawJs || ''}<\/script>
		</body>
		</html>`;
	}

	$effect(() => {
		const _html = html;
		const _css = css;
		const _js = js;

		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(() => {
			const content = constructPreview(_html, _css, _js);
			const blob = new Blob([content], { type: 'text/html' });
			const url = URL.createObjectURL(blob);

			if (iframeSrc) URL.revokeObjectURL(iframeSrc);
			iframeSrc = url;
		}, 500);

		return () => {
			clearTimeout(debounceTimer);
			if (iframeSrc) URL.revokeObjectURL(iframeSrc);
		};
	});

	// Listen for messages coming from the iframe
	onMount(() => {
		const handleMessage = (event: MessageEvent) => {
			// Verify message is from our iframe format
			if (event.data && event.data.source === 'preview-iframe') {
				if (event.data.type === 'NAVIGATE') {
					// Update our fake address bar!
					simulatedUrl = event.data.url;
				}
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	});
</script>

<iframe
	src={iframeSrc}
	title="Preview"
	class="h-full w-full border-0 bg-transparent"
	sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox"
	style="color-scheme: auto;"
></iframe>
