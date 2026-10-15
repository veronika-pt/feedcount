import { defaultSetup } from '$lib/data/setupDefaults.js';
import { validateSetup } from '$lib/validation/setupValidation.js';

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
	// Validate the stored fields before adding defaults: defaults are not evidence of setup.
	const isConfigured = validateSetup(
		/** @type {import('$lib/data/setupDefaults.js').FeedCountSetup} */ (partialSetup)
	).isValid;
	const onboardingCompleted = Object.hasOwn(partialSetup, 'onboardingCompleted')
		? partialSetup.onboardingCompleted === true
		: isConfigured;

	// Retire the legacy mixed default while preserving all entered profile values.
	if (isConfigured) {
		return { ...defaultSetup, ...partialSetup, feedingMode: 'formulaOnly', onboardingCompleted };
	}

	return {
		...defaultSetup,
		...partialSetup,
		feedingMode: 'formulaOnly',
		onboardingCompleted,
		birthDate:
			typeof partialSetup.birthDate === 'string' ? partialSetup.birthDate : defaultSetup.birthDate,
		currentWeightKg: toPositiveNumber(partialSetup.currentWeightKg),
		formulaKcalPer100ml: toPositiveNumber(partialSetup.formulaKcalPer100ml),
		bottleSizesMl: toValidBottleSizes(partialSetup.bottleSizesMl)
	};
}

/**
 * Loads setup data from localStorage.
 * Falls back to default setup if there is no saved setup or if parsing fails.
 *
 * @param {{ throwOnReadError?: boolean }} [options]
 * @returns {import('$lib/data/setupDefaults.js').FeedCountSetup}
 */
export function loadSetup({ throwOnReadError = false } = {}) {
	let savedSetup;
	try {
		if (typeof localStorage === 'undefined') {
			if (throwOnReadError) throw new Error('Setup storage is unavailable.');
			return { ...defaultSetup };
		}
		savedSetup = localStorage.getItem(SETUP_STORAGE_KEY);
	} catch (error) {
		// A save must never merge against defaults when the latest record could not be read.
		if (throwOnReadError) throw error;
		return { ...defaultSetup };
	}

	if (!savedSetup) return { ...defaultSetup };
	try {
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
