// src/lib/i18n/index.ts
import { browser } from '$app/environment';
import { getLocalStorageLocale } from '$lib';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('fr', () => import('./locales/fr.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale:
		(await getLocalStorageLocale()) ??
		(browser ? window.navigator.language.split('-')[0] : defaultLocale)
});
