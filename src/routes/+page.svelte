<script lang="ts">
	import {
		backendInfo,
		didFailFetching,
		loadingBackendInfo,
		readTextInput,
		setsessionStorageLocale
	} from '$lib';
	import WplaceInfo from '$lib/components/WplaceInfo.svelte';
	import { _ } from 'svelte-i18n';
	import { Fr, Gb } from 'svelte-flag-icons';
	import { Toaster } from 'svelte-french-toast';
	import { onMount } from 'svelte';

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 500)); // Slight delay to ensure loading state is accurate
		loadingBackendInfo.set(false);
	});
</script>

<Toaster position="top-right" />

<div class="mx-auto flex min-h-screen w-[97%] flex-col items-center justify-center gap-4 p-4">
	{#if $loadingBackendInfo}
		<div class="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
	{:else}
		{#if $didFailFetching}
			<h1 class="my-8 flex items-center text-center text-3xl font-bold">
				🐴 {$_('fetch.title')}
			</h1>
			<p class="text-lg">{$_('fetch.description')}</p>

			<a
				class="inline-block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600"
				href="https://wplace.live/"
				target="_blank"
				rel="noopener noreferrer"
			>
				{$_('buttons.login')} 🐴
			</a>
			<br />

			<p class="text-base">{$_('errors.upload-json-manually')}</p>
			<textarea
				id="jsonInput"
				class="h-40 w-[90%] rounded border border-gray-300 p-2"
				placeholder={$_('placeholders.json-input')}
				onkeydown={(e) => {
					// Allowed keys: Delete, Backspace, Tab, Ctrl+A, Ctrl+X, Ctrl+C, Ctrl+V
					const allowedKeys = ['Delete', 'Backspace', 'Tab'];

					const allowedCtrlKeys = [
						'a', // Ctrl+A (select all)
						'x', // Ctrl+X (cut)
						'c', // Ctrl+C (copy)
						'v' // Ctrl+V (paste)
					];

					// If it's a combination with Ctrl
					if (e.ctrlKey && allowedCtrlKeys.includes(e.key.toLowerCase())) {
						return; // Allow
					}

					// If it's an allowed key without Ctrl
					if (!e.ctrlKey && allowedKeys.includes(e.key)) {
						return; // Allow
					}

					// Block all other keys
					e.preventDefault();
				}}
			></textarea>
			<br />
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				id="upload-json"
				onclick={async () => {
					await readTextInput();
				}}
			>
				{$_('buttons.upload-json')}
			</button>
		{:else}
			<h1 class="my-8 flex items-center text-3xl font-bold">
				{#if $backendInfo!.picture}
					<img src={$backendInfo!.picture} alt={$backendInfo!.name} class="mx-2 w-8 rounded-full" />
				{/if}
				{#if $backendInfo!.name}
					{$_('data.title', { values: { name: $backendInfo!.name } })}
				{/if}
			</h1>

			<WplaceInfo />
		{/if}

		<footer class="bottom-0 mx-auto mt-auto mb-4 w-[90%] rounded-lg bg-gray-100 p-4 text-center">
			<!-- Disclaimer of non-affiliation -->
			<p class="text-center text-xl text-red-500">
				⚠️ {$_('footer.disclaimer')}

				<a
					href="https://backend.wplace.live/me"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 underline"
				>
					Raw JSON
				</a>
				🐴
			</p>

			<p class="mt-4 text-center text-gray-600">
				{$_('available-in.beginning')}
				<Fr
					class="inline h-6 w-6 cursor-pointer"
					onclick={() => {
						setsessionStorageLocale('fr');
					}}
				/> & <Gb
					class="inline h-6 w-6 cursor-pointer"
					onclick={() => {
						setsessionStorageLocale('en');
					}}
				/>. {$_('available-in.ending')}

				<!-- Author -->
				<small class="text-md block text-center text-gray-400">
					{$_('footer.made-with')} ❤️ & 🐴🐴 {$_('footer.in-svelte')}
					{$_('footer.created-by')}
					<a
						href="https://nargacaura.github.io"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-500 underline">Pagos</a
					>
				</small>
			</p>
		</footer>
	{/if}
</div>
