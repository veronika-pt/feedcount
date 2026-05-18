/**
 * Infant daily energy requirement reference data.
 *
 * Source:
 * FAO/WHO/UNU Human Energy Requirements,
 * Section 3, Table 3.3:
 * “Energy requirements of breastfed, formula-fed and all infants”.
 *
 * Values are kcal/kg/day.
 *
 * Notes:
 * - Age ranges are represented as completed months:
 *   0–1, 1–2, ... 11–12.
 * - The FAO table provides boys, girls and mean values.
 * - For babySex: 'unspecified', use the source "mean" column.
 * - Values are reference estimates, not medical advice.
 */

/**
 * @typedef {'female' | 'male' | 'unspecified'} BabySex
 */

/**
 * @typedef {'all' | 'formulaFed'} FeedingReferenceType
 */

/**
 * @typedef {Object} EnergyRequirementBySex
 * @property {number} female
 * @property {number} male
 * @property {number} unspecified
 */

/**
 * @typedef {Object} InfantEnergyRequirement
 * @property {number} ageMonthsMin
 * @property {number} ageMonthsMax
 * @property {EnergyRequirementBySex} all
 * @property {EnergyRequirementBySex} formulaFed
 */

/**
 * FAO/WHO/UNU infant energy requirements from birth to 12 months.
 *
 * @type {InfantEnergyRequirement[]}
 */
export const infantEnergyRequirements = [
	{
		ageMonthsMin: 0,
		ageMonthsMax: 1,
		all: { female: 107, male: 113, unspecified: 110 },
		formulaFed: { female: 117, male: 122, unspecified: 120 }
	},
	{
		ageMonthsMin: 1,
		ageMonthsMax: 2,
		all: { female: 101, male: 104, unspecified: 102 },
		formulaFed: { female: 108, male: 110, unspecified: 109 }
	},
	{
		ageMonthsMin: 2,
		ageMonthsMax: 3,
		all: { female: 94, male: 95, unspecified: 95 },
		formulaFed: { female: 101, male: 100, unspecified: 100 }
	},
	{
		ageMonthsMin: 3,
		ageMonthsMax: 4,
		all: { female: 84, male: 82, unspecified: 83 },
		formulaFed: { female: 89, male: 86, unspecified: 87 }
	},
	{
		ageMonthsMin: 4,
		ageMonthsMax: 5,
		all: { female: 82, male: 81, unspecified: 82 },
		formulaFed: { female: 87, male: 85, unspecified: 86 }
	},
	{
		ageMonthsMin: 5,
		ageMonthsMax: 6,
		all: { female: 81, male: 81, unspecified: 81 },
		formulaFed: { female: 85, male: 83, unspecified: 84 }
	},
	{
		ageMonthsMin: 6,
		ageMonthsMax: 7,
		all: { female: 78, male: 79, unspecified: 79 },
		formulaFed: { female: 81, male: 81, unspecified: 81 }
	},
	{
		ageMonthsMin: 7,
		ageMonthsMax: 8,
		all: { female: 78, male: 79, unspecified: 79 },
		formulaFed: { female: 81, male: 81, unspecified: 81 }
	},
	{
		ageMonthsMin: 8,
		ageMonthsMax: 9,
		all: { female: 78, male: 79, unspecified: 79 },
		formulaFed: { female: 81, male: 81, unspecified: 81 }
	},
	{
		ageMonthsMin: 9,
		ageMonthsMax: 10,
		all: { female: 79, male: 80, unspecified: 80 },
		formulaFed: { female: 81, male: 82, unspecified: 81 }
	},
	{
		ageMonthsMin: 10,
		ageMonthsMax: 11,
		all: { female: 79, male: 80, unspecified: 80 },
		formulaFed: { female: 81, male: 82, unspecified: 81 }
	},
	{
		ageMonthsMin: 11,
		ageMonthsMax: 12,
		all: { female: 79, male: 81, unspecified: 80 },
		formulaFed: { female: 81, male: 82, unspecified: 81 }
	}
];