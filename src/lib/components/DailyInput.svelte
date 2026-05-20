<script>
	/**
	 * @typedef {import('$lib/data/dailyInputDefaults.js').DailyInput} DailyInput
	 */

	/** @type {{ dailyInput: DailyInput, onChange: (dailyInput: DailyInput) => void }} */
	let { dailyInput, onChange } = $props();

	let formulaConsumedInput = $state('0');
	let formulaFeedsLeftInput = $state('0');

	$effect(() => {
		formulaConsumedInput = String(dailyInput.formulaConsumedMl ?? 0);
		formulaFeedsLeftInput = String(dailyInput.formulaFeedsLeftToday ?? 0);
	});

	/**
	 * @param {Event} event
	 */
	function handleFormulaConsumedInput(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const value = input.value;

		formulaConsumedInput = value;

		const formulaConsumedMl = value === '' ? 0 : Number(value);

		if (!Number.isFinite(formulaConsumedMl) || formulaConsumedMl < 0) {
			return;
		}

		onChange({
			...dailyInput,
			formulaConsumedMl
		});
	}

	/**
	 * @param {Event} event
	 */
	function handleFormulaFeedsLeftInput(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const value = input.value;

		formulaFeedsLeftInput = value;

		const formulaFeedsLeftToday = value === '' ? 0 : Number(value);

		if (!Number.isFinite(formulaFeedsLeftToday) || formulaFeedsLeftToday < 0) {
			return;
		}

		onChange({
			...dailyInput,
			formulaFeedsLeftToday: Math.floor(formulaFeedsLeftToday)
		});
	}
</script>

<section class="daily-input-card">
	<div>
		<p class="eyebrow">Today</p>
		<h2>Today’s formula plan</h2>
		<p class="description">
			Enter the formula already consumed today and how many formula feeds you still plan.
			This is not a feeding log.
		</p>
	</div>

	<label class="field">
		<span>Formula consumed today</span>

		<div class="input-row">
			<input
				type="number"
				min="0"
				step="1"
				inputmode="numeric"
				value={formulaConsumedInput}
				oninput={handleFormulaConsumedInput}
			/>

			<span class="unit">ml</span>
		</div>
	</label>

	<label class="field">
		<span>Formula feeds left today</span>

		<div class="input-row">
			<input
				type="number"
				min="0"
				step="1"
				inputmode="numeric"
				value={formulaFeedsLeftInput}
				oninput={handleFormulaFeedsLeftInput}
			/>

			<span class="unit">feeds</span>
		</div>
	</label>
</section>

<style>
	.daily-input-card {
		width: 100%;
		max-width: 420px;
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--color-border, #ddd);
		border-radius: 1rem;
		background: var(--color-surface, #fff);
	}

	.eyebrow {
		margin: 0 0 0.25rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-muted, #666);
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.description {
		margin: 0.35rem 0 0;
		color: var(--color-muted, #666);
		line-height: 1.4;
	}

	.field {
		display: grid;
		gap: 0.4rem;
		font-weight: 600;
	}

	.input-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	input {
		width: 100%;
		min-height: 2.75rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 0.75rem;
		font: inherit;
	}

	.unit {
		color: var(--color-muted, #666);
		font-weight: 600;
	}
</style>