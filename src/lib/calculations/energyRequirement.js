import { infantEnergyRequirements } from '$lib/data/energyRequirements.js';

/**
 * @typedef {import('$lib/data/energyRequirements.js').BabySex} BabySex
 * @typedef {import('$lib/data/energyRequirements.js').FeedingReferenceType} FeedingReferenceType
 */

/**
 * Finds kcal/kg/day for an infant by completed age in months, sex and reference type.
 *
 * @param {number} ageMonths
 * @param {BabySex} babySex
 * @param {FeedingReferenceType} referenceType
 * @returns {number | null}
 */
export function getEnergyRequirementKcalPerKg(ageMonths, babySex, referenceType) {
	if (!Number.isFinite(ageMonths) || ageMonths < 0) {
		return null;
	}

	const ageBand = infantEnergyRequirements.find(
		(requirement) =>
			ageMonths >= requirement.ageMonthsMin && ageMonths < requirement.ageMonthsMax
	);

	if (!ageBand) {
		return null;
	}

	const reference = ageBand[referenceType];

	if (!reference) {
		return null;
	}

	return reference[babySex] ?? null;
}