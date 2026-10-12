import assert from 'node:assert/strict';
import { after, afterEach, beforeEach, mock, test } from 'node:test';
import { registerHooks } from 'node:module';
import { get } from 'svelte/store';

// Match SvelteKit's $lib alias without adding a test framework or changing app imports.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith('$lib/')) {
			return nextResolve(
				new URL(`../src/lib/${specifier.slice(5)}`, import.meta.url).href,
				context
			);
		}
		return nextResolve(specifier, context);
	}
});

const { defaultSetup } = await import('../src/lib/data/setupDefaults.js');
const { loadSetup, saveSetup } = await import('../src/lib/storage/setupStorage.js');
const { initialiseSetup, setup, updateSetup, saveSetupForm } =
	await import('../src/lib/stores/setupStore.js');
const { validateSetup, validateBabyDetails } =
	await import('../src/lib/validation/setupValidation.js');
const { getDailyEnergyTarget } = await import('../src/lib/calculations/dailyEnergyTarget.js');
const { getDailyFormulaTargetMl } = await import('../src/lib/calculations/dailyFormulaTarget.js');
const { getBottleDistributionSuggestions } =
	await import('../src/lib/calculations/bottleDistribution.js');

const referenceDate = new Date('2026-09-16T12:00:00');
const validSetup = {
	...defaultSetup,
	babyName: 'Test baby',
	birthDate: '2026-03-16',
	babySex: /** @type {const} */ ('male'),
	currentWeightKg: 7.2,
	formulaKcalPer100ml: 68,
	bottleSizesMl: [90, 150, 180]
};
const storage = new Map();
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

beforeEach(() => {
	mock.timers.enable({ apis: ['Date'], now: referenceDate });
	storage.clear();
	Object.defineProperty(globalThis, 'localStorage', {
		configurable: true,
		value: {
			getItem: (/** @type {string} */ key) => storage.get(key) ?? null,
			setItem: (/** @type {string} */ key, /** @type {string} */ value) => storage.set(key, value)
		}
	});
	initialiseSetup();
});

afterEach(() => mock.timers.reset());

after(() => {
	if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
	else Reflect.deleteProperty(globalThis, 'localStorage');
});

test('a first run is incomplete, including after saving profile data alone', () => {
	assert.equal(loadSetup().onboardingCompleted, false);
	updateSetup(validSetup);
	initialiseSetup();
	assert.equal(get(setup).onboardingCompleted, false);
});

test('valid legacy profiles are completed on read, preserving exact weight, bottle order, and extra values', () => {
	const legacy = {
		...validSetup,
		currentWeightKg: 7.25,
		bottleSizesMl: [180, 90, 150, 90],
		customNote: 'Keep me'
	};
	Reflect.deleteProperty(legacy, 'onboardingCompleted');
	const original = JSON.stringify(legacy);
	storage.set('feedcount-setup', original);
	initialiseSetup();
	assert.deepEqual(get(setup), { ...legacy, onboardingCompleted: true });
	assert.equal(loadSetup().currentWeightKg, 7.25);
	assert.deepEqual(loadSetup().bottleSizesMl, [180, 90, 150, 90]);
	assert.equal(storage.get('feedcount-setup'), original, 'loading must not rewrite legacy data');
});

test('explicit flags are respected rather than inferred from valid profile data', () => {
	for (const flag of [null, false, 'true', 1]) {
		storage.set('feedcount-setup', JSON.stringify({ ...validSetup, onboardingCompleted: flag }));
		assert.equal(loadSetup().onboardingCompleted, false);
	}
	storage.set('feedcount-setup', JSON.stringify({ ...validSetup, onboardingCompleted: true }));
	assert.equal(loadSetup().onboardingCompleted, true);
});

test('empty, partial, malformed, and invalid legacy records remain incomplete', () => {
	for (const record of [
		{},
		{ birthDate: validSetup.birthDate },
		{ ...validSetup, onboardingCompleted: undefined, currentWeightKg: 0 },
		{ ...validSetup, onboardingCompleted: undefined, bottleSizesMl: [] }
	]) {
		storage.set('feedcount-setup', JSON.stringify(record));
		assert.equal(loadSetup().onboardingCompleted, false);
	}
	storage.set('feedcount-setup', '{broken');
	assert.deepEqual(loadSetup(), defaultSetup);
});

test('completion survives reload with the entered weight and bottles available to Home calculations', () => {
	assert.equal(validateSetup(validSetup, referenceDate).isValid, true);
	updateSetup({ ...validSetup, onboardingCompleted: true });
	initialiseSetup();
	const saved = get(setup);
	assert.deepEqual(saved, { ...validSetup, onboardingCompleted: true });
	assert.equal('age' in saved, false);
	const energy = getDailyEnergyTarget(saved, referenceDate);
	assert.equal(energy?.ageMonths, 6);
	assert.equal(energy?.kcalPerDay, 569);
	const target = getDailyFormulaTargetMl(energy?.kcalPerDay, saved.formulaKcalPer100ml);
	assert.ok(target && target > 0);
	const suggestions = getBottleDistributionSuggestions({
		remainingFormulaMl: target,
		bottleSizesMl: saved.bottleSizesMl,
		feedCount: 4
	});
	assert.ok(suggestions.length > 0);
	assert.ok(
		suggestions.every((suggestion) =>
			suggestion.bottlesMl.every((size) => saved.bottleSizesMl.includes(size))
		)
	);
});

test('Home and Settings updates use the same weight while preserving profile and completion', () => {
	updateSetup({ ...validSetup, onboardingCompleted: true });
	updateSetup({ ...get(setup), currentWeightKg: 7.3 });
	assert.equal(loadSetup().currentWeightKg, 7.3);
	updateSetup({ ...get(setup), currentWeightKg: 7.8 });
	initialiseSetup();
	assert.deepEqual(get(setup), { ...validSetup, currentWeightKg: 7.8, onboardingCompleted: true });
});

test('a failed persistence write cannot mark onboarding complete in memory', () => {
	Object.defineProperty(globalThis, 'localStorage', {
		configurable: true,
		value: {
			getItem() {
				return null;
			},
			setItem() {
				throw new Error('Storage unavailable');
			}
		}
	});
	assert.throws(
		() => updateSetup({ ...validSetup, onboardingCompleted: true }),
		/Storage unavailable/
	);
	assert.equal(get(setup).onboardingCompleted, false);
});

test('baby details reject invalid, future, and unsupported birth dates using the calculation age range', () => {
	for (const birthDate of ['', '2026-02-30', '2026-13-01', '2026-09-17', '2025-09-16']) {
		assert.equal(
			validateBabyDetails({ ...validSetup, birthDate }, referenceDate).isValid,
			false,
			birthDate
		);
	}
	for (const birthDate of ['2026-09-16', '2025-09-17']) {
		assert.equal(
			validateBabyDetails({ ...validSetup, birthDate }, referenceDate).isValid,
			true,
			birthDate
		);
	}
});

test('shared validation rejects invalid weight, sex, energy, and bottle volumes', () => {
	for (const currentWeightKg of [0, -1, NaN, Infinity]) {
		assert.equal(validateSetup({ ...validSetup, currentWeightKg }, referenceDate).isValid, false);
	}
	assert.equal(
		validateSetup({ ...validSetup, babySex: /** @type {never} */ ('invalid') }, referenceDate)
			.isValid,
		false
	);
	assert.equal(
		validateSetup({ ...validSetup, formulaKcalPer100ml: 0 }, referenceDate).isValid,
		false
	);
	for (const bottleSizesMl of [[], [0], [-90], [NaN]]) {
		assert.equal(validateSetup({ ...validSetup, bottleSizesMl }, referenceDate).isValid, false);
	}
	assert.equal(
		validateBabyDetails({ ...validSetup, bottleSizesMl: [] }, referenceDate).isValid,
		true
	);
});

test('saving preserves existing formula energy and feeding mode', () => {
	saveSetup(validSetup);
	assert.equal(loadSetup().feedingMode, validSetup.feedingMode);
	assert.equal(loadSetup().formulaKcalPer100ml, 68);
});

test('stale onboarding cannot overwrite a newer completed profile or its completion flag', () => {
	const baseline = { ...defaultSetup };
	const newer = {
		...validSetup,
		currentWeightKg: 8.1,
		bottleSizesMl: [125, 200],
		onboardingCompleted: true
	};
	saveSetup(newer); // Another tab saves; deliberately leave this tab's store stale.
	const original = storage.get('feedcount-setup');
	const result = saveSetupForm(
		{ ...validSetup, currentWeightKg: 6.5, bottleSizesMl: [100] },
		baseline,
		{ onboarding: true }
	);
	assert.equal(result.status, 'already-completed');
	assert.equal(storage.get('feedcount-setup'), original);
	assert.deepEqual(get(setup), newer);
});

test('stale onboarding is discarded even when its own draft is invalid', () => {
	const newer = { ...validSetup, onboardingCompleted: true };
	saveSetup(newer);
	assert.equal(
		saveSetupForm({ ...defaultSetup }, { ...defaultSetup }, { onboarding: true }).status,
		'already-completed'
	);
	assert.deepEqual(loadSetup(), newer);
});

test('legacy migrated completion also protects against stale onboarding', () => {
	const legacy = { ...validSetup, onboardingCompleted: undefined };
	storage.set('feedcount-setup', JSON.stringify(legacy));
	const original = storage.get('feedcount-setup');
	assert.equal(
		saveSetupForm({ ...validSetup, currentWeightKg: 5 }, defaultSetup, { onboarding: true }).status,
		'already-completed'
	);
	assert.equal(storage.get('feedcount-setup'), original);
	assert.equal(get(setup).onboardingCompleted, true);
});

test('first-run onboarding saves the draft and completion together', () => {
	assert.equal(saveSetupForm(validSetup, defaultSetup, { onboarding: true }).status, 'saved');
	assert.deepEqual(loadSetup(), { ...validSetup, onboardingCompleted: true });
});

test('Settings merges deliberate edits while preserving newer unrelated values and completion', () => {
	const baseline = { ...validSetup, onboardingCompleted: false };
	const newer = {
		...baseline,
		currentWeightKg: 8.2,
		formulaKcalPer100ml: 72,
		onboardingCompleted: true,
		customNote: 'Keep newer metadata'
	};
	saveSetup(newer);
	const result = saveSetupForm({ ...baseline, bottleSizesMl: [120, 180] }, baseline);
	assert.equal(result.status, 'saved');
	assert.deepEqual(loadSetup(), { ...newer, bottleSizesMl: [120, 180] });
});

test('Settings rejects overlapping weight or bottle edits without a partial write', () => {
	const baseline = { ...validSetup, onboardingCompleted: true };
	for (const changed of [{ currentWeightKg: 8.2 }, { bottleSizesMl: [125, 200] }]) {
		saveSetup({ ...baseline, ...changed });
		const original = storage.get('feedcount-setup');
		const result = saveSetupForm(
			{ ...baseline, currentWeightKg: 7.5, bottleSizesMl: [100, 160], babyName: 'Unrelated edit' },
			baseline
		);
		assert.equal(result.status, 'conflict');
		assert.ok(result.messages[0].includes('Reload the latest settings'));
		assert.equal(storage.get('feedcount-setup'), original);
	}
});

test('a deliberate edit after reloading the latest baseline saves normally', () => {
	saveSetup({ ...validSetup, onboardingCompleted: true, currentWeightKg: 8.2 });
	const baseline = loadSetup();
	assert.equal(saveSetupForm({ ...baseline, currentWeightKg: 8.3 }, baseline).status, 'saved');
	assert.equal(loadSetup().currentWeightKg, 8.3);
});

test('identical concurrent edits are not a conflict', () => {
	const baseline = { ...validSetup, onboardingCompleted: true };
	saveSetup({ ...baseline, currentWeightKg: 8 });
	assert.equal(
		saveSetupForm({ ...baseline, currentWeightKg: 8, babyName: 'New name' }, baseline).status,
		'saved'
	);
	assert.equal(loadSetup().babyName, 'New name');
});

test('display sorting and saving an unchanged legacy form do not rewrite the record', () => {
	const legacy = { ...validSetup, bottleSizesMl: [180, 90, 150], onboardingCompleted: undefined };
	storage.set('feedcount-setup', JSON.stringify(legacy));
	const original = storage.get('feedcount-setup');
	const baseline = loadSetup();
	assert.equal(
		saveSetupForm({ ...baseline, bottleSizesMl: [90, 150, 180] }, baseline).status,
		'saved'
	);
	assert.equal(storage.get('feedcount-setup'), original);
});

test('an explicit false from a stale form cannot downgrade persisted completion', () => {
	const baseline = { ...validSetup, onboardingCompleted: false };
	saveSetup({ ...validSetup, onboardingCompleted: true });
	assert.equal(saveSetupForm(baseline, baseline).status, 'saved');
	assert.equal(loadSetup().onboardingCompleted, true);
});

test('Home weight edits also preserve newer bottle sizes and completion', () => {
	updateSetup(validSetup);
	const newer = { ...validSetup, bottleSizesMl: [125, 200], onboardingCompleted: true };
	saveSetup(newer);
	assert.equal(updateSetup({ ...get(setup), currentWeightKg: 7.3 }).status, 'saved');
	assert.deepEqual(loadSetup(), { ...newer, currentWeightKg: 7.3 });
});

test('the merged result is validated before any write', () => {
	const baseline = { ...validSetup, onboardingCompleted: true };
	saveSetup(baseline);
	const original = storage.get('feedcount-setup');
	assert.equal(saveSetupForm({ ...baseline, currentWeightKg: 0 }, baseline).status, 'invalid');
	assert.equal(storage.get('feedcount-setup'), original);
});

test('a failed latest-record read prevents saving against fallback defaults', () => {
	let wrote = false;
	Object.defineProperty(globalThis, 'localStorage', {
		configurable: true,
		value: {
			getItem() {
				throw new Error('Read unavailable');
			},
			setItem() {
				wrote = true;
			}
		}
	});
	assert.throws(() => saveSetupForm(validSetup, defaultSetup), /Read unavailable/);
	assert.equal(wrote, false);
});
