<script lang="ts">
	import { backendInfo, didFailFetching, loadingBackendInfo, reload } from '$lib';
	import WplaceInfo from '$lib/components/WplaceInfo.svelte';
	import { _ } from 'svelte-i18n';
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
				<img src={$backendInfo!.picture} alt="{$backendInfo!.name}" class="rounded-full w-8 mx-2" />
			{/if}
			{#if $backendInfo!.name}
				{$_('data.title', { values: { name: $backendInfo!.name } })}
			{/if}
		</h1>

        <WplaceInfo />
	{/if}

	<footer class="mt-auto mb-4 text-center bg-gray-100 p-4 rounded-lg w-[90%] mx-auto bottom-0">
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

		<!-- Author -->
		<small class="mb-4 block text-center text-md text-gray-400">
			{$_('footer.made-with')} ❤️ {$_('footer.in-svelte')}
			{$_('footer.created-by')}
			<a
				href="https://nargacaura.github.io"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-500 underline">Pagos</a
			>
		</small>
	</footer>
{/if}
</div>
