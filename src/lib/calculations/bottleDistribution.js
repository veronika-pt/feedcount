/**
 * @typedef {Object} BottleDistributionSuggestion
 * @property {'closest-to-target' | 'small-buffer-above-target'} type
 * @property {number[]} bottlesMl
 * @property {number} totalMl
 * @property {number} differenceMl
 */

/**
 * @typedef {Object} BottleCombination
 * @property {number[]} bottlesMl
 * @property {number} totalMl
 * @property {number} spreadMl
 */

/**
 * @typedef {Object} BottleDistributionInput
 * @property {number} remainingFormulaMl
 * @property {number[]} bottleSizesMl
 * @property {number} feedCount
 */

/**
 * Suggests simple bottle combinations for the remaining formula amount.
 *
 * This is intentionally lightweight. It does not create a feeding plan.
 * It only helps estimate practical bottle combinations using saved bottle sizes
 * and the number of formula feeds planned for the rest of the day.
 *
 * The helper prefers combinations that are close to the remaining amount
 * and reasonably even across bottles.
 *
 * @param {BottleDistributionInput} input
 * @returns {BottleDistributionSuggestion[]}
 */
export function getBottleDistributionSuggestions(input) {
	const remainingFormulaMl = Math.round(input.remainingFormulaMl);
	const bottleSizesMl = getValidBottleSizes(input.bottleSizesMl);
	const feedCount = Math.floor(input.feedCount);

	if (
		!Number.isFinite(remainingFormulaMl) ||
		remainingFormulaMl <= 0 ||
		bottleSizesMl.length === 0 ||
		!Number.isFinite(feedCount) ||
		feedCount <= 0
	) {
		return [];
	}

	const combinations = getSimpleBottleCombinations(bottleSizesMl, feedCount);

	const closestToTarget = findClosestToTarget(combinations, remainingFormulaMl);
	const smallBufferAboveTarget = findSmallBufferAboveTarget(combinations, remainingFormulaMl);

	/** @type {BottleDistributionSuggestion[]} */
	const suggestions = [];

	if (closestToTarget) {
		suggestions.push(closestToTarget);
	}

	if (smallBufferAboveTarget) {
		suggestions.push(smallBufferAboveTarget);
	}

	return suggestions;
}

/**
 * @param {number[]} bottleSizesMl
 * @returns {number[]}
 */
function getValidBottleSizes(bottleSizesMl) {
	return [...new Set(bottleSizesMl)]
		.map(Number)
		.filter((size) => Number.isFinite(size) && size > 0)
		.sort((a, b) => a - b);
}

/**
 * @param {number[]} bottleSizesMl
 * @param {number} feedCount
 * @returns {BottleCombination[]}
 */
function getSimpleBottleCombinations(bottleSizesMl, feedCount) {
	/** @type {BottleCombination[]} */
	const combinations = [];

	/**
	 * @param {number[]} currentBottles
	 * @param {number} startIndex
	 */
	function build(currentBottles, startIndex) {
		if (currentBottles.length === feedCount) {
			const totalMl = currentBottles.reduce((sum, bottle) => sum + bottle, 0);

			combinations.push({
				bottlesMl: [...currentBottles],
				totalMl,
				spreadMl: getBottleSpreadMl(currentBottles)
			});

			return;
		}

		for (let i = startIndex; i < bottleSizesMl.length; i += 1) {
			currentBottles.push(bottleSizesMl[i]);
			build(currentBottles, i);
			currentBottles.pop();
		}
	}

	build([], 0);

	return combinations;
}

/**
 * @param {number[]} bottlesMl
 * @returns {number}
 */
function getBottleSpreadMl(bottlesMl) {
	if (bottlesMl.length <= 1) {
		return 0;
	}

	return Math.max(...bottlesMl) - Math.min(...bottlesMl);
}

/**
 * @param {BottleCombination[]} combinations
 * @param {number} remainingFormulaMl
 * @returns {BottleDistributionSuggestion | null}
 */
function findClosestToTarget(combinations, remainingFormulaMl) {
	const closest = [...combinations].sort((a, b) => {
		const differenceA = Math.abs(a.totalMl - remainingFormulaMl);
		const differenceB = Math.abs(b.totalMl - remainingFormulaMl);

		if (differenceA !== differenceB) {
			return differenceA - differenceB;
		}

		if (a.spreadMl !== b.spreadMl) {
			return a.spreadMl - b.spreadMl;
		}

		return a.totalMl - b.totalMl;
	})[0];

	if (!closest) {
		return null;
	}

	return {
		type: 'closest-to-target',
		bottlesMl: closest.bottlesMl,
		totalMl: closest.totalMl,
		differenceMl: closest.totalMl - remainingFormulaMl
	};
}

/**
 * @param {BottleCombination[]} combinations
 * @param {number} remainingFormulaMl
 * @returns {BottleDistributionSuggestion | null}
 */
function findSmallBufferAboveTarget(combinations, remainingFormulaMl) {
	const buffer = [...combinations]
		.filter((combination) => combination.totalMl > remainingFormulaMl)
		.sort((a, b) => {
			const differenceA = a.totalMl - remainingFormulaMl;
			const differenceB = b.totalMl - remainingFormulaMl;

			if (differenceA !== differenceB) {
				return differenceA - differenceB;
			}

			if (a.spreadMl !== b.spreadMl) {
				return a.spreadMl - b.spreadMl;
			}

			return a.totalMl - b.totalMl;
		})[0];

	if (!buffer) {
		return null;
	}

	return {
		type: 'small-buffer-above-target',
		bottlesMl: buffer.bottlesMl,
		totalMl: buffer.totalMl,
		differenceMl: buffer.totalMl - remainingFormulaMl
	};
}