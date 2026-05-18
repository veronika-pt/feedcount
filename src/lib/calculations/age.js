/**
 * Calculates completed age in months from birth date to a reference date.
 *
 * This is intentionally simple:
 * - birthDate must be in YYYY-MM-DD format
 * - referenceDate defaults to today
 * - partial months are not counted as completed months
 *
 * @param {string} birthDate
 * @param {Date} [referenceDate]
 * @returns {number | null}
 */
export function getCompletedAgeMonths(birthDate, referenceDate = new Date()) {
	if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
		return null;
	}

	const birth = new Date(`${birthDate}T00:00:00`);

	if (Number.isNaN(birth.getTime())) {
		return null;
	}

	let months =
		(referenceDate.getFullYear() - birth.getFullYear()) * 12 +
		(referenceDate.getMonth() - birth.getMonth());

	if (referenceDate.getDate() < birth.getDate()) {
		months -= 1;
	}

	return Math.max(0, months);
}