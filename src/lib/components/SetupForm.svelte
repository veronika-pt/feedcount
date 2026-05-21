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
		bottleSizesMl: [...defaultSetup.bottleSizesMl],
		feedingMode: 'formulaOnly'
	});

	$effect(() => {
		const nextBottleSizes = setup.bottleSizesMl ?? defaultSetup.bottleSizesMl;

		draftSetup = {
			...defaultSetup,
			...setup,
			feedingMode: 'formulaOnly',
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
			feedingMode: 'formulaOnly',
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

<section class="setup-card" aria-label="FeedCount settings form">
	<form
		oninput={markAsChanged}
		onchange={markAsChanged}
		onsubmit={(event) => {
			event.preventDefault();
			saveForm();
		}}
	>
		<div class="form-content">
			<section class="form-section" aria-labelledby="current-weight-title">
				<h2 id="current-weight-title" class="sr-only">Current weight</h2>

				<label>
					<span>Current weight, kg</span>
					<input
						bind:value={draftSetup.currentWeightKg}
						type="text"
						inputmode="decimal"
						autocomplete="off"
					/>
					<small>Used for daily estimate calculations.</small>
				</label>
			</section>

			<section class="form-section" aria-labelledby="baby-profile-title">
				<h2 id="baby-profile-title" class="sr-only">Baby profile</h2>

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
					<legend>Sex</legend>

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
			</section>

			<section class="form-section" aria-labelledby="feeding-title">
				<h2 id="feeding-title" class="sr-only">Feeding</h2>

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
			</section>

			<section class="form-section" aria-labelledby="bottle-sizes-title">
				<h2 id="bottle-sizes-title" class="sr-only">Bottle sizes</h2>

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
			</section>

			<section class="about-section" aria-labelledby="about-title">
				<h2 id="about-title">About</h2>
				<p>
					FeedCount gives lightweight daily estimates based on saved profile and feeding details.
					It is not a medical tracker or medical advice.
				</p>
			</section>
		</div>

		<div class="save-bar">
			<button type="submit" class:saved={saveStatus === 'saved'}>
				{saveStatus === 'saved' ? 'Saved ✓' : 'Save settings'}
			</button>
		</div>
	</form>
</section>

<style>
	.setup-card {
		display: grid;
		width: 100%;
		max-width: 420px;
	}

	form {
		display: grid;
	}

	.form-content {
		display: grid;
		gap: 1rem;
		padding-bottom: 5.25rem;
	}

	.form-section {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid rgb(0 0 0 / 0.08);
		border-radius: 1.2rem;
		background: var(--color-card-bg);
		box-shadow: var(--shadow-card);
	}

	label {
		display: grid;
		gap: 0.45rem;
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

	.about-section {
		display: grid;
		gap: 0.35rem;
		padding: 0.25rem 0.15rem 0.2rem;
		color: var(--color-text-muted);
	}

	.about-section h2 {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.25;
		color: var(--color-text-secondary);
	}

	.about-section p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--color-text-muted);
	}

	.save-bar {
		position: sticky;
		bottom: calc(0.75rem + env(safe-area-inset-bottom));
		z-index: 10;
		padding: 0;
		background: transparent;
	}

	button {
		width: 100%;
		border: 0;
		padding: 0 1rem;
		font-weight: 750;
		color: var(--color-button-text);
		background: var(--color-button-bg);
		box-shadow: 0 14px 28px rgb(0 0 0 / 0.18);
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

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>