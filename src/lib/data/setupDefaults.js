/**
 * Default setup values for FeedCount.
 * These values are intentionally simple and editable by the parent.
 */

/**
 * @typedef {'female' | 'male'} BabySex
 */

/**
 * @typedef {Object} FeedCountSetup
 * @property {string} babyName
 * @property {string} birthDate
 * @property {BabySex} babySex
 * @property {number} currentWeightKg
 * @property {number} formulaKcalPer100ml
 * @property {number[]} bottleSizesMl
 */

/** @type {FeedCountSetup} */
export const defaultSetup = {
	babyName: '',
	birthDate: '',
	babySex: 'female',
	currentWeightKg: 0,
	formulaKcalPer100ml: 66,
	bottleSizesMl: [70, 105, 140, 175]
};