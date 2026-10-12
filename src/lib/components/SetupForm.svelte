<script>
	import { tick, untrack } from 'svelte';
	import BabyDetailsFields from './BabyDetailsFields.svelte';
	import BottleSizesEditor from './BottleSizesEditor.svelte';
	import { validateBabyDetails, validateFormulaDetails } from '$lib/validation/setupValidation.js';
	import './setupForm.css';

	/** @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup */
	/** @typedef {import('$lib/data/setupDefaults.js').SetupDraft} SetupDraft */
	/** @type {{ setup: FeedCountSetup, onSave: (setup: FeedCountSetup, baseline: FeedCountSetup) => import('$lib/stores/setupStore.js').SetupSaveResult, onboarding?: boolean }} */
	let { setup, onSave, onboarding = false } = $props();

	/** @param {FeedCountSetup} value @returns {SetupDraft} */
	function createDraft(value) {
		return {
			...value,
			currentWeightKg: String(value.currentWeightKg),
			bottleSizesMl: [...value.bottleSizesMl].sort((a, b) => a - b)
		};
	}

	// A single unsaved form draft; all persisted values still live in the setup store.
	// Keep nested field bindings reactive while replacing the draft after a store update.
	let draft = $state(createDraft(untrack(() => setup)));
	// A baseline is needed to distinguish our edits from changes saved in another tab.
	let baseline = untrack(() => ({ ...setup, bottleSizesMl: [...setup.bottleSizesMl] }));
	let step = $state(1);
	// Older Settings allowed invalid energy values. Let those users correct them during setup.
	const needsFormulaCorrection = $derived(!validateFormulaDetails(setup).isValid);
	let saveStatus = $state('idle');
	let hasConflict = $state(false);
	/** @type {string[]} */
	let messages = $state([]);
	/** @type {BottleSizesEditor | undefined} */
	let bottleEditor = $state();
	/** @type {HTMLHeadingElement | undefined} */
	let stepHeading = $state();
	/** @type {HTMLDivElement | undefined} */
	let errorSummary = $state();

	$effect(() => {
		baseline = { ...setup, bottleSizesMl: [...setup.bottleSizesMl] };
		draft = createDraft(setup);
	});

	function markAsChanged() {
		saveStatus = 'idle';
		messages = [];
	}

	/** @returns {FeedCountSetup} */
	function getSetup() {
		return {
			...draft,
			currentWeightKg: Number(draft.currentWeightKg.trim().replace(',', '.')),
			formulaKcalPer100ml: Number(draft.formulaKcalPer100ml)
		};
	}

	/** @param {number} nextStep */
	async function changeStep(nextStep) {
		step = nextStep;
		messages = [];
		await tick();
		stepHeading?.focus();
	}

	/** @param {string[]} errors */
	async function showErrors(errors) {
		messages = errors;
		await tick();
		errorSummary?.focus();
	}

	function saveForm() {
		if (onboarding && step === 1) {
			void changeStep(2);
			return;
		}
		if (onboarding && step === 2) {
			const validation = validateBabyDetails(getSetup());
			if (!validation.isValid) {
				void showErrors(validation.messages);
				return;
			}
			void changeStep(3);
			return;
		}

		if (bottleEditor && !bottleEditor.commitPending()) return;
		const nextSetup = getSetup();

		try {
			// The save boundary validates the merge with the latest persisted values.
			const result = onSave(nextSetup, baseline);
			hasConflict = result.status === 'conflict';
			if (result.messages.length > 0) {
				void showErrors(result.messages);
				return;
			}
			saveStatus = 'saved';
			messages = [];
		} catch {
			void showErrors(['Your changes could not be saved. Please try again.']);
		}
	}
</script>

<section class="setup-card" aria-label={onboarding ? 'FeedCount setup' : 'FeedCount settings form'}>
	<form
		novalidate
		oninput={markAsChanged}
		onchange={markAsChanged}
		onsubmit={(event) => {
			event.preventDefault();
			saveForm();
		}}
	>
		<div class="form-content">
			{#if onboarding}
				<p class="step-progress">Step {step} of 3</p>
				<h1 bind:this={stepHeading} tabindex="-1">
					{step === 1
						? 'Set up FeedCount'
						: step === 2
							? 'Your baby’s details'
							: 'Set up your bottles'}
				</h1>
			{/if}

			{#if onboarding && step === 1}
				<section class="form-section">
					<p class="helper-text">
						FeedCount helps estimate daily formula intake for babies up to 12 months old. Add your
						baby’s details and the bottle sizes you normally use. You can change everything later in
						Settings.
					</p>
				</section>
			{/if}

			{#if !onboarding || step === 2}
				<section class="form-section" aria-label="Baby details">
					{#if !onboarding}
						<label
							><span>Baby name</span><input
								bind:value={draft.babyName}
								type="text"
								autocomplete="off"
							/></label
						>
					{/if}
					<BabyDetailsFields bind:draft />
				</section>
			{/if}

			{#if !onboarding || (step === 3 && needsFormulaCorrection)}
				<section class="form-section">
					<label>
						<span>Formula kcal per 100 ml</span>
						<input
							bind:value={draft.formulaKcalPer100ml}
							type="number"
							min="0"
							step="1"
							inputmode="numeric"
						/>
					</label>
				</section>
			{/if}

			{#if !onboarding || step === 3}
				<section class="form-section" aria-label="Bottle sizes">
					{#if !onboarding}<div class="section-header"><h2>Bottle sizes</h2></div>{/if}
					<BottleSizesEditor
						bind:this={bottleEditor}
						bind:bottleSizesMl={draft.bottleSizesMl}
						onChange={markAsChanged}
					/>
				</section>
			{/if}

			{#if !onboarding}
				<section class="about-section" aria-labelledby="about-title">
					<h2 id="about-title">About FeedCount</h2>
					<p>
						FeedCount gives lightweight daily estimates based on saved profile and feeding details.
						It is not a medical tracker or medical advice.
					</p>
				</section>
			{/if}
		</div>

		<div class="save-bar">
			{#if messages.length > 0}
				<div bind:this={errorSummary} class="form-errors" role="alert" tabindex="-1">
					<ul>
						{#each messages as message (message)}<li>{message}</li>{/each}
					</ul>
				</div>
			{/if}
			{#if hasConflict}
				<button class="inline-button secondary" type="button" onclick={() => location.reload()}>
					Reload latest settings
				</button>
			{/if}
			{#if onboarding && step > 1}
				<button
					class="inline-button secondary step-back"
					type="button"
					onclick={() => changeStep(step - 1)}>← Back</button
				>
			{/if}
			<button class="save-button" type="submit" class:saved={saveStatus === 'saved'}>
				{onboarding
					? step === 1
						? 'Get started'
						: step === 2
							? 'Continue'
							: 'Finish setup'
					: saveStatus === 'saved'
						? 'Saved ✓'
						: 'Save settings'}
			</button>
		</div>
	</form>
</section>
