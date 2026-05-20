<script>
	import { onMount } from 'svelte';
	import SetupForm from '$lib/components/SetupForm.svelte';
	import DailyInput from '$lib/components/DailyInput.svelte';
	import { initialiseSetup, setup, updateSetup } from '$lib/stores/setupStore.js';
	import { getDailyEnergyTarget } from '$lib/calculations/dailyEnergyTarget.js';
	import { getDailyFormulaTargetMl } from '$lib/calculations/dailyFormulaTarget.js';
	import {
		getRemainingFormulaMl,
		isFormulaConsumedAboveEstimate
	} from '$lib/calculations/remainingFormula.js';
	import { getBottleDistributionSuggestions } from '$lib/calculations/bottleDistribution.js';
	import { createDailyInputState } from '$lib/state/dailyInputState.svelte.js';
	import { validateSetup } from '$lib/validation/setupValidation.js';
	import { validateDailyInput } from '$lib/validation/dailyInputValidation.js';

	const appName = 'FeedCount';

	const dailyInputState = createDailyInputState();

	const setupValidation = $derived(validateSetup($setup));
	const dailyInputValidation = $derived(validateDailyInput(dailyInputState.dailyInput));
	const canShowResults = $derived(setupValidation.isValid && dailyInputValidation.isValid);

	const dailyEnergyTarget = $derived(canShowResults ? getDailyEnergyTarget($setup) : null);
	const dailyFormulaTargetMl = $derived(
		canShowResults
			? getDailyFormulaTargetMl(dailyEnergyTarget?.kcalPerDay, $setup.formulaKcalPer100ml)
			: null
	);
	const remainingFormulaMl = $derived(
		dailyFormulaTargetMl === null
			? null
			: getRemainingFormulaMl(
					dailyFormulaTargetMl,
					dailyInputState.dailyInput.formulaConsumedMl
				)
	);
	const isAboveFormulaEstimate = $derived(
		dailyFormulaTargetMl === null
			? false
			: isFormulaConsumedAboveEstimate(
					dailyFormulaTargetMl,
					dailyInputState.dailyInput.formulaConsumedMl
				)
	);
	const bottleDistributionSuggestions = $derived(
		remainingFormulaMl === null
			? []
			: getBottleDistributionSuggestions({
					remainingFormulaMl,
					bottleSizesMl: $setup.bottleSizesMl,
					feedCount: dailyInputState.dailyInput.formulaFeedsLeftToday
				})
	);

	onMount(() => {
		initialiseSetup();
		dailyInputState.load();
	});

	/**
	 * @param {'closest-to-target' | 'small-buffer-above-target'} suggestionType
	 * @returns {string}
	 */
	function getSuggestionLabel(suggestionType) {
		if (suggestionType === 'closest-to-target') {
			return 'Closest option';
		}

		return 'Small buffer';
	}

	/**
	 * @param {number[]} bottlesMl
	 * @returns {string}
	 */
	function formatBottleCombination(bottlesMl) {
		return bottlesMl.map((bottleMl) => `${bottleMl} ml`).join(' + ');
	}

	/**
	 * @param {number} differenceMl
	 * @returns {string}
	 */
	function formatDifference(differenceMl) {
		if (differenceMl === 0) {
			return 'Matches today’s estimate.';
		}

		if (differenceMl > 0) {
			return `About ${differenceMl} ml above today’s estimate.`;
		}

		return `About ${Math.abs(differenceMl)} ml below today’s estimate.`;
	}
</script>

<svelte:head>
	<title>{appName}</title>
	<meta
		name="description"
		content="A small app for estimating remaining formula feeds today."
	/>
</svelte:head>

<main class="page">
	<header class="app-header">
		<h1>{appName}</h1>
		<p class="intro">
			Practical estimates for planning today’s feeds.<br />
			Not medical advice.
		</p>
	</header>

	<DailyInput dailyInput={dailyInputState.dailyInput} onChange={dailyInputState.update} />

	{#if !setupValidation.isValid}
		<section class="card">
			<p class="card-title">Complete your setup</p>
			<p class="body-text">
				FeedCount needs a few basic details before it can estimate today’s formula.
			</p>

			<ul class="message-list">
				{#each setupValidation.messages as message}
					<li>{message}</li>
				{/each}
			</ul>
		</section>
	{:else if !dailyInputValidation.isValid}
		<section class="card">
			<p class="card-title">Check today’s input</p>
			<p class="body-text">
				Today’s formula intake needs a valid amount before FeedCount can calculate what
				remains.
			</p>

			<ul class="message-list">
				{#each dailyInputValidation.messages as message}
					<li>{message}</li>
				{/each}
			</ul>
		</section>
	{:else if dailyFormulaTargetMl !== null}
		<section class="card">
			<p class="card-title">Remaining formula today</p>
			<p class="primary-value">{remainingFormulaMl} ml</p>

			{#if isAboveFormulaEstimate}
				<p class="body-text">
					Today’s entered formula is already above the estimate. This can happen – the
					number is only a practical guide.
				</p>
			{:else}
				<p class="body-text">This is an estimate, not a medical target.</p>
			{/if}
		</section>

		<section class="card quiet-card">
			<p class="card-title">Suggested bottle split</p>

			{#if dailyInputState.dailyInput.formulaFeedsLeftToday <= 0}
				<p class="body-text">
					Enter how many formula feeds are left today to get bottle ideas.
				</p>
			{:else if bottleDistributionSuggestions.length > 0}
				<div class="suggestions">
					{#each bottleDistributionSuggestions as suggestion}
						<div class="suggestion">
							<p class="suggestion-label">{getSuggestionLabel(suggestion.type)}</p>
							<p class="suggestion-value">
								{formatBottleCombination(suggestion.bottlesMl)}
							</p>
							<p class="body-text">
								Total: {suggestion.totalMl} ml • {formatDifference(suggestion.differenceMl)}
							</p>
						</div>
					{/each}
				</div>

				<p class="body-text">Practical bottle ideas using your saved bottle sizes.</p>
			{:else}
				<p class="body-text">
					No useful bottle suggestion yet. Check that bottle sizes are saved in setup.
				</p>
			{/if}
		</section>

		<section class="card reference-card">
			<p class="card-title">Daily estimate</p>
			<p class="secondary-value">{dailyFormulaTargetMl} ml</p>
			<p class="body-text">
				Based on the selected energy reference and formula calories per 100 ml.
			</p>
		</section>
	{:else}
		<section class="card">
			<p class="card-title">Formula estimate is not ready yet</p>
			<p class="body-text">
				Check the setup values below, then save again to refresh the estimate.
			</p>
		</section>
	{/if}

	<details class="card about-card">
		<summary>About FeedCount</summary>

		<div class="about-content">
			<p>
				FeedCount helps estimate how much formula may still be needed today, using the
				setup details and today’s entered formula intake.
			</p>

			<p>
				The numbers are practical planning estimates only. They are not medical targets
				and do not replace advice from a clinician.
			</p>
		</div>
	</details>

	<section class="setup-section">
		<SetupForm setup={$setup} onSave={updateSetup} />
	</section>
</main>

<style>
	.page {
		min-height: 100vh;
		padding: 24px var(--space-page-x) 36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		background: color-mix(in srgb, var(--color-page-bg) 76%, white 24%);
	}

	.app-header {
		width: 100%;
		max-width: 420px;
		padding: 6px 2px 14px;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.25rem, 9vw, 2.9rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.05em;
		color: var(--color-text-primary);
	}

	.intro {
		margin: 14px 0 0;
		font-size: 0.96rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-text-secondary);
	}

	.card {
		width: 100%;
		max-width: 420px;
		padding: 18px;
		border: 1px solid color-mix(in srgb, var(--color-text-primary) 7%, transparent);
		border-radius: 24px;
		background: var(--color-card-bg);
		box-shadow: 0 8px 24px color-mix(in srgb, var(--color-text-primary) 5%, transparent);
	}

	.quiet-card,
	.reference-card,
	.about-card {
		box-shadow: none;
	}

	.quiet-card {
		background: color-mix(in srgb, var(--color-card-bg) 70%, var(--color-page-bg) 30%);
	}

	.reference-card {
		background: transparent;
	}

	.card-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 650;
		line-height: 1.3;
		letter-spacing: -0.015em;
		color: var(--color-text-primary);
	}

	.primary-value {
		margin: 12px 0 0;
		font-size: 1.8rem;
		font-weight: 650;
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
	}

	.secondary-value {
		margin: 10px 0 0;
		font-size: 1.4rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.015em;
		color: var(--color-text-primary);
	}

	.body-text {
		margin: 10px 0 0;
		font-size: 0.9rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-text-muted);
	}

	.message-list {
		margin: 12px 0 0;
		padding-left: 20px;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	.suggestions {
		display: grid;
		gap: 0;
		margin-top: 12px;
		border-top: 1px solid color-mix(in srgb, var(--color-text-primary) 7%, transparent);
	}

	.suggestion {
		padding: 14px 0;
		border-bottom: 1px solid color-mix(in srgb, var(--color-text-primary) 7%, transparent);
	}

	.suggestion-label {
		margin: 0;
		font-size: 0.86rem;
		font-weight: 500;
		line-height: 1.35;
		color: var(--color-text-muted);
	}

	.suggestion-value {
		margin: 6px 0 0;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--color-text-primary);
	}

	.about-card {
		padding: 0;
		overflow: hidden;
		background: var(--color-card-bg);
	}

	summary {
		min-height: 58px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 0 18px;
		font-size: 1rem;
		font-weight: 650;
		line-height: 1.3;
		color: var(--color-text-primary);
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary::after {
		content: '⌄';
		font-size: 1.1rem;
		font-weight: 400;
		color: var(--color-text-muted);
		transition: transform 0.15s ease;
	}

	.about-card[open] summary::after {
		transform: rotate(180deg);
	}

	.about-content {
		padding: 0 18px 18px;
	}

	.about-content p {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 400;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.about-content p + p {
		margin-top: 10px;
	}

	.setup-section {
		width: 100%;
		max-width: 420px;
		margin-top: 10px;
	}
</style>