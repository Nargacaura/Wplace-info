<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { locale, waitLocale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { getLocalStorageLocale, localSessionLocale } from '$lib';

	let { children } = $props();

	onMount(async (): Promise<void> => {
		// Try to restore locale from session storage first
		const storedLocale = getLocalStorageLocale();
		localSessionLocale.set(storedLocale);

		await new Promise((resolve) => setTimeout(resolve, 100)); // Slight delay to ensure store is updated

		if (storedLocale) {
			// Use stored locale if available
			locale.set(storedLocale);
			await waitLocale();
		} else {
			// Fallback to browser locale if no stored locale
			if (browser) {
				const browserLocale = window.navigator.language.split('-')[0];
				locale.set(browserLocale);
				await waitLocale();
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="favicon_alt.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta
		name="description"
		content="A tool that permits parsing the user information taken from Wplace's backend for more readability."
	/>
	<meta name="author" content="Pagos (@Nargacaura)" />
	<title>Wplace user information GUI</title>
</svelte:head>

{@render children?.()}
