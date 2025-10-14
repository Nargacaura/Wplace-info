<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { locale, waitLocale, _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { getLocalStorageLocale, loadBackendInfo, localSessionLocale, setLocalStorageLocale } from '$lib';

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
		await loadBackendInfo();
	});
</script>

<svelte:head>
	<title>Wplace user information GUI</title>
</svelte:head>

{@render children?.()}