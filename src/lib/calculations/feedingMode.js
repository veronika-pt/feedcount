/**
 * @typedef {import('$lib/data/setupDefaults.js').FeedingMode} FeedingMode
 */

/**
 * @param {FeedingMode | undefined} feedingMode
 * @returns {'all' | 'formulaFed'}
 */
export function getEnergyReferenceType(feedingMode) {
	if (feedingMode === 'formulaOnly') {
		return 'formulaFed';
	}

	return 'all';
}