// place files you want to import through the `$lib` alias in this folder.

import { writable, type Writable } from 'svelte/store';
import { locale } from 'svelte-i18n';

/**
 * Info fetched from Wplace's backend about the current user.
 */
export type BackendInfo = {
	allianceId?: number;
	allianceRole?: string;
	banned: boolean;
	charges: {
		cooldownMs: number;
		count: number;
		max: number;
	};
	country?: string;
	discord?: string;
	discordId?: string;
	droplets: number;
	equippedFlag?: number;
	experiments: Record<string, any>;
	extraColorsBitmap: number;
	favoriteLocations: Array<{
		id: number;
		name: string;
		latitude: number;
		longitude: number;
	}>;
	flagsBitmap: string;
	id: number;
	isCustomer: boolean;
	level: number;
	maxFavoriteLocations: number;
	name: string;
	needsPhoneVerification: boolean;
	picture?: string;
	pixelsPainted: number;
	suspensionReason?: string;
	showLastPixel: boolean;
	timeoutUntil: string;
};

export const backendInfo: Writable<BackendInfo | null> = writable(null);
export const loadingBackendInfo: Writable<boolean> = writable(true);
export const didFailFetching: Writable<boolean> = writable(false);

export async function fetchBackendInfos(): Promise<BackendInfo> {
	return await (await fetch('https://backend.wplace.live/me')).json();
}

export function setBackendInfo(info: BackendInfo | null): void {
	backendInfo.set(info);
}

export function getLocalStorageLocale(): string | null {
	if (typeof window !== 'undefined') {
		return window.localStorage.getItem('locale');
	}
	return null;
}

export function setLocalStorageLocale(givenLocale: string): void {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem('locale', givenLocale);
	}
	locale.set(givenLocale);
}

/**
 * Reloads the backend information by fetching it again.
 * Sets loadingPage to true while fetching and handles errors.
 */
export async function loadBackendInfo(): Promise<void> {
	try {
		backendInfo.set(await fetchBackendInfos());
	} catch (e) {
		backendInfo.set(null);
		console.error(e);
		didFailFetching.set(true);
	} finally {
		await new Promise((resolve) => setTimeout(resolve, 500)); // Artificial delay for better UX
		loadingBackendInfo.set(false);
	}
}

/**
 * Reloads the backend information by fetching it again.
 * Sets loadingPage to true while fetching and handles errors.
 */
export async function reload(): Promise<void> {
	loadingBackendInfo.set(true);
	didFailFetching.set(false);
	await loadBackendInfo();
}

/**
 * Displays a number as a time string in HH:MM:SS format.
 * @param ms - The number of milliseconds to format.
 * @returns A string representing the time in HH:MM:SS format.
 */
export function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Converts a number to a readable latitude/longitude coordinate string.
 * @param coord - The coordinate value to convert.
 * @param isLatitude - True if the coordinate is a latitude, false if it's a longitude.
 * @returns A string representing the coordinate in degrees with N/S/E/W suffix.
 */
export function formatCoordinate(coord: number, isLatitude: boolean): string {
	const absolute = Math.abs(coord);
	const degrees = Math.floor(absolute);
	const minutes = Math.floor((absolute - degrees) * 60);
	const seconds = Math.floor(((absolute - degrees) * 60 - minutes) * 60);
	const direction = isLatitude ? (coord >= 0 ? 'N' : 'S') : coord >= 0 ? 'E' : 'W';
	return `${degrees}°${minutes}'${seconds}" ${direction}`;
}
