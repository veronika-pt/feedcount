import { get, writable } from 'svelte/store';
import { defaultSetup } from '$lib/data/setupDefaults.js';
import { loadSetup, saveSetup } from '$lib/storage/setupStorage.js';
import { validateSetup } from '$lib/validation/setupValidation.js';

/** @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup */
/**
 * @typedef {{ status: 'saved' | 'already-completed' | 'conflict' | 'invalid', messages: string[] }} SetupSaveResult
 */

/** @type {import('svelte/store').Writable<FeedCountSetup>} */
export const setup = writable(defaultSetup);

export function initialiseSetup() {
	setup.set(loadSetup());
}

const editableFields = {
	babyName: 'baby name',
	birthDate: 'date of birth',
	babySex: 'sex',
	currentWeightKg: 'current weight',
	formulaKcalPer100ml: 'formula energy value',
	bottleSizesMl: 'bottle sizes',
	feedingMode: 'feeding mode'
};

/** @param {unknown} first @param {unknown} second */
function sameValue(first, second) {
	if (Array.isArray(first) && Array.isArray(second)) {
		// Display sorting is not a user edit. Keep the persisted order when sizes are unchanged.
		return JSON.stringify([...first].sort()) === JSON.stringify([...second].sort());
	}
	return Object.is(first, second);
}

/**
 * Merge only deliberate edits into the latest persisted record. Reject overlapping edits
 * instead of silently choosing a winner; completion is never reverted by a stale draft.
 * @param {FeedCountSetup} nextSetup
 * @param {FeedCountSetup} baseSetup Snapshot taken when the form was opened.
 * @param {{ onboarding?: boolean }} [options]
 * @returns {SetupSaveResult}
 */
export function saveSetupForm(nextSetup, baseSetup, { onboarding = false } = {}) {
	const latest = loadSetup({ throwOnReadError: true });
	if (onboarding && latest.onboardingCompleted) {
		setup.set(latest);
		return { status: 'already-completed', messages: [] };
	}

	const merged = { ...latest };
	const conflicts = [];
	let changed = false;
	for (const field of /** @type {(keyof typeof editableFields)[]} */ (
		Object.keys(editableFields)
	)) {
		if (sameValue(nextSetup[field], baseSetup[field])) continue;
		if (
			!sameValue(latest[field], baseSetup[field]) &&
			!sameValue(latest[field], nextSetup[field])
		) {
			conflicts.push(editableFields[field]);
		} else if (!sameValue(latest[field], nextSetup[field])) {
			Object.assign(merged, { [field]: nextSetup[field] });
			changed = true;
		}
	}
	if (conflicts.length > 0) {
		return {
			status: 'conflict',
			messages: [
				`Changed elsewhere: ${conflicts.join(', ')}. Reload the latest settings and reapply your edits.`
			]
		};
	}

	merged.onboardingCompleted =
		latest.onboardingCompleted || onboarding || nextSetup.onboardingCompleted;
	const validation = validateSetup(merged);
	if (!validation.isValid) return { status: 'invalid', messages: validation.messages };

	if (changed || merged.onboardingCompleted !== latest.onboardingCompleted) saveSetup(merged);
	setup.set(merged);
	return { status: 'saved', messages: [] };
}

/**
 * Home's immediate edits use the same merge protection with its current store as the baseline.
 * @param {FeedCountSetup} nextSetup
 * @returns {SetupSaveResult}
 */
export function updateSetup(nextSetup) {
	const result = saveSetupForm(nextSetup, get(setup));
	if (result.status === 'conflict') initialiseSetup();
	return result;
}
