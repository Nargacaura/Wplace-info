<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { locale, waitLocale, _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { localSessionLocale, setLocalStorageLocale } from '$lib';

	let { children } = $props();

	onMount(async (): Promise<void> => {
		// Set locale to browser locale if not set in session storage
		if (!$localSessionLocale) {
			if (browser) {
				locale.set(window.navigator.language);
			}
			await waitLocale();

			setLocalStorageLocale($locale as string, true);
		}
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="favicon_alt.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Wplace user information JSON-to-GUI tool" />
	<meta name="author" content="Pagos (@Nargacaura)" />
	<title>Wplace user information GUI</title>
</svelte:head>

{@render children?.()}
