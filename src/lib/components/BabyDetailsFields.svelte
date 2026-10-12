<script>
	/**
	 * @typedef {import('$lib/data/setupDefaults.js').SetupDraft} SetupDraft
	 */

	/** @type {{ draft: SetupDraft }} */
	let { draft = $bindable() } = $props();
	const id = $props.id();
</script>

<div class="section-fields">
	<label>
		<span>Date of birth</span>
		<input bind:value={draft.birthDate} type="date" lang="en-GB" autocomplete="bday" />
	</label>

	<fieldset class="field">
		<legend>Sex</legend>
		<label class="radio-option">
			<input type="radio" name={`${id}-sex`} value="female" bind:group={draft.babySex} />
			<span>Girl</span>
		</label>
		<label class="radio-option">
			<input type="radio" name={`${id}-sex`} value="male" bind:group={draft.babySex} />
			<span>Boy</span>
		</label>
		<label class="radio-option">
			<input type="radio" name={`${id}-sex`} value="unspecified" bind:group={draft.babySex} />
			<span>Average</span>
		</label>
	</fieldset>

	<label>
		<span>Current weight, kg</span>
		<input
			bind:value={draft.currentWeightKg}
			type="text"
			inputmode="decimal"
			autocomplete="off"
			aria-describedby={`${id}-weight-helper`}
		/>
		<span id={`${id}-weight-helper`} class="helper-text">Used to estimate daily formula needs.</span
		>
	</label>
</div>
