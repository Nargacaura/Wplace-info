<script lang="ts">
	import {
		backendInfo,
		didFailFetching,
		getLocalStorageLocale,
		loadingBackendInfo,
		reload,
		setLocalStorageLocale
	} from '$lib';
	import WplaceInfo from '$lib/components/WplaceInfo.svelte';
	import { _ } from 'svelte-i18n';
	import { Fr, Gb } from 'svelte-flag-icons';
</script>

<div class="flex h-screen flex-col items-center justify-center">
	{#if $loadingBackendInfo}
		<div class="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
	{:else}
		{#if $didFailFetching}
			<h1 class="my-8 flex items-center text-3xl font-bold">
				{$_('errors.fetch-failure-title')}
			</h1>
			<p class="mb-4 text-lg text-red-500">{$_('errors.fetch-failure')}</p>

			<div class="mb-4">
				<a
					href="https://wplace.live/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 underline"
				>
					{$_('buttons.login')}
				</a>
			</div>
			<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" onclick={reload}>
				{$_('buttons.retry')}
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
			<p class="my-4 text-center text-xl text-red-500">
				{$_('footer.disclaimer')}

				<a
					href="https://backend.wplace.live/me"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 underline"
				>
					Raw JSON
				</a>
			</p>

			<p class="mb-4 text-center text-gray-600">
				{$_('available-in.beginning')}
				<Fr class="inline h-6 w-6 cursor-pointer"
					onclick={() => {
						setLocalStorageLocale('fr');
					}}
				/> & <Gb class="inline h-6 w-6 cursor-pointer" onclick={() => {
						setLocalStorageLocale('en');
					}} />. {$_('available-in.ending')}

				<!-- Author -->
				<small class="text-md mb-4 block text-center text-gray-400">
					{$_('footer.made-with')} ❤️ {$_('footer.in-svelte')}
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
