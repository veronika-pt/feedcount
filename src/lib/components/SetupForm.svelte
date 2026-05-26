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
			<section class="form-section" aria-labelledby="Baby profile">
				

				<div class="section-fields">
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
				</div>
			</section>

			<section class="form-section" aria-labelledby="formula-details-title">
				<div class="section-header">
					<h2 id="formula-details-title">Formula kcal per 100 ml</h2>
				</div>

				<div class="section-fields">
					<label>
	
						<input
							bind:value={draftSetup.formulaKcalPer100ml}
							type="number"
							min="0"
							step="1"
							inputmode="numeric"
						/>
					</label>
				</div>
			</section>

			<section class="form-section" aria-labelledby="bottle-sizes-title">
				<div class="section-header">
					<h2 id="bottle-sizes-title">Bottle sizes</h2>
					
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
				<h2 id="about-title">About FeedCount</h2>
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
		gap: 0.85rem;
		padding-bottom: 5rem;
	}

	.form-section,
	.about-section {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--color-primary-accent) 14%, var(--color-border));
		border-radius: 1.35rem;
		background: var(--color-card-bg);
		box-shadow: 0 10px 26px var(--color-shadow);
	}

	.section-header {
		display: grid;
		gap: 0.25rem;
	}

	.section-header h2,
	.about-section h2 {
		margin: 0;
		font-size: 0.96rem;
		font-weight: 750;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--color-text);
	}

	.section-fields {
		display: grid;
		gap: 0.9rem;
	}

	label {
		display: grid;
		gap: 0.4rem;
		font-size: 0.95rem;
		font-weight: 650;
		color: var(--color-text);
	}


	.field {
	display: grid;
	gap: 0.45rem;
	margin: 0.25rem 0 0;
	padding: 0;
	border: 0;
}

	legend {
		padding: 0;
		font-size: 0.95rem;
		font-weight: 650;
		color: var(--color-text);
	}

	.radio-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 1.75rem;
		font-size: 0.95rem;
		font-weight: 400;
		color: var(--color-text);
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
		border: 1px solid color-mix(in srgb, var(--color-primary-accent) 18%, var(--color-border));
		padding: 0 0.85rem;
		background: color-mix(in srgb, var(--color-surface) 88%, var(--color-soft-accent));
		color: var(--color-text);
		font-weight: 400;
	}

	input[type='radio'] {
		accent-color: var(--color-primary-accent);
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
		border: 1px solid color-mix(in srgb, var(--color-primary-accent) 28%, var(--color-border));
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-primary-accent) 16%, var(--color-surface));
		box-shadow: none;
		color: var(--color-text);
		font-size: 0.86rem;
		font-weight: 500;
		cursor: pointer;
	}

	.bottle-size-chip span:last-child {
		color: var(--color-muted-text);
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
		border: 1px solid color-mix(in srgb, var(--color-info) 32%, var(--color-border));
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-info) 10%, transparent);
		box-shadow: none;
		color: var(--color-muted-text);
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
		border: 1px solid var(--color-border);
		border-radius: 0.8rem;
		background: var(--color-surface);
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
		color: var(--color-muted-text);
		font-size: 0.86rem;
		font-weight: 500;
	}

	.inline-button {
		width: auto;
		min-height: 2.5rem;
		padding: 0 0.8rem;
		border: 0;
		border-radius: 0.8rem;
		background: var(--color-primary-accent);
		box-shadow: none;
		color: var(--color-button-text);
		font-size: 0.86rem;
		font-weight: 750;
		cursor: pointer;
	}

	.inline-button.secondary {
		border: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-muted-text);
	}

	.about-section {
		gap: 0.35rem;
		background: color-mix(in srgb, var(--color-card-bg) 78%, var(--color-soft-accent));
		box-shadow: none;
		color: var(--color-muted-text);
	}

	.about-section h2 {
		font-size: 0.88rem;
		color: var(--color-muted-text);
	}

	.about-section p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--color-muted-text);
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
		background: var(--color-primary-accent);
		box-shadow: 0 10px 22px var(--color-shadow);
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
		background: var(--color-success);
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

	@media (max-width: 360px) {
		.add-bottle-size-row {
			grid-template-columns: 1fr;
		}

		.inline-button {
			width: 100%;
		}
	}
</style>