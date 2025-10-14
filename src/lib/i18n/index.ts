// src/lib/i18n/index.ts
import { browser } from '$app/environment';
import { localSessionLocale } from '$lib';
import { init, register } from 'svelte-i18n';
import { get } from 'svelte/store';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('fr', () => import('./locales/fr.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: get(localSessionLocale) || (browser ? window.navigator.language : defaultLocale)
});
