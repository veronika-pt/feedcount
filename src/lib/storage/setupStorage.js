import { defaultSetup } from '$lib/data/setupDefaults.js';

const SETUP_STORAGE_KEY = 'feedcount-setup';

/**
 * Loads setup data from localStorage.
 * Falls back to default setup if there is no saved setup or if parsing fails.
 *
 * @returns {import('$lib/data/setupDefaults.js').FeedCountSetup}
 */
export function loadSetup() {
	if (typeof localStorage === 'undefined') {
		return defaultSetup;
	}

	try {
		const savedSetup = localStorage.getItem(SETUP_STORAGE_KEY);

		if (!savedSetup) {
			return defaultSetup;
		}

		return {
			...defaultSetup,
			...JSON.parse(savedSetup)
		};
	} catch {
		return defaultSetup;
	}
}

/**
 * Saves setup data to localStorage.
 *
 * @param {import('$lib/data/setupDefaults.js').FeedCountSetup} setup
 */
export function saveSetup(setup) {
	if (typeof localStorage === 'undefined') {
		return;
	}

	localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(setup));
}