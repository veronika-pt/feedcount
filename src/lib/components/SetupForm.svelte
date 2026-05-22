<script>
	import { defaultSetup } from '$lib/data/setupDefaults.js';

	/**
	 * @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup
	 */

	/** @type {{ setup: FeedCountSetup, onSave: (setup: FeedCountSetup) => void }} */
	let { setup, onSave } = $props();

	let saveStatus = $state('idle');
	let isAddingBottleSize = $state(false);
	let newBottleSizeInput = $state('');

	let draftSetup = $state({
		...defaultSetup,
		currentWeightKg: String(defaultSetup.currentWeightKg),
		bottleSizesMl: [...defaultSetup.bottleSizesMl],
		feedingMode: 'formulaOnly'
	});

	$effect(() => {
		const nextBottleSizes = setup.bottleSizesMl ?? defaultSetup.bottleSizesMl;
		const sortedBottleSizes = sortBottleSizes(nextBottleSizes);

		draftSetup = {
			...defaultSetup,
			...setup,
			feedingMode: 'formulaOnly',
			currentWeightKg: String(setup.currentWeightKg ?? defaultSetup.currentWeightKg),
			bottleSizesMl: sortedBottleSizes.length > 0 ? sortedBottleSizes : [...defaultSetup.bottleSizesMl]
		};

		isAddingBottleSize = false;
		newBottleSizeInput = '';
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
	 * @param {number[]} bottleSizes
	 * @returns {number[]}
	 */
	function sortBottleSizes(bottleSizes) {
		return [...new Set(bottleSizes)]
			.filter((size) => Number.isFinite(size) && size > 0)
			.sort((firstSize, secondSize) => firstSize - secondSize);
	}

	/**
	 * @param {string} value
	 * @returns {number | null}
	 */
	function parseBottleSize(value) {
		const parsedValue = Number(value.trim().replace(',', '.'));

		if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
			return null;
		}

		return Math.round(parsedValue);
	}

	function showBottleSizeInput() {
		isAddingBottleSize = true;
		newBottleSizeInput = '';
	}

	function hideBottleSizeInput() {
		isAddingBottleSize = false;
		newBottleSizeInput = '';
	}

	/**
	 * @param {number[]} bottleSizesMl
	 */
	function saveBottleSizes(bottleSizesMl) {
		const sortedBottleSizes = sortBottleSizes(bottleSizesMl);
		const nextBottleSizes =
			sortedBottleSizes.length > 0 ? sortedBottleSizes : [...defaultSetup.bottleSizesMl];

		draftSetup.bottleSizesMl = [...nextBottleSizes];

		onSave({
			...draftSetup,
			feedingMode: 'formulaOnly',
			currentWeightKg: Number(draftSetup.currentWeightKg.replace(',', '.')),
			formulaKcalPer100ml: Number(draftSetup.formulaKcalPer100ml),
			bottleSizesMl: nextBottleSizes
		});

		saveStatus = 'saved';
	}

	function addBottleSize() {
		const bottleSize = parseBottleSize(newBottleSizeInput);

		if (!bottleSize || draftSetup.bottleSizesMl.includes(bottleSize)) {
			return;
		}

		const nextBottleSizes = sortBottleSizes([...draftSetup.bottleSizesMl, bottleSize]);

		draftSetup.bottleSizesMl = nextBottleSizes;
		newBottleSizeInput = '';
		isAddingBottleSize = false;

		saveBottleSizes(nextBottleSizes);
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleBottleSizeKeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addBottleSize();
		}

		if (event.key === 'Escape') {
			hideBottleSizeInput();
		}
	}

	/**
	 * @param {number} bottleSize
	 */
	function removeBottleSize(bottleSize) {
		if (draftSetup.bottleSizesMl.length <= 1) {
			return;
		}

		const nextBottleSizes = draftSetup.bottleSizesMl.filter((size) => size !== bottleSize);

		saveBottleSizes(nextBottleSizes);
	}

	function saveForm() {
		const bottleSizesMl = sortBottleSizes(draftSetup.bottleSizesMl);

		onSave({
			...draftSetup,
			feedingMode: 'formulaOnly',
			currentWeightKg: Number(draftSetup.currentWeightKg.replace(',', '.')),
			formulaKcalPer100ml: Number(draftSetup.formulaKcalPer100ml),
			bottleSizesMl: bottleSizesMl.length > 0 ? bottleSizesMl : defaultSetup.bottleSizesMl
		});

		draftSetup.bottleSizesMl =
			bottleSizesMl.length > 0 ? bottleSizesMl : [...defaultSetup.bottleSizesMl];

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
				<div class="field-header">
					<h2 id="bottle-sizes-title">Bottle sizes</h2>
					<small>Used for bottle ideas based on the sizes you normally prepare.</small>
				</div>

				<div class="bottle-size-list" aria-label="Saved bottle sizes">
					{#each draftSetup.bottleSizesMl as bottleSize}
						<button
							class="bottle-size-chip"
							type="button"
							aria-label={`Remove ${bottleSize} ml bottle size`}
							disabled={draftSetup.bottleSizesMl.length <= 1}
							onclick={() => removeBottleSize(bottleSize)}
						>
							<span>{bottleSize} ml</span>
							<span aria-hidden="true">×</span>
						</button>
					{/each}
				</div>

				{#if isAddingBottleSize}
					<div class="add-bottle-size-row">
						<label class="add-bottle-size-field">
							<span class="sr-only">New bottle size</span>
							<div class="input-with-unit">
								<input
									bind:value={newBottleSizeInput}
									type="text"
									inputmode="numeric"
									autocomplete="off"
									placeholder="120"
									onkeydown={handleBottleSizeKeydown}
								/>
								<span>ml</span>
							</div>
						</label>

						<button class="inline-button" type="button" onclick={addBottleSize}>Add</button>

						<button
							class="inline-button secondary"
							type="button"
							aria-label="Cancel adding bottle size"
							onclick={hideBottleSizeInput}
						>
							Cancel
						</button>
					</div>
				{:else}
					<button class="add-bottle-size-button" type="button" onclick={showBottleSizeInput}>
						+ Add bottle size
					</button>
				{/if}
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
			<button class="save-button" type="submit" class:saved={saveStatus === 'saved'}>
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
		gap: 0;
		padding-bottom: 5rem;
	}

	.form-section {
		display: grid;
		gap: 0.9rem;
		padding: 1rem 0;
		border-bottom: 1px solid rgb(0 0 0 / 0.08);
		background: transparent;
		box-shadow: none;
	}

	label {
		display: grid;
		gap: 0.4rem;
		font-size: 0.95rem;
		font-weight: 650;
		color: var(--color-text-primary);
	}

	small {
		font-size: 0.82rem;
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
		font-size: 0.95rem;
		font-weight: 650;
		color: var(--color-text-primary);
	}

	.radio-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 1.75rem;
		font-size: 0.95rem;
		font-weight: 400;
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
		min-height: 2.75rem;
		border-radius: 0.8rem;
		font: inherit;
	}

	input {
		border: 1px solid rgb(0 0 0 / 0.12);
		padding: 0 0.85rem;
		background: var(--color-card-bg);
		color: var(--color-text-primary);
		font-weight: 400;
	}

	.field-header {
		display: grid;
		gap: 0.3rem;
	}

	.field-header h2 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 650;
		line-height: 1.25;
		color: var(--color-text-primary);
	}

	.bottle-size-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.bottle-size-chip {
		display: inline-flex;
		width: auto;
		min-height: 2.1rem;
		align-items: center;
		gap: 0.35rem;
		padding: 0 0.7rem;
		border: 1px solid rgb(0 0 0 / 0.1);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-card-bg) 92%, var(--color-button-bg) 8%);
		box-shadow: none;
		color: var(--color-text-primary);
		font-size: 0.86rem;
		font-weight: 500;
		cursor: pointer;
	}

	.bottle-size-chip span:last-child {
		color: var(--color-text-muted);
		font-size: 0.95rem;
		font-weight: 400;
		line-height: 1;
	}

	.bottle-size-chip:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	.add-bottle-size-button {
		width: fit-content;
		min-height: 2.25rem;
		padding: 0 0.8rem;
		border: 1px solid rgb(0 0 0 / 0.1);
		border-radius: 999px;
		background: transparent;
		box-shadow: none;
		color: var(--color-text-secondary);
		font-size: 0.86rem;
		font-weight: 650;
		cursor: pointer;
	}

	.add-bottle-size-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		gap: 0.5rem;
		align-items: center;
	}

	.add-bottle-size-field {
		gap: 0;
	}

	.input-with-unit {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		border: 1px solid rgb(0 0 0 / 0.12);
		border-radius: 0.8rem;
		background: var(--color-card-bg);
		overflow: hidden;
	}

	.input-with-unit input {
		min-height: 2.5rem;
		border: 0;
		border-radius: 0;
		padding-right: 0.35rem;
	}

	.input-with-unit span {
		padding-right: 0.85rem;
		color: var(--color-text-muted);
		font-size: 0.86rem;
		font-weight: 500;
	}

	.inline-button {
		width: auto;
		min-height: 2.5rem;
		padding: 0 0.8rem;
		border: 0;
		border-radius: 0.8rem;
		background: var(--color-button-bg);
		box-shadow: none;
		color: var(--color-button-text);
		font-size: 0.86rem;
		font-weight: 750;
		cursor: pointer;
	}

	.inline-button.secondary {
		border: 1px solid rgb(0 0 0 / 0.1);
		background: transparent;
		color: var(--color-text-secondary);
	}

	.about-section {
		display: grid;
		gap: 0.35rem;
		padding: 1rem 0 0.35rem;
		color: var(--color-text-muted);
	}

	.about-section h2 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 650;
		line-height: 1.25;
		color: var(--color-text-secondary);
	}

	.about-section p {
		margin: 0;
		font-size: 0.85rem;
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

	.save-button {
		width: 100%;
		border: 0;
		padding: 0 1rem;
		font-weight: 750;
		color: var(--color-button-text);
		background: var(--color-button-bg);
		box-shadow: 0 10px 22px rgb(0 0 0 / 0.14);
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

	.save-button.saved {
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

	@media (prefers-color-scheme: dark) {
		.form-section {
			border-bottom-color: rgb(255 255 255 / 0.12);
		}

		input,
		.input-with-unit {
			border-color: rgb(255 255 255 / 0.14);
		}

		.bottle-size-chip,
		.add-bottle-size-button,
		.inline-button.secondary {
			border-color: rgb(255 255 255 / 0.14);
		}

		.save-button {
			box-shadow: none;
		}
	}

	@media (max-width: 360px) {
		.add-bottle-size-row {
			grid-template-columns: 1fr;
		}

		.inline-button {
			width: 100%;
		}
	}
</style>