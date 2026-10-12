<script>
	import { tick } from 'svelte';

	/** @type {{ bottleSizesMl: number[], onChange?: () => void }} */
	let { bottleSizesMl = $bindable(), onChange = () => {} } = $props();

	let isAddingBottleSize = $state(false);
	let newBottleSizeInput = $state('');
	let error = $state('');
	/** @type {HTMLInputElement | undefined} */
	let input = $state();
	/** @type {HTMLButtonElement | undefined} */
	let addButton = $state();
	const id = $props.id();

	async function showBottleSizeInput() {
		isAddingBottleSize = true;
		await tick();
		input?.focus();
	}

	async function hideBottleSizeInput() {
		isAddingBottleSize = false;
		newBottleSizeInput = '';
		error = '';
		await tick();
		addButton?.focus();
	}

	// Used by the parent form so a pending size is never silently lost on save.
	export function commitPending() {
		if (!isAddingBottleSize) return true;

		const value = Number(newBottleSizeInput.trim().replace(',', '.'));
		const bottleSize = Math.round(value);
		if (!Number.isFinite(value) || bottleSize <= 0) {
			error = 'Enter a prepared formula volume of at least 1 ml.';
			input?.focus();
			return false;
		}
		if (bottleSizesMl.includes(bottleSize)) {
			error = 'This bottle size is already added. Choose another size or cancel.';
			input?.focus();
			return false;
		}

		bottleSizesMl = [...bottleSizesMl, bottleSize].sort((a, b) => a - b);
		onChange();
		void hideBottleSizeInput();
		return true;
	}

	/** @param {number} bottleSize */
	function removeBottleSize(bottleSize) {
		if (bottleSizesMl.length <= 1) return;
		bottleSizesMl = bottleSizesMl.filter((size) => size !== bottleSize);
		onChange();
	}
</script>

<p class="helper-text">Add the prepared formula volumes you normally offer.</p>
<p class="helper-text volume-callout">
	Use the <strong>final volume in the bottle after mixing formula powder with water</strong> — not the
	amount of water you started with.
</p>
<p class="helper-text">You’ll use these sizes when logging feeds.</p>

<div class="bottle-size-list" aria-label="Saved bottle sizes">
	{#each bottleSizesMl as bottleSize, index (index)}
		<button
			class="bottle-size-chip"
			type="button"
			aria-label={`Remove ${bottleSize} ml bottle size`}
			disabled={bottleSizesMl.length <= 1}
			onclick={() => removeBottleSize(bottleSize)}
		>
			<span>{bottleSize} ml</span><span aria-hidden="true">×</span>
		</button>
	{/each}
</div>

{#if isAddingBottleSize}
	<div class="add-bottle-size-row">
		<label class="add-bottle-size-field">
			<span class="sr-only">New bottle size</span>
			<div class="input-with-unit">
				<input
					bind:this={input}
					bind:value={newBottleSizeInput}
					type="text"
					inputmode="numeric"
					autocomplete="off"
					placeholder="120"
					aria-invalid={!!error}
					aria-describedby={error ? `${id}-error` : undefined}
					oninput={() => (error = '')}
					onkeydown={(event) => {
						if (event.key === 'Enter') {
							event.preventDefault();
							commitPending();
						}
						if (event.key === 'Escape') {
							event.preventDefault();
							void hideBottleSizeInput();
						}
					}}
				/>
				<span>ml</span>
			</div>
		</label>
		<button class="inline-button" type="button" onclick={commitPending}>Add</button>
		<button class="inline-button secondary" type="button" onclick={hideBottleSizeInput}
			>Cancel</button
		>
	</div>
{:else}
	<button
		bind:this={addButton}
		class="add-bottle-size-button"
		type="button"
		onclick={showBottleSizeInput}
	>
		+ Add bottle size
	</button>
{/if}
{#if error}
	<p id={`${id}-error`} class="helper-text" role="alert">{error}</p>
{/if}
