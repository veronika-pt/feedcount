/**
 * @typedef {import('$lib/data/dailyInputDefaults.js').DailyInput} DailyInput
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {string[]} messages
 */

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isNonNegativeNumber(value) {
	const numberValue = Number(value);

	return Number.isFinite(numberValue) && numberValue >= 0;
}

/**
 * @param {DailyInput} dailyInput
 * @returns {ValidationResult}
 */
export function validateDailyInput(dailyInput) {
	const messages = [];

	if (!isNonNegativeNumber(dailyInput.formulaConsumedMl)) {
		messages.push('Add today’s formula amount as 0 ml or more.');
	}

	return {
		isValid: messages.length === 0,
		messages
	};
}