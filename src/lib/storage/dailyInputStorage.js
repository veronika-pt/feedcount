import { defaultDailyInput } from '$lib/data/dailyInputDefaults.js';

const dailyInputStorageKey = 'feedcount.dailyInput.v1';

/**
 * @param {unknown} value
 * @returns {number}
 */
function toValidMl(value) {
	const numberValue = Number(value);

	if (!Number.isFinite(numberValue) || numberValue < 0) {
		return defaultDailyInput.formulaConsumedMl;
	}

	return numberValue;
}

/**
 * @param {unknown} value
 * @returns {number}
 */
function toValidFeedCount(value) {
	const numberValue = Number(value);

	if (!Number.isFinite(numberValue) || numberValue < 0) {
		return defaultDailyInput.formulaFeedsLeftToday;
	}

	return Math.floor(numberValue);
}

/**
 * @returns {import('$lib/data/dailyInputDefaults.js').DailyInput}
 */
export function loadDailyInput() {
	if (typeof localStorage === 'undefined') {
		return { ...defaultDailyInput };
	}

	const savedValue = localStorage.getItem(dailyInputStorageKey);

	if (!savedValue) {
		return { ...defaultDailyInput };
	}

	try {
		const parsedValue = JSON.parse(savedValue);

		return {
			...defaultDailyInput,
			formulaConsumedMl: toValidMl(parsedValue.formulaConsumedMl),
			formulaFeedsLeftToday: toValidFeedCount(parsedValue.formulaFeedsLeftToday)
		};
	} catch {
		return { ...defaultDailyInput };
	}
}

/**
 * @param {import('$lib/data/dailyInputDefaults.js').DailyInput} dailyInput
 */
export function saveDailyInput(dailyInput) {
	if (typeof localStorage === 'undefined') {
		return;
	}

	localStorage.setItem(
		dailyInputStorageKey,
		JSON.stringify({
			formulaConsumedMl: toValidMl(dailyInput.formulaConsumedMl),
			formulaFeedsLeftToday: toValidFeedCount(dailyInput.formulaFeedsLeftToday)
		})
	);
}