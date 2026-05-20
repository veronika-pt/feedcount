/**
 * Calculates the estimated amount of formula remaining for today.
 *
 * The result is clamped at 0 so the UI never shows a negative amount.
 *
 * @param {number} dailyFormulaTargetMl
 * @param {number} formulaConsumedMl
 * @returns {number}
 */
export function getRemainingFormulaMl(dailyFormulaTargetMl, formulaConsumedMl) {
	return Math.max(0, dailyFormulaTargetMl - formulaConsumedMl);
}

/**
 * Checks whether today's consumed formula is already above the estimated daily target.
 *
 * @param {number} dailyFormulaTargetMl
 * @param {number} formulaConsumedMl
 * @returns {boolean}
 */
export function isFormulaConsumedAboveEstimate(dailyFormulaTargetMl, formulaConsumedMl) {
	return formulaConsumedMl > dailyFormulaTargetMl;
}