<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { backendInfo, formatCoordinate, formatTime, getLocalStorageLocale, reset } from '$lib';
</script>

<div class="my-8 flex flex-col items-center">
	<!-- Fieldset grid with user information -->
	<div class="grid w-[90%] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<!-- Fieldset indicating the last suspension -->
		<fieldset class="list-inside border border-gray-300 p-4 text-center">
			<legend class="text-xl">{$_('data.last-suspension')}</legend>
			{#if $backendInfo!.suspensionReason}
				{#if $backendInfo!.banned}
					<p class="text-4xl text-red-700">
						{$_('account-status.banned', {
							values: {
								reason: $backendInfo!.suspensionReason
									? $_('data.suspension-reason.' + $backendInfo!.suspensionReason)
									: $_('data.suspension-reason.unknown')
							}
						})}
					</p>
				{:else}
					{@const nowTimestamp = new Date().getTime()}
					{@const formattedDateUntilSuspensionEnding = new Date($backendInfo!.timeoutUntil)}
					{@const suspensionTimestamp = formattedDateUntilSuspensionEnding.getTime()}

					<p class="text-4xl text-red-700">
						{$_('account-status.suspended', {
							values: {
								reason: $backendInfo!.suspensionReason
									? $_('data.suspension-reason.' + $backendInfo!.suspensionReason)
									: $_('data.suspension-reason.unknown'),
								until: formattedDateUntilSuspensionEnding.toLocaleDateString(
									getLocalStorageLocale() as string,
									{
										year: 'numeric',
										month: 'numeric',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									}
								),
								conjugateBeing:
									nowTimestamp > suspensionTimestamp
										? $_('conjugate-being.past')
										: $_('conjugate-being.present')
							}
						})}
					</p>
				{/if}

				{$_('account-status.appeal-info')}
			{:else}
				<p class="text-gray-700">{$_('errors.no-suspension')}</p>
			{/if}
		</fieldset>
		<!-- General Information fieldset -->
		<fieldset class="rounded border border-gray-300 p-4 text-center">
			<legend class="text-xl">{$_('data.general-information')}</legend>
			<ul class="list-inside list-disc text-left">
				<li>
					<strong>{$_('data.name')}:</strong>
					<img
						src={$backendInfo!.picture}
						alt={$backendInfo!.name}
						class="mx-1 inline w-6 rounded-full"
					/>
					{$backendInfo!.name} #{$backendInfo!.id}
				</li>
				<li>
					<strong>{$_('data.is-in-alliance')}</strong>
					{$backendInfo!.allianceId ? $_('boolean.yes') : $_('boolean.no')}
				</li>
				{#if $backendInfo!.discordId}
					<li>
						<strong>{$_('data.discord')}:</strong>
						{$backendInfo!.discord}
					</li>
				{/if}
				<li>
					<strong>{$_('data_flag_equipped')}</strong>
					{$backendInfo!.equippedFlag ? $_('boolean.yes') : $_('boolean.no')}
				</li>
			</ul>
		</fieldset>

		<!-- Level & droplets fieldset -->
		<fieldset class="rounded border border-gray-300 p-4 text-center">
			<legend class="text-xl">{$_('data.level-and-droplets')}</legend>
			<ul class="list-inside list-disc text-left">
				<li>
					<strong>{$_('data.level')}:</strong>
					{Math.floor($backendInfo!.level)}
				</li>
				<li><strong>{$_('data.pixels-placed')}:</strong> {$backendInfo!.pixelsPainted}</li>
				<li>
					<strong
						>{$_('data.level-progress', {
							values: { nextLevel: Math.floor($backendInfo!.level + 1) }
						})}:</strong
					>
					{($backendInfo!.level % 1) * 100}%
				</li>
				<li>
					<strong>{$_('data.droplets')}:</strong>
					{$backendInfo!.droplets}
				</li>
				<li>
					<strong>{$_('data.max-charges')}:</strong>
					{$backendInfo!.charges.max}
				</li>
				<li>
					<strong>{$_('data.cooldown')}:</strong>
					{formatTime(
						$backendInfo!.charges.max * $backendInfo!.charges.cooldownMs -
							$backendInfo!.charges.count * $backendInfo!.charges.cooldownMs
					)}
				</li>
			</ul>
		</fieldset>

		<!-- Favorites fieldset -->
		<fieldset class="rounded border border-gray-300 p-4 text-center">
			<legend class="text-xl"
				>{$_('data.favorites')} ({$backendInfo!.favoriteLocations.length} / {$backendInfo!
					.maxFavoriteLocations})</legend
			>
			<ul class="list-inside list-disc text-left">
				{#if $backendInfo!.favoriteLocations.length > 0}
					{#each $backendInfo!.favoriteLocations as location (location.id)}
						<li>
							<a
								href="https://wplace.live/?lat={location.latitude}&lng={location.longitude}&zoom=14"
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-500"
							>
								{formatCoordinate(location.latitude, true)}, {formatCoordinate(
									location.longitude,
									false
								)}
							</a>
						</li>
					{/each}
				{:else}
					<li>{$_('data.no-favorites')}</li>
				{/if}
			</ul>
		</fieldset>
	</div>
</div>

<!-- Reset button -->
<div class="mt-4">
	<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" onclick={reset}>
		{$_('actions.reset')}
	</button>
</div>
