import { getCompletedAgeMonths } from '$lib/calculations/age.js';
import { getEnergyReferenceType } from '$lib/calculations/feedingMode.js';
import { getEnergyRequirementKcalPerKg } from '$lib/calculations/energyRequirement.js';

/**
 * @typedef {import('$lib/data/setupDefaults.js').BabySex} BabySex
 * @typedef {import('$lib/data/setupDefaults.js').FeedingMode} FeedingMode
 */

/**
 * @typedef {Object} DailyEnergyTargetInput
 * @property {string} birthDate
 * @property {BabySex} babySex
 * @property {FeedingMode | undefined} feedingMode
 * @property {number} currentWeightKg
 */

/**
 * @typedef {Object} DailyEnergyTargetResult
 * @property {number} ageMonths
 * @property {number} kcalPerKgPerDay
 * @property {number} kcalPerDay
 */

/**
 * Calculates the estimated daily energy target for an infant.
 *
 * @param {DailyEnergyTargetInput} input
 * @param {Date} [referenceDate]
 * @returns {DailyEnergyTargetResult | null}
 */
export function getDailyEnergyTarget(input, referenceDate = new Date()) {
	const ageMonths = getCompletedAgeMonths(input.birthDate, referenceDate);

	if (ageMonths === null) {
		return null;
	}

	if (!Number.isFinite(input.currentWeightKg) || input.currentWeightKg <= 0) {
		return null;
	}

	const referenceType = getEnergyReferenceType(input.feedingMode);

	const kcalPerKgPerDay = getEnergyRequirementKcalPerKg(
		ageMonths,
		input.babySex,
		referenceType
	);

	if (kcalPerKgPerDay === null) {
		return null;
	}

	return {
		ageMonths,
		kcalPerKgPerDay,
		kcalPerDay: Math.round(kcalPerKgPerDay * input.currentWeightKg)
	};
}