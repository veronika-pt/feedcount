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
 */

/**
 * @typedef {Object} BottleDistributionInput
 * @property {number} remainingFormulaMl
 * @property {number[]} bottleSizesMl
 */

/**
 * Suggests simple bottle combinations for the remaining formula amount.
 *
 * This is intentionally lightweight. It does not create a feeding plan.
 * It only helps estimate practical bottle combinations using saved bottle sizes.
 *
 * @param {BottleDistributionInput} input
 * @returns {BottleDistributionSuggestion[]}
 */
export function getBottleDistributionSuggestions(input) {
	const remainingFormulaMl = Math.round(input.remainingFormulaMl);
	const bottleSizesMl = getValidBottleSizes(input.bottleSizesMl);

	if (!Number.isFinite(remainingFormulaMl) || remainingFormulaMl <= 0 || bottleSizesMl.length === 0) {
		return [];
	}

	const combinations = getSimpleBottleCombinations(remainingFormulaMl, bottleSizesMl);

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
 * @param {number} remainingFormulaMl
 * @param {number[]} bottleSizesMl
 * @returns {BottleCombination[]}
 */
function getSimpleBottleCombinations(remainingFormulaMl, bottleSizesMl) {
	const maxBottleSize = Math.max(...bottleSizesMl);
	const maxBottleCount = Math.max(1, Math.ceil(remainingFormulaMl / maxBottleSize) + 1);

	/** @type {BottleCombination[]} */
	const combinations = [];

	/**
	 * @param {number[]} currentBottles
	 * @param {number} startIndex
	 */
	function build(currentBottles, startIndex) {
		if (currentBottles.length > 0) {
			const totalMl = currentBottles.reduce((sum, bottle) => sum + bottle, 0);

			combinations.push({
				bottlesMl: [...currentBottles],
				totalMl
			});
		}

		if (currentBottles.length >= maxBottleCount) {
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

		if (a.bottlesMl.length !== b.bottlesMl.length) {
			return a.bottlesMl.length - b.bottlesMl.length;
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

			return a.bottlesMl.length - b.bottlesMl.length;
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