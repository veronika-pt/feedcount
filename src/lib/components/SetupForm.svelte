<script>
	import { defaultSetup } from '$lib/data/setupDefaults.js';

	/**
	 * @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup
	 */

	/** @type {{ setup: FeedCountSetup, onSave: (setup: FeedCountSetup) => void }} */
	let { setup, onSave } = $props();

	let saveStatus = $state('idle');
	let bottleSizesInput = $state(defaultSetup.bottleSizesMl.join(', '));

	let draftSetup = $state({
		...defaultSetup,
		currentWeightKg: String(defaultSetup.currentWeightKg),
		bottleSizesMl: [...defaultSetup.bottleSizesMl]
	});

	$effect(() => {
		const nextBottleSizes = setup.bottleSizesMl ?? defaultSetup.bottleSizesMl;

		draftSetup = {
			...defaultSetup,
			...setup,
			currentWeightKg: String(setup.currentWeightKg ?? defaultSetup.currentWeightKg),
			bottleSizesMl: [...nextBottleSizes]
		};

		bottleSizesInput = nextBottleSizes.join(', ');
	});

	function markAsChanged() {
		saveStatus = 'idle';
	}

	/**
	 * @param {string} value
	 * @returns {string}
	 */
	function formatBirthDateInput(value) {
		const digits = value.replace(/\D/g, '').slice(0, 8);

		if (digits.length <= 4) return digits;
		if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;

		return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
	}

	/**
	 * @param {Event} event
	 */
	function handleBirthDateInput(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		draftSetup.birthDate = formatBirthDateInput(input.value);
	}

	/**
	 * @param {string} value
	 * @returns {number[]}
	 */
	function parseBottleSizes(value) {
		return value
			.split(',')
			.map((size) => Number(size.trim()))
			.filter((size) => Number.isFinite(size) && size > 0);
	}

	function saveForm() {
		const bottleSizesMl = parseBottleSizes(bottleSizesInput);

		onSave({
			...draftSetup,
			currentWeightKg: Number(draftSetup.currentWeightKg.replace(',', '.')),
			formulaKcalPer100ml: Number(draftSetup.formulaKcalPer100ml),
			bottleSizesMl: bottleSizesMl.length > 0 ? bottleSizesMl : defaultSetup.bottleSizesMl
		});

		bottleSizesInput =
			bottleSizesMl.length > 0
				? bottleSizesMl.join(', ')
				: defaultSetup.bottleSizesMl.join(', ');

		saveStatus = 'saved';
	}
</script>

<section class="setup-card" aria-labelledby="setup-title">
	<div class="setup-header">
		<p class="eyebrow">Setup</p>
		<h2 id="setup-title">Baby and formula details</h2>
		<p class="helper">These details help FeedCount estimate today’s remaining formula feeds.</p>
	</div>

	<form
		oninput={markAsChanged}
		onchange={markAsChanged}
		onsubmit={(event) => {
			event.preventDefault();
			saveForm();
		}}
	>
		<label>
			<span>Baby name</span>
			<input bind:value={draftSetup.babyName} type="text" autocomplete="off" />
		</label>

		<label>
			<span>Birth date</span>
			<input
				bind:value={draftSetup.birthDate}
				type="text"
				placeholder="YYYY-MM-DD"
				inputmode="numeric"
				autocomplete="bday"
				oninput={handleBirthDateInput}
			/>
		</label>

		<fieldset class="field">
			<legend>Baby sex</legend>

			<label class="radio-option">
				<input type="radio" name="babySex" value="female" bind:group={draftSetup.babySex} />
				<span>Female</span>
			</label>

			<label class="radio-option">
				<input type="radio" name="babySex" value="male" bind:group={draftSetup.babySex} />
				<span>Male</span>
			</label>

			<label class="radio-option">
				<input
					type="radio"
					name="babySex"
					value="unspecified"
					bind:group={draftSetup.babySex}
				/>
				<span>Unspecified</span>
			</label>
		</fieldset>

		<fieldset class="field">
			<legend>Feeding mode</legend>

			<label class="radio-option">
				<input
					type="radio"
					name="feedingMode"
					value="mixed"
					bind:group={draftSetup.feedingMode}
				/>
				<span>Mixed feeding</span>
			</label>

			<label class="radio-option">
				<input
					type="radio"
					name="feedingMode"
					value="formulaOnly"
					bind:group={draftSetup.feedingMode}
				/>
				<span>Formula feeding only</span>
			</label>
		</fieldset>

		<label>
			<span>Current weight, kg</span>
			<input
				bind:value={draftSetup.currentWeightKg}
				type="text"
				inputmode="decimal"
				autocomplete="off"
			/>
		</label>

		<label>
			<span>Formula kcal per 100 ml</span>
			<input
				bind:value={draftSetup.formulaKcalPer100ml}
				type="number"
				min="0"
				step="1"
				inputmode="numeric"
			/>
		</label>

		<label>
			<span>Bottle sizes, ml</span>
			<input
				bind:value={bottleSizesInput}
				type="text"
				inputmode="numeric"
				autocomplete="off"
				placeholder="90, 120, 150"
			/>
			<small>Used for bottle ideas based on the sizes you normally prepare.</small>
		</label>

		<button type="submit" class:saved={saveStatus === 'saved'}>
			{saveStatus === 'saved' ? 'Saved ✓' : 'Save setup'}
		</button>
	</form>
</section>

<style>
	.setup-card {
		display: grid;
		gap: 1.25rem;
		width: 100%;
		max-width: 420px;
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: var(--color-card-bg);
		box-shadow: var(--shadow-card);
	}

	.setup-header {
		display: grid;
		gap: 0.4rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	h2,
	.helper {
		margin: 0;
	}

	h2 {
		font-size: 1.35rem;
		line-height: 1.15;
		color: var(--color-text-primary);
	}

	.helper {
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	form {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.4rem;
		font-weight: 650;
		color: var(--color-text-primary);
	}

	small {
		font-size: 0.85rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--color-text-muted);
	}

	.field {
		display: grid;
		gap: 0.45rem;
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend {
		padding: 0;
		font-weight: 650;
		color: var(--color-text-primary);
	}

	.radio-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 1.75rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.radio-option input {
		width: 1rem;
		height: 1rem;
		min-height: auto;
		margin: 0;
		padding: 0;
	}

	input,
	button {
		min-height: 3rem;
		border-radius: 0.9rem;
		font: inherit;
	}

	input {
		border: 1px solid rgb(0 0 0 / 0.12);
		padding: 0 0.9rem;
		background: var(--color-card-bg);
		color: var(--color-text-primary);
	}

	button {
		border: 0;
		padding: 0 1rem;
		font-weight: 750;
		color: var(--color-button-text);
		background: var(--color-button-bg);
		cursor: pointer;
		transition:
			transform 120ms ease,
			opacity 120ms ease,
			filter 120ms ease;
	}

	button:active {
		transform: scale(0.98);
		filter: brightness(0.95);
	}

	button.saved {
		opacity: 0.9;
	}
</style>