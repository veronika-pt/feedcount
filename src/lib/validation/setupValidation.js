import { getDailyEnergyTarget } from '$lib/calculations/dailyEnergyTarget.js';

/** @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup */
/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {string[]} messages
 */

/** @param {unknown} value */
function isPositiveNumber(value) {
	const numberValue = Number(value);
	return Number.isFinite(numberValue) && numberValue > 0;
}

/** @param {unknown} value */
function isValidBirthDate(value) {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const date = new Date(`${value}T00:00:00`);
	const [year, month, day] = value.split('-').map(Number);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/**
 * Shared by the baby-details step and full setup validation.
 * @param {FeedCountSetup} setup
 * @param {Date} [referenceDate]
 * @returns {ValidationResult}
 */
export function validateBabyDetails(setup, referenceDate = new Date()) {
	const messages = [];
	if (!isValidBirthDate(setup.birthDate)) {
		messages.push('Enter a valid date of birth.');
	} else if (new Date(`${setup.birthDate}T00:00:00`) > referenceDate) {
		messages.push('Date of birth cannot be in the future.');
	}
	if (!['female', 'male', 'unspecified'].includes(setup.babySex)) {
		messages.push('Choose your baby’s sex, or Average.');
	}
	if (!isPositiveNumber(setup.currentWeightKg)) {
		messages.push('Add your baby’s current weight.');
	}
	// Use the existing age calculation and supported energy reference bands.
	if (messages.length === 0 && getDailyEnergyTarget(setup, referenceDate) === null) {
		messages.push('FeedCount estimates formula intake for babies up to 12 months old.');
	}
	return { isValid: messages.length === 0, messages };
}

/** @param {FeedCountSetup} setup @returns {ValidationResult} */
export function validateFormulaDetails(setup) {
	const messages = isPositiveNumber(setup.formulaKcalPer100ml)
		? []
		: ['Add the formula energy value.'];
	return { isValid: messages.length === 0, messages };
}

/**
 * @param {FeedCountSetup} setup
 * @param {Date} [referenceDate]
 * @returns {ValidationResult}
 */
export function validateSetup(setup, referenceDate = new Date()) {
	const messages = [
		...validateBabyDetails(setup, referenceDate).messages,
		...validateFormulaDetails(setup).messages
	];
	if (!Array.isArray(setup.bottleSizesMl) || setup.bottleSizesMl.length === 0) {
		messages.push('Add at least one bottle size.');
	} else if (!setup.bottleSizesMl.every(isPositiveNumber)) {
		messages.push('Bottle sizes must be positive prepared formula volumes.');
	}
	return { isValid: messages.length === 0, messages };
}
