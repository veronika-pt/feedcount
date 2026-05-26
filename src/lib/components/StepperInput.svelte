<script>
	/** @type {{
		value: number,
		onChange: (value: number) => void,
		min?: number,
		step?: number,
		unit?: string,
		decimalPlaces?: number,
		useDecimalComma?: boolean,
		enforceInteger?: boolean,
		ariaLabel: string,
		decreaseAriaLabel: string,
		increaseAriaLabel: string
	}} */
	let {
		value,
		onChange,
		min = 0,
		step = 1,
		unit = '',
		decimalPlaces = 0,
		useDecimalComma = false,
		enforceInteger = true,
		ariaLabel,
		decreaseAriaLabel,
		increaseAriaLabel
	} = $props();

	let inputValue = $state('');
	let isFocused = $state(false);

	const isDecreaseDisabled = $derived(value <= min);

	$effect(() => {
		if (isFocused) {
			return;
		}

		inputValue = formatInputValue(value);
	});

	/**
	 * @param {number} numberValue
	 * @returns {string}
	 */
	function formatInputValue(numberValue) {
		if (!Number.isFinite(numberValue)) {
			return '';
		}

		const formattedValue =
			decimalPlaces > 0 ? numberValue.toFixed(decimalPlaces) : String(Math.round(numberValue));

		return useDecimalComma ? formattedValue.replace('.', ',') : formattedValue;
	}

	/**
	 * @param {string} rawValue
	 * @returns {number | null}
	 */
	function parseInputValue(rawValue) {
		const trimmedValue = rawValue.trim();

		if (trimmedValue === '') {
			return null;
		}

		const normalizedValue = useDecimalComma ? trimmedValue.replace(',', '.') : trimmedValue;
		const parsedValue = Number(normalizedValue);

		if (!Number.isFinite(parsedValue) || parsedValue < min) {
			return null;
		}

		if (enforceInteger && !Number.isInteger(parsedValue)) {
			return null;
		}

		return parsedValue;
	}

	/**
	 * @param {number} numberValue
	 * @returns {number}
	 */
	function normalizeValue(numberValue) {
		const roundedToStep = Math.round(numberValue / step) * step;
		const multiplier = 10 ** decimalPlaces;
		const roundedValue = Math.round(roundedToStep * multiplier) / multiplier;

		return Math.max(min, roundedValue);
	}

	/**
	 * @param {number} nextValue
	 */
	function updateValue(nextValue) {
		const safeValue = normalizeValue(nextValue);

		inputValue = formatInputValue(safeValue);
		onChange(safeValue);
	}

	/**
	 * @param {Event} event
	 */
	function handleInput(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const rawValue = input.value;

		inputValue = rawValue;

		const parsedValue = parseInputValue(rawValue);

		if (parsedValue === null) {
			return;
		}

		onChange(normalizeValue(parsedValue));
	}

	function restoreSafeValue() {
		const parsedValue = parseInputValue(inputValue);

		isFocused = false;

		if (parsedValue === null) {
			inputValue = formatInputValue(value);
			return;
		}

		updateValue(parsedValue);
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleKeydown(event) {
		if (event.key !== 'Enter') {
			return;
		}

		restoreSafeValue();
		/** @type {HTMLInputElement} */ (event.currentTarget).blur();
	}

	/**
	 * @param {number} change
	 */
	function updateByStep(change) {
		const parsedValue = parseInputValue(inputValue);
		const currentValue = parsedValue ?? value ?? min;

		updateValue(currentValue + change);
	}
</script>

<div class="stepper-input-control" aria-label={ariaLabel}>
	<button
		type="button"
		class="stepper-button"
		aria-label={decreaseAriaLabel}
		disabled={isDecreaseDisabled}
		onclick={() => updateByStep(-step)}
	>
		−
	</button>

	<div class="stepper-value">
		<input
			type="text"
			inputmode={decimalPlaces > 0 ? 'decimal' : 'numeric'}
			pattern={decimalPlaces > 0 ? undefined : '[0-9]*'}
			value={inputValue}
			onfocus={() => (isFocused = true)}
			oninput={handleInput}
			onblur={restoreSafeValue}
			onkeydown={handleKeydown}
			aria-label={ariaLabel}
		/>

		{#if unit}
			<span>{unit}</span>
		{/if}
	</div>

	<button
		type="button"
		class="stepper-button"
		aria-label={increaseAriaLabel}
		onclick={() => updateByStep(step)}
	>
		+
	</button>
</div>

<style>
	.stepper-input-control {
		width: fit-content;
		max-width: 100%;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.stepper-button,
	.stepper-value {
		min-height: 44px;
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
		width: 44px;
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

	.stepper-value {
		gap: 6px;
		padding: 0 12px;
	}

	.stepper-value input {
		width: 3.2ch;
		border: 0;
		background: transparent;
		color: var(--color-text);
		font: inherit;
		font-size: 1.25rem;
		font-weight: 550;
		line-height: 1;
		text-align: center;
		letter-spacing: -0.01em;
		outline: none;
		appearance: textfield;
	}

	.stepper-value input:focus {
		outline: none;
	}

	.stepper-value:focus-within {
		border-color: color-mix(in srgb, var(--color-primary-accent) 55%, var(--color-border));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-accent) 18%, transparent);
	}

	.stepper-value span {
		font-size: 0.96rem;
		font-weight: 500;
		color: var(--color-muted-text);
	}
</style>