<script>
	/**
	 * @typedef {import('$lib/data/dailyInputDefaults.js').DailyInput} DailyInput
	 */

	/** @type {{ dailyInput: DailyInput, onChange: (dailyInput: DailyInput) => void }} */
	let { dailyInput, onChange } = $props();

	let formulaConsumedInput = $state('0');

	const feedsLeftToday = $derived(dailyInput.formulaFeedsLeftToday ?? 0);

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
	 * @param {number} change
	 */
	function updateFeedsLeft(change) {
		const currentFeedsLeft = Number(dailyInput.formulaFeedsLeftToday ?? 0);
		const nextFeedsLeft = Math.max(0, currentFeedsLeft + change);

		onChange({
			...dailyInput,
			formulaFeedsLeftToday: nextFeedsLeft
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

			<div class="stepper" aria-label="Formula feeds left today">
				<button
					type="button"
					class="stepper-button"
					aria-label="Decrease feeds left today"
					disabled={feedsLeftToday === 0}
					onclick={() => updateFeedsLeft(-1)}
				>
					−
				</button>

				<span class="stepper-value">{feedsLeftToday}</span>

				<button
					type="button"
					class="stepper-button"
					aria-label="Increase feeds left today"
					onclick={() => updateFeedsLeft(1)}
				>
					+
				</button>
			</div>
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
		border: 1px solid color-mix(in srgb, var(--color-text-primary) 8%, transparent);
		border-radius: 24px;
		background: var(--color-card-bg);
		box-shadow: 0 8px 24px color-mix(in srgb, var(--color-text-primary) 5%, transparent);
	}

	h2 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 650;
		line-height: 1.25;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
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
		color: var(--color-text-secondary);
	}

	.compact-input,
	.stepper {
		min-height: 52px;
		display: inline-flex;
		align-items: center;
		border: 1px solid color-mix(in srgb, var(--color-text-primary) 9%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-card-bg) 82%, var(--color-page-bg) 18%);
	}

	.compact-input {
		width: fit-content;
		max-width: 100%;
		padding: 0 16px;
		gap: 8px;
	}

	input {
		width: 4.5ch;
		min-width: 4.5ch;
		border: 0;
		background: transparent;
		font: inherit;
		font-size: 1.3rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.01em;
		color: var(--color-text-primary);
		outline: none;
		appearance: textfield;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		margin: 0;
		appearance: none;
	}

	.unit {
		font-size: 0.96rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.stepper {
		width: fit-content;
		max-width: 100%;
		gap: 14px;
		padding: 6px;
	}

	.stepper-button {
		width: 40px;
		height: 40px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		color: var(--color-text-primary);
		font: inherit;
		font-size: 1.35rem;
		font-weight: 400;
		line-height: 1;
		cursor: pointer;
	}

	.stepper-button:disabled {
		cursor: not-allowed;
		opacity: 0.35;
	}

	.stepper-button:not(:disabled):active {
		transform: scale(0.98);
	}

	.stepper-value {
		min-width: 2ch;
		text-align: center;
		font-size: 1.35rem;
		font-weight: 600;
		line-height: 1;
		color: var(--color-text-primary);
	}

	@media (min-width: 390px) {
		.daily-controls {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 16px;
		}

		.daily-controls > .control-group + .control-group {
			padding-left: 16px;
			border-left: 1px solid color-mix(in srgb, var(--color-text-primary) 7%, transparent);
		}
	}
</style>