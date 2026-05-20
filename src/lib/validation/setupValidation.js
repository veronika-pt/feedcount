/**
 * @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup
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
function isPositiveNumber(value) {
	const numberValue = Number(value);

	return Number.isFinite(numberValue) && numberValue > 0;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isValidBirthDate(value) {
	if (typeof value !== 'string') {
		return false;
	}

	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return false;
	}

	const date = new Date(value);

	return !Number.isNaN(date.getTime());
}

/**
 * @param {FeedCountSetup} setup
 * @returns {ValidationResult}
 */
export function validateSetup(setup) {
	const messages = [];

	if (!isValidBirthDate(setup.birthDate)) {
		messages.push('Add your baby’s birth date.');
	}

	if (!isPositiveNumber(setup.currentWeightKg)) {
		messages.push('Add your baby’s current weight.');
	}

	if (!isPositiveNumber(setup.formulaKcalPer100ml)) {
		messages.push('Add the formula energy value.');
	}

	if (!Array.isArray(setup.bottleSizesMl) || setup.bottleSizesMl.length === 0) {
		messages.push('Add at least one bottle size.');
	}

	return {
		isValid: messages.length === 0,
		messages
	};
}