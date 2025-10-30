<script lang="ts">
	import { setLocalStorageLocale } from '$lib';
	import { locale } from 'svelte-i18n';

	let { dispatch } = $props();

	let isOpen = $state(false);
	let buttonRef: HTMLButtonElement;
	let dropdownRef = $state<HTMLUListElement>();

	const languages = [
		{ value: 'en', label: '🇬🇧 English' },
		{ value: 'fr', label: '🇫🇷 Français' }
	];

	function handleSelect(lang: string) {
		setLocalStorageLocale(lang);
		isOpen = false;
		dispatch?.('change', lang);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
			buttonRef?.focus();
		}
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Node;
		if (
			buttonRef &&
			!buttonRef.contains(target) &&
			(!dropdownRef || !dropdownRef.contains(target))
		) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="relative">
	<button
		bind:this={buttonRef}
		class="flex min-w-[140px] appearance-none items-center justify-between rounded bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:ring-orange-400"
		onclick={() => (isOpen = !isOpen)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				isOpen = !isOpen;
			}
		}}
		aria-label="Select language"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span>
			{languages.find((lang) => lang.value === $locale)?.label || '🇬🇧 English'}
		</span>
		<svg
			class="h-4 w-4 fill-current transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
		>
			<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
		</svg>
	</button>

	{#if isOpen}
		<ul
			bind:this={dropdownRef}
			class="absolute top-full right-0 left-0 z-10 mt-1 rounded border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
			role="listbox"
			onkeydown={handleKeydown}
		>
			{#each languages as language (language.value)}
				<li
					class="cursor-pointer px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 {$locale ===
					language.value
						? 'bg-blue-100 dark:bg-gray-600'
						: ''}"
					role="option"
					aria-selected={$locale === language.value}
					onclick={() => handleSelect(language.value)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleSelect(language.value);
						}
					}}
					tabindex="0"
				>
					{language.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>
