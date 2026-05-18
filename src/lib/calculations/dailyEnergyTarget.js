import { getCompletedAgeMonths } from '$lib/calculations/age.js';
import { getEnergyRequirementKcalPerKg } from '$lib/calculations/energyRequirement.js';

/**
 * @typedef {import('$lib/data/energyRequirements.js').BabySex} BabySex
 * @typedef {import('$lib/data/energyRequirements.js').FeedingReferenceType} FeedingReferenceType
 */

/**
 * @typedef {Object} DailyEnergyTargetInput
 * @property {string} birthDate
 * @property {BabySex} babySex
 * @property {number} currentWeightKg
 * @property {FeedingReferenceType} referenceType
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

	const kcalPerKgPerDay = getEnergyRequirementKcalPerKg(
		ageMonths,
		input.babySex,
		input.referenceType
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