<script lang="ts">
	import {
		backendInfo,
		didFailFetching,
		loadingBackendInfo,
		readTextInput,
		initializeTheme
	} from '$lib';
	import WplaceInfo from '$lib/components/WplaceInfo.svelte';
	import ThemeSelector from '$lib/components/ThemeSelector.svelte';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import { _ } from 'svelte-i18n';
	import { Toaster } from 'svelte-french-toast';
	import { onMount } from 'svelte';

	// eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
	let { dispatch } = $props(); // Added to pass to selectors and avoid a Svelte error raised by the IDE

	onMount(async () => {
		initializeTheme(); // Initialize theme system
		await new Promise((resolve) => setTimeout(resolve, 500)); // Slight delay to ensure loading state is accurate
		loadingBackendInfo.set(false);
	});
</script>

<Toaster position="top-right" />

<div
	class="mx-auto flex min-h-screen w-[97%] flex-col items-center justify-center gap-4 bg-white p-4 text-gray-900 dark:bg-black dark:text-gray-100"
>
	{#if $loadingBackendInfo}
		<div
			class="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-blue-500 dark:border-orange-400"
		></div>
	{:else}
		{#if $didFailFetching}
			<h1 class="my-8 flex w-full items-center justify-between">
				<span class="display text-3xl font-bold">🐴 {$_('fetch.title')}</span>
				<small>
					<!-- Language and Theme selection -->
					<div class="mt-4 flex justify-center gap-4">
						<!-- Language selection -->
						<LanguageSelector {dispatch} />

						<!-- Theme selection -->
						<ThemeSelector {dispatch} />
					</div>
				</small>
			</h1>

			<p class="text-center text-base text-gray-700 dark:text-gray-300">
				{$_('fetch.description')}
			</p>

			<a
				class="inline-block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600 dark:bg-orange-700 dark:hover:bg-red-600"
				href="https://wplace.live/"
				target="_blank"
				rel="noopener noreferrer"
			>
				{$_('buttons.login')} 🌎
			</a>

			<a
				href="https://backend.wplace.live/me"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600 dark:bg-orange-700 dark:hover:bg-red-600"
			>
				{$_('buttons.get-json')} 🐴
			</a>
			<br />

			<p class="text-center text-base text-gray-700 dark:text-gray-300">
				{$_('errors.upload-json-manually')}
			</p>
			<textarea
				id="jsonInput"
				class="h-40 w-[90%] rounded border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
				placeholder={$_('placeholders.json-input')}
				onkeydown={(e) => {
					// Allowed keys: Delete, Backspace, Tab, Ctrl+A, Ctrl+X, Ctrl+C, Ctrl+V
					const allowedKeys = ['Delete', 'Backspace', 'Tab'];

					const allowedCtrlKeys = [
						'a', // Ctrl+A (select all)
						'x', // Ctrl+X (cut)
						'c', // Ctrl+C (copy)
						'v', // Ctrl+V (paste)
						'z' // Ctrl+Z (cancel)
					];

					// If it's a combination with Ctrl or an allowed key without Ctrl
					if (
						(e.ctrlKey && allowedCtrlKeys.includes(e.key.toLowerCase())) ||
						(!e.ctrlKey && allowedKeys.includes(e.key))
					) {
						return; // Allow
					}

					// Block all other keys
					e.preventDefault();
				}}
			></textarea>
			<br />
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-orange-700 dark:hover:bg-red-600"
				id="upload-json"
				onclick={async () => {
					await readTextInput();
				}}
			>
				{$_('buttons.upload-json')}
			</button>
		{:else}
			<h1 class="my-8 flex w-full items-center justify-between">
				<span class="display flex items-center text-3xl font-bold">
					{#if $backendInfo!.picture}
						<img
							src={$backendInfo!.picture}
							alt={$backendInfo!.name}
							class="mx-2 w-8 rounded-full"
						/>
					{/if}
					{#if $backendInfo!.name}
						{$_('data.title', { values: { name: $backendInfo!.name } })}
					{/if}
				</span>

				<small>
					<!-- Language and Theme selection -->
					<div class="mt-4 flex justify-center gap-4">
						<!-- Language selection -->
						<LanguageSelector {dispatch} />

						<!-- Theme selection -->
						<ThemeSelector {dispatch} />
					</div>
				</small>
			</h1>

			<WplaceInfo />
		{/if}

		<footer
			class="bottom-0 mx-auto mt-auto mb-4 w-[90%] rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800"
		>
			<!-- Disclaimer of non-affiliation -->
			<p class="text-center text-xl text-red-500">
				⚠️ {$_('footer.disclaimer')}
			</p>

			<p class="mt-4 text-center text-gray-600 dark:text-gray-300">
				<!-- Author -->
				<small class="text-md block text-center text-gray-400 dark:text-gray-500">
					{$_('footer.made-with')} ❤️ & 🐴🐴 {$_('footer.in-svelte')}
					{$_('footer.created-by')}
					<a
						href="https://nargacaura.github.io"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-500 underline hover:text-blue-600 dark:text-orange-400 dark:hover:text-red-600"
					>
						Pagos
						<span title={$_('footer.info.unicode-orca')}>🫍</span>
					</a>.
					{$_('footer.source-code-on')}
					<a
						href="https://github.com/nargacaura/wplace-info"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-500 underline hover:text-blue-600 dark:text-orange-400 dark:hover:text-red-600"
					>
						GitHub
					</a>.
				</small>
			</p>
		</footer>
	{/if}
</div>
