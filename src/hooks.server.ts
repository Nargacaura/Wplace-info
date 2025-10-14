// hooks.server.ts
import { getLocalStorageLocale } from '$lib';
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
	const lang =
		getLocalStorageLocale() || event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang.split('-')[0]); // Set to the language code only (e.g., 'en' from 'en-US')
	}
	return resolve(event);
};
