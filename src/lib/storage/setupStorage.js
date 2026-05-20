import { defaultSetup } from '$lib/data/setupDefaults.js';

const SETUP_STORAGE_KEY = 'feedcount-setup';

/**
 * @param {unknown} value
 * @returns {number}
 */
function toPositiveNumber(value) {
	const numberValue = Number(value);

	if (!Number.isFinite(numberValue) || numberValue <= 0) {
		return 0;
	}

	return numberValue;
}

/**
 * @param {unknown} value
 * @returns {number[]}
 */
function toValidBottleSizes(value) {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map(Number)
		.filter((bottleSizeMl) => Number.isFinite(bottleSizeMl) && bottleSizeMl > 0);
}

/**
 * @param {unknown} value
 * @returns {import('$lib/data/setupDefaults.js').FeedCountSetup}
 */
function toValidSetup(value) {
	if (typeof value !== 'object' || value === null) {
		return { ...defaultSetup };
	}

	const partialSetup = /** @type {Partial<import('$lib/data/setupDefaults.js').FeedCountSetup>} */ (
		value
	);

	return {
		...defaultSetup,
		...partialSetup,
		birthDate:
			typeof partialSetup.birthDate === 'string'
				? partialSetup.birthDate
				: defaultSetup.birthDate,
		currentWeightKg: toPositiveNumber(partialSetup.currentWeightKg),
		formulaKcalPer100ml: toPositiveNumber(partialSetup.formulaKcalPer100ml),
		bottleSizesMl: toValidBottleSizes(partialSetup.bottleSizesMl)
	};
}

/**
 * Loads setup data from localStorage.
 * Falls back to default setup if there is no saved setup or if parsing fails.
 *
 * @returns {import('$lib/data/setupDefaults.js').FeedCountSetup}
 */
export function loadSetup() {
	if (typeof localStorage === 'undefined') {
		return { ...defaultSetup };
	}

	try {
		const savedSetup = localStorage.getItem(SETUP_STORAGE_KEY);

		if (!savedSetup) {
			return { ...defaultSetup };
		}

		return toValidSetup(JSON.parse(savedSetup));
	} catch {
		return { ...defaultSetup };
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

	localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(toValidSetup(setup)));
}