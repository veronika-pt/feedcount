import { writable } from 'svelte/store';
import { defaultSetup } from '$lib/data/setupDefaults.js';
import { loadSetup, saveSetup } from '$lib/storage/setupStorage.js';

/**
 * @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup
 */

/** @type {import('svelte/store').Writable<FeedCountSetup>} */
export const setup = writable(defaultSetup);

/**
 * Loads saved setup into the store.
 * Should be called in the browser, usually from a component on mount.
 */
export function initialiseSetup() {
	setup.set(loadSetup());
}

/**
 * Updates setup store and saves it to localStorage.
 *
 * @param {FeedCountSetup} nextSetup
 */
export function updateSetup(nextSetup) {
	setup.set(nextSetup);
	saveSetup(nextSetup);
}