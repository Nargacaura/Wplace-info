<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { locale, waitLocale, _ } from 'svelte-i18n';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { Fr, Gb } from 'svelte-flag-icons';
	import { backendInfo, didFailFetching, getLocalStorageLocale, loadBackendInfo, setLocalStorageLocale } from '$lib';

	let { children } = $props();

	let loadingPage: boolean = $state(true);
	let fetchError: boolean = $state(false);
	let currentLocale: string | null = $state(getLocalStorageLocale());

	onMount(async (): Promise<void> => {
		// Set locale to browser locale if not set in session storage
		if (!currentLocale) {
			if (browser) {
				locale.set(window.navigator.language);
			}
			await waitLocale();

			currentLocale = $locale as string;
			setLocalStorageLocale(currentLocale);
		}
		await loadBackendInfo();
	});
</script>

<svelte:head>
	<link rel="icon" href={$backendInfo?.picture || favicon} />
	<title>{$backendInfo?.name ? `${$backendInfo.name}\'s Wplace info'` : $didFailFetching? 'Oops.': 'Loading...'}</title>
</svelte:head>

<!-- Change locale button -->
<button
	class="absolute top-4 right-4 z-10 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
	onclick={() => {
		setLocalStorageLocale(currentLocale === 'en' ? 'fr' : 'en');
		currentLocale = getLocalStorageLocale();
	}}
	aria-label={$_('buttons.change-language')}
	title={$_('buttons.change-language')}
>
	{#if currentLocale === 'en'}
		<Fr />
	{:else}
		<Gb />
	{/if}
</button>

{@render children?.()}