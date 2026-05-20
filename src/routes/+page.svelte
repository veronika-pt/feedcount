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

	const appName = 'FeedCount';

	const dailyInputState = createDailyInputState();

	const dailyEnergyTarget = $derived(getDailyEnergyTarget($setup));
	const dailyFormulaTargetMl = $derived(
		getDailyFormulaTargetMl(dailyEnergyTarget?.kcalPerDay, $setup.formulaKcalPer100ml)
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
			return 'Closest to target';
		}

		return 'Small buffer above target';
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
			return 'Matches the remaining estimate.';
		}

		if (differenceMl > 0) {
			return `${differenceMl} ml above the remaining estimate.`;
		}

		return `${Math.abs(differenceMl)} ml below the remaining estimate.`;
	}
</script>

<svelte:head>
	<title>{appName}</title>
	<meta
		name="description"
		content="A small app for estimating remaining formula feeds during mixed feeding."
	/>
</svelte:head>

<main class="page">
	<section class="card">
		<p class="eyebrow">Mixed feeding helper</p>

		<h1>{appName}</h1>

		<p class="intro">
			Estimate how much formula is left for today, based on formula already consumed,
			breastfeeding sessions, and remaining feeds.
		</p>

		<p class="note">
			FeedCount gives practical estimates only. It does not replace medical advice.
		</p>

		{#if dailyFormulaTargetMl}
			<div class="result">
				<p class="result-label">Estimated daily formula target</p>
				<p class="result-value">{dailyFormulaTargetMl} ml</p>
				<p class="result-note">
					Estimate based on the selected energy reference and formula calories per 100 ml.
				</p>
			</div>

			<div class="result">
				<p class="result-label">Estimated formula remaining today</p>
				<p class="result-value">{remainingFormulaMl} ml</p>

				{#if isAboveFormulaEstimate}
					<p class="result-note">
						Today’s entered formula is already above the estimate. This can happen – the
						number is only a practical guide.
					</p>
				{:else}
					<p class="result-note">
						Based on today’s total formula intake entered below. This is an estimate, not
						a medical target.
					</p>
				{/if}
			</div>

			<div class="result">
				<p class="result-label">Bottle ideas</p>

				{#if dailyInputState.dailyInput.formulaFeedsLeftToday <= 0}
					<p class="result-note">
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
								<p class="suggestion-note">
									Total: {suggestion.totalMl} ml. {formatDifference(suggestion.differenceMl)}
								</p>
							</div>
						{/each}
					</div>

					<p class="result-note">
						These are practical bottle estimates using your saved bottle sizes and planned
						formula feeds, not a strict feeding plan.
					</p>
				{:else}
					<p class="result-note">
						No useful bottle suggestion yet. Check that bottle sizes are saved in setup.
					</p>
				{/if}
			</div>
		{:else}
			<p class="note">
				Add valid setup values to calculate the estimated daily formula target.
			</p>
		{/if}
	</section>

	<DailyInput
		dailyInput={dailyInputState.dailyInput}
		onChange={dailyInputState.update}
	/>

	<SetupForm setup={$setup} onSave={updateSetup} />
</main>

<style>
	.page {
		min-height: 100vh;
		padding: 24px var(--space-page-x);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}

	.card {
		width: 100%;
		max-width: 420px;
		padding: 24px;
		border-radius: var(--radius-card);
		background: var(--color-card-bg);
		box-shadow: var(--shadow-card);
	}

	.eyebrow {
		margin: 0 0 8px;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	h1 {
		margin: 0;
		font-size: clamp(2.2rem, 10vw, 3.2rem);
		letter-spacing: -0.06em;
		color: var(--color-text-primary);
	}

	.intro {
		margin: 16px 0 0;
		font-size: 1.05rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	.note {
		margin: 20px 0 0;
		font-size: 0.95rem;
		line-height: 1.4;
		color: var(--color-text-muted);
	}

	.result {
		margin-top: 20px;
		padding: 16px;
		border-radius: 16px;
		background: var(--color-page-bg);
	}

	.result-label {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-text-muted);
	}

	.result-value {
		margin: 6px 0 0;
		font-size: 2rem;
		font-weight: 800;
		line-height: 1;
		color: var(--color-text-primary);
	}

	.result-note {
		margin: 8px 0 0;
		font-size: 0.85rem;
		line-height: 1.4;
		color: var(--color-text-muted);
	}

	.suggestions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 12px;
	}

	.suggestion {
		padding: 12px;
		border-radius: 12px;
		background: var(--color-card-bg);
	}

	.suggestion-label {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
	}

	.suggestion-value {
		margin: 6px 0 0;
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.suggestion-note {
		margin: 6px 0 0;
		font-size: 0.85rem;
		line-height: 1.4;
		color: var(--color-text-muted);
	}
</style>