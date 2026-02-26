<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as monaco from 'monaco-editor';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	interface Props {
		value: string;
		language: string;
		onchange?: (value: string) => void;
	}

	let { value = '', language = 'html', onchange }: Props = $props();

	let editorContainer: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor | null = null;

	onMount(() => {
		// Configure workers
		self.MonacoEnvironment = {
			getWorker(_: any, label: string) {
				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return new cssWorker();
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return new htmlWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			}
		};

		// Configure Monaco Editor
		monaco.editor.defineTheme('codepen-dark', {
			base: 'vs-dark',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': '#1e1e1e'
			}
		});

		// Create editor
		editor = monaco.editor.create(editorContainer, {
			value,
			language,
			theme: 'codepen-dark',
			automaticLayout: true,
			fontSize: 14,
			minimap: { enabled: false },
			scrollBeyondLastLine: false,
			tabSize: 2
		});

		// Listen to content changes
		editor.onDidChangeModelContent(() => {
			if (editor && onchange) {
				onchange(editor.getValue());
			}
		});

		return () => {
			editor?.dispose();
		};
	});

	// Update editor value when prop changes
	$effect(() => {
		if (editor && editor.getValue() !== value) {
			editor.setValue(value);
		}
	});

	// Update editor language when prop changes
	$effect(() => {
		if (editor) {
			const model = editor.getModel();
			if (model) {
				monaco.editor.setModelLanguage(model, language);
			}
		}
	});

	onDestroy(() => {
		editor?.dispose();
	});
</script>

<div bind:this={editorContainer} class="h-full w-full"></div>
