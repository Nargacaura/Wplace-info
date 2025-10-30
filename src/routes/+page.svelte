<script lang="ts">
	import {
		backendInfo,
		didFailFetching,
		loadingBackendInfo,
		readTextInput,
		setLocalStorageLocale
	} from '$lib';
	import WplaceInfo from '$lib/components/WplaceInfo.svelte';
	import { _, locale } from 'svelte-i18n';
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
			<h1 class="my-8 flex w-full items-center justify-between">
				<span class="display text-3xl font-bold">🐴 {$_('fetch.title')}</span>
				<small>
					<!-- Language selection -->
					<div class="mt-4 flex justify-center">
						<div class="relative">
							<select
								class="appearance-none rounded bg-gray-200 px-4 py-2 pr-8 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								onchange={(e) => setLocalStorageLocale((e.target as HTMLSelectElement).value)}
								value={$locale}
							>
								<option value="en">🇬🇧 English</option>
								<option value="fr">🇫🇷 Français</option>
							</select>
							<!-- Custom arrow -->
							<div
								class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
							>
								<svg
									class="h-4 w-4 fill-current"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path
										d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</small>
			</h1>

			<p class="text-center text-base">{$_('fetch.description')}</p>

			<a
				class="inline-block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600"
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
				class="inline-block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600"
			>
				{$_('buttons.get-json')} 🐴
			</a>
			<br />

			<p class="text-center text-base">{$_('errors.upload-json-manually')}</p>
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
			</p>

			<p class="mt-4 text-center text-gray-600">
				<!-- Author -->
				<small class="text-md block text-center text-gray-400">
					{$_('footer.made-with')} ❤️ & 🐴🐴 {$_('footer.in-svelte')}
					{$_('footer.created-by')}
					<a
						href="https://nargacaura.github.io"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-500 underline"
					>
						Pagos
						<span title={$_('footer.info.unicode-orca')}>🫍</span>
					</a>.
					{$_('footer.source-code-on')}
					<a
						href="https://github.com/nargacaura/wplace-info"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-500 underline"
					>
						GitHub
					</a>.
				</small>
			</p>
		</footer>
	{/if}
</div>
