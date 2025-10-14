// place files you want to import through the `$lib` alias in this folder.

import { get, writable, type Writable } from 'svelte/store';
import { _, locale } from 'svelte-i18n';
import toast from 'svelte-french-toast';

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	experiments?: Record<string, any>;
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
export const didFailFetching: Writable<boolean> = writable(true);

/**
 * Reads a JSON file containing the data given by the `BackendInfo` type. Converts this JSON into a `BackendInfo` object.
 * @param json - The JSON string to parse.
 * @returns The parsed `BackendInfo` object.
 * @throws Will throw an error if the JSON is invalid or does not conform to the `BackendInfo` type.
 */
export function parseBackendInfo(json: string): BackendInfo {
	const data = JSON.parse(json) as BackendInfo;

	if (typeof data !== 'object' || data === null)
		throw new Error('Invalid backend info format');

	if (
		typeof data.banned !== 'boolean' ||
		typeof data.charges !== 'object' ||
		typeof data.charges.cooldownMs !== 'number' ||
		typeof data.charges.count !== 'number' ||
		typeof data.charges.max !== 'number' ||
		typeof data.droplets !== 'number' ||
		typeof data.extraColorsBitmap !== 'number' ||
		!Array.isArray(data.favoriteLocations) ||
		typeof data.flagsBitmap !== 'string' ||
		typeof data.id !== 'number' ||
		typeof data.isCustomer !== 'boolean' ||
		typeof data.level !== 'number' ||
		typeof data.maxFavoriteLocations !== 'number' ||
		typeof data.name !== 'string' ||
		typeof data.needsPhoneVerification !== 'boolean' ||
		typeof data.pixelsPainted !== 'number' ||
		typeof data.showLastPixel !== 'boolean' ||
		typeof data.timeoutUntil !== 'string'
	) throw new Error('Incomplete backend info data');

	return data;
}

/**
 * Fetches the backend information for the current user.
 * @returns A promise that resolves to the backend information.
 *
 * That doesn't work right now, with a "Forbidden" response from the backend...
 */
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
export const localSessionLocale: Writable<string | null> = writable(getLocalStorageLocale());

export function setLocalStorageLocale(givenLocale: string, skipLocaleSetting = false): void {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem('locale', givenLocale);
	}
	if (!skipLocaleSetting) {
		locale.set(givenLocale);
	}
	localSessionLocale.set(givenLocale);
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
 * Reads the JSON input from a textarea with the ID 'json-input', parses it, and updates the backendInfo store.
 */
export async function readTextInput(): Promise<void> {
	const inputElement = document.getElementById('jsonInput') as HTMLTextAreaElement | null;

	if (inputElement) {
		try {
			const json = inputElement.value;
			loadingBackendInfo.set(true);
			const info = parseBackendInfo(json);
			setBackendInfo(info);
			didFailFetching.set(false);
		} catch (e) {
			console.error(e);
			setBackendInfo(null);
			didFailFetching.set(true);
			toast.error(get(_)('errors.fetch-failure'));
		} finally {
			await new Promise((resolve) => setTimeout(resolve, 500)); // Artificial delay for better UX
			loadingBackendInfo.set(false);
		}
	}
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
