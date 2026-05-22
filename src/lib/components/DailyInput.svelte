<script>
	/**
	 * @typedef {import('$lib/data/dailyInputDefaults.js').DailyInput} DailyInput
	 */

	/** @type {{ dailyInput: DailyInput, onChange: (dailyInput: DailyInput) => void }} */
	let { dailyInput, onChange } = $props();

	let formulaConsumedInput = $state('0');
	let feedsLeftInput = $state('0');

	const feedsLeftToday = $derived(dailyInput.formulaFeedsLeftToday ?? 0);

	$effect(() => {
		formulaConsumedInput = String(dailyInput.formulaConsumedMl ?? 0);
	});

	$effect(() => {
		feedsLeftInput = String(dailyInput.formulaFeedsLeftToday ?? 0);
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
	 * @param {string} value
	 */
	function parseFeedsLeft(value) {
		const trimmedValue = value.trim();

		if (trimmedValue === '') {
			return null;
		}

		const parsedValue = Number(trimmedValue);

		if (!Number.isInteger(parsedValue) || parsedValue < 0) {
			return null;
		}

		return parsedValue;
	}

	/**
	 * @param {Event} event
	 */
	function handleFeedsLeftInput(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const value = input.value;

		feedsLeftInput = value;

		const feedsLeft = parseFeedsLeft(value);

		if (feedsLeft === null) {
			return;
		}

		onChange({
			...dailyInput,
			formulaFeedsLeftToday: feedsLeft
		});
	}

	function restoreSafeFeedsLeftValue() {
		const feedsLeft = parseFeedsLeft(feedsLeftInput);

		if (feedsLeft === null) {
			feedsLeftInput = String(dailyInput.formulaFeedsLeftToday ?? 0);
			return;
		}

		feedsLeftInput = String(feedsLeft);
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleFeedsLeftKeydown(event) {
		if (event.key !== 'Enter') {
			return;
		}

		restoreSafeFeedsLeftValue();
		/** @type {HTMLInputElement} */ (event.currentTarget).blur();
	}

	/**
	 * @param {number} change
	 */
	function updateFeedsLeft(change) {
		const currentFeedsLeft = Number(dailyInput.formulaFeedsLeftToday ?? 0);
		const nextFeedsLeft = Math.max(0, currentFeedsLeft + change);

		feedsLeftInput = String(nextFeedsLeft);

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

				<input
					class="stepper-input"
					type="text"
					inputmode="numeric"
					pattern="[0-9]*"
					value={feedsLeftInput}
					oninput={handleFeedsLeftInput}
					onblur={restoreSafeFeedsLeftValue}
					onkeydown={handleFeedsLeftKeydown}
					aria-label="Feeds left today"
				/>

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

	.stepper {
		width: fit-content;
		max-width: 100%;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.stepper-button,
	.stepper-input {
		width: 44px;
		height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid color-mix(in srgb, var(--color-primary-accent) 20%, var(--color-border));
		border-radius: 16px;
		background: color-mix(in srgb, var(--color-primary-accent) 16%, var(--color-surface));
		color: var(--color-text);
		font: inherit;
		line-height: 1;
	}

	.stepper-button {
		font-size: 1.35rem;
		font-weight: 450;
		cursor: pointer;
	}

	.stepper-button:disabled {
		cursor: not-allowed;
		opacity: 0.35;
	}

	.stepper-button:not(:disabled):active {
		transform: scale(0.98);
	}

	.stepper-input {
		text-align: center;
		font-size: 1.25rem;
		font-weight: 550;
		letter-spacing: -0.01em;
		outline: none;
		appearance: textfield;
	}

	.stepper-input:focus {
		border-color: color-mix(in srgb, var(--color-primary-accent) 55%, var(--color-border));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-accent) 18%, transparent);
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