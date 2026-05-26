<script>
	import StepperInput from '$lib/components/StepperInput.svelte';

	/**
	 * @typedef {import('$lib/data/dailyInputDefaults.js').DailyInput} DailyInput
	 */

	/** @type {{ dailyInput: DailyInput, onChange: (dailyInput: DailyInput) => void }} */
	let { dailyInput, onChange } = $props();

	let formulaConsumedInput = $state('0');

	$effect(() => {
		formulaConsumedInput = String(dailyInput.formulaConsumedMl ?? 0);
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
	 * @param {number} formulaFeedsLeftToday
	 */
	function handleFeedsLeftChange(formulaFeedsLeftToday) {
		onChange({
			...dailyInput,
			formulaFeedsLeftToday
		});
	}
</script>

<section class="daily-input-card">
	<h2>Today’s feedings</h2>

	<div class="daily-controls">
		<label class="control-group">
			<span class="control-label">Formula consumed today</span>

			<div class="compact-input">
				<input
					type="number"
					min="0"
					step="1"
					inputmode="numeric"
					value={formulaConsumedInput}
					oninput={handleFormulaConsumedInput}
					aria-label="Formula consumed today in millilitres"
				/>

				<span class="unit">ml</span>
			</div>
		</label>

		<div class="control-group">
			<span class="control-label">Feeds left today</span>

			<StepperInput
				value={dailyInput.formulaFeedsLeftToday ?? 0}
				min={0}
				step={1}
				ariaLabel="Formula feeds left today"
				decreaseAriaLabel="Decrease feeds left today"
				increaseAriaLabel="Increase feeds left today"
				onChange={handleFeedsLeftChange}
			/>
		</div>
	</div>
</section>

<style>
	.daily-input-card {
		width: 100%;
		max-width: 420px;
		display: grid;
		gap: 16px;
		padding: 18px;
		border: 1px solid color-mix(in srgb, var(--color-info) 28%, var(--color-border));
		border-radius: 24px;
		background: color-mix(in srgb, var(--color-info) 12%, var(--color-surface));
		box-shadow: 0 8px 24px var(--color-shadow);
	}

	h2 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 650;
		line-height: 1.25;
		letter-spacing: -0.02em;
		color: var(--color-text);
	}

	.daily-controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 14px;
	}

	.control-group {
		display: grid;
		gap: 8px;
		min-width: 0;
	}

	.control-label {
		font-size: 0.88rem;
		font-weight: 500;
		line-height: 1.35;
		color: var(--color-muted-text);
	}

	.compact-input {
		width: fit-content;
		max-width: 100%;
		min-height: 52px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 0 16px;
		border: 1px solid color-mix(in srgb, var(--color-info) 24%, var(--color-border));
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-info) 10%, var(--color-surface));
	}

	.compact-input input {
		width: 4.5ch;
		min-width: 4.5ch;
		border: 0;
		background: transparent;
		font: inherit;
		font-size: 1.3rem;
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.01em;
		color: var(--color-text);
		outline: none;
		appearance: textfield;
	}

	.compact-input input::-webkit-outer-spin-button,
	.compact-input input::-webkit-inner-spin-button {
		margin: 0;
		appearance: none;
	}

	.unit {
		font-size: 0.96rem;
		font-weight: 500;
		color: var(--color-muted-text);
	}

	@media (min-width: 390px) {
		.daily-controls {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 16px;
		}

		.daily-controls > .control-group + .control-group {
			padding-left: 16px;
			border-left: 1px solid color-mix(in srgb, var(--color-info) 24%, var(--color-border));
		}
	}
</style>