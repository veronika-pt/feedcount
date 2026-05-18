/**
 * Converts an estimated daily energy target into an estimated daily formula amount.
 *
 * Formula:
 * daily ml = daily kcal target / kcal per 100 ml * 100
 *
 * @param {number | null | undefined} dailyEnergyTargetKcal
 * @param {number | string | null | undefined} formulaKcalPer100ml
 * @returns {number | null}
 */
export function getDailyFormulaTargetMl(dailyEnergyTargetKcal, formulaKcalPer100ml) {
	const kcalTarget = Number(dailyEnergyTargetKcal);
	const kcalPer100ml = Number(formulaKcalPer100ml);

	if (!Number.isFinite(kcalTarget) || kcalTarget <= 0) {
		return null;
	}

	if (!Number.isFinite(kcalPer100ml) || kcalPer100ml <= 0) {
		return null;
	}

	return Math.round((kcalTarget / kcalPer100ml) * 100);
}