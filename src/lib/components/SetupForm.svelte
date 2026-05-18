<script>
	import { defaultSetup } from '$lib/data/setupDefaults.js';

	/**
	 * @typedef {import('$lib/data/setupDefaults.js').FeedCountSetup} FeedCountSetup
	 */

	/** @type {{ setup: FeedCountSetup, onSave: (setup: FeedCountSetup) => void }} */
	let { setup, onSave } = $props();

	let draftSetup = $state({
		...defaultSetup,
		bottleSizesMl: [...defaultSetup.bottleSizesMl]
	});

	$effect(() => {
		draftSetup = {
			...setup,
			bottleSizesMl: [...setup.bottleSizesMl]
		};
	});

	function saveForm() {
		onSave({
			...draftSetup,
			currentWeightKg: Number(draftSetup.currentWeightKg),
			formulaKcalPer100ml: Number(draftSetup.formulaKcalPer100ml),
			bottleSizesMl: draftSetup.bottleSizesMl.map(Number)
		});
	}
</script>

<section class="setup-card" aria-labelledby="setup-title">
	<div class="setup-header">
		<p class="eyebrow">Setup</p>
		<h2 id="setup-title">Baby and formula details</h2>
		<p class="helper">
			These details help FeedCount estimate today’s remaining formula feeds.
		</p>
	</div>

	<form
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
			<input bind:value={draftSetup.birthDate} type="date" />
		</label>

		<label>
			<span>Baby sex</span>
			<select bind:value={draftSetup.babySex}>
				<option value="female">Female</option>
				<option value="male">Male</option>
			</select>
		</label>

		<label>
			<span>Current weight, kg</span>
			<input
				bind:value={draftSetup.currentWeightKg}
				type="number"
				min="0"
				step="0.01"
				inputmode="decimal"
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

		<button type="submit">Save setup</button>
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

	input,
	select,
	button {
		min-height: 3rem;
		border-radius: 0.9rem;
		font: inherit;
	}

	input,
	select {
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
	}
</style>