<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { getLocaleFromNavigator, locale, waitLocale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { getLocalStorageLocale, setLocalStorageLocale, initializeTheme } from '$lib';

	let { children } = $props();

	onMount(async (): Promise<void> => {
		// Initialize theme system first to prevent flash
		initializeTheme();

		// Try to restore locale from session storage first
		const storedLocale = getLocalStorageLocale();
		await new Promise((resolve) => setTimeout(resolve, 100)); // Slight delay to ensure store is updated

		if (storedLocale) {
			// Use stored locale if available
			locale.set(storedLocale);
		} else {
			// Fallback to browser locale if no stored locale
			locale.set((getLocaleFromNavigator() as string).split('-')[0] === 'fr' ? 'fr' : 'en');
		}
		await waitLocale();

		setLocalStorageLocale($locale as string);
		await new Promise((resolve) => setTimeout(resolve, 100));
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
