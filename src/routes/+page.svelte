<script>
	import { onMount } from 'svelte';
	import DailyInput from '$lib/components/DailyInput.svelte';
	import StepperInput from '$lib/components/StepperInput.svelte';
	import { initialiseSetup, setup, updateSetup } from '$lib/stores/setupStore.js';
	import { getCompletedAgeMonths } from '$lib/calculations/age.js';
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
			: getRemainingFormulaMl(dailyFormulaTargetMl, dailyInputState.dailyInput.formulaConsumedMl)
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
	const primaryBottleDistributionSuggestion = $derived(bottleDistributionSuggestions[0] ?? null);
	const otherBottleDistributionSuggestions = $derived(bottleDistributionSuggestions.slice(1));
	const dailyEstimateMetadata = $derived(
		[
			formatBabySexLabel($setup.babySex),
			formatAgeLabel($setup.birthDate),
			formatWeightLabel($setup.currentWeightKg),
			formatFeedingModeLabel($setup.feedingMode)
		].filter(Boolean)
	);

	onMount(() => {
		initialiseSetup();
		dailyInputState.load();
	});

	/**
	 * @param {number} currentWeightKg
	 */
	function handleCurrentWeightChange(currentWeightKg) {
		updateSetup({
			...$setup,
			currentWeightKg
		});
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
			return 'Matches today’s estimate';
		}

		if (differenceMl > 0) {
			return `About ${differenceMl} ml above today’s estimate`;
		}

		return `About ${Math.abs(differenceMl)} ml below today’s estimate`;
	}

	/**
	 * @param {import('$lib/data/setupDefaults.js').BabySex} babySex
	 * @returns {string}
	 */
	function formatBabySexLabel(babySex) {
		if (babySex === 'female') {
			return 'Girl';
		}

		if (babySex === 'male') {
			return 'Boy';
		}

		return 'Sex unspecified';
	}

	/**
	 * @param {string} birthDate
	 * @returns {string}
	 */
	function formatAgeLabel(birthDate) {
		const completedAgeMonths = getCompletedAgeMonths(birthDate);

		if (completedAgeMonths === null) {
			return '';
		}

		if (completedAgeMonths === 1) {
			return '1 month';
		}

		return `${completedAgeMonths} months`;
	}

	/**
	 * @param {number} weightKg
	 * @returns {string}
	 */
	function formatWeightLabel(weightKg) {
		if (!Number.isFinite(weightKg) || weightKg <= 0) {
			return '';
		}

		return `${weightKg.toFixed(1)} kg`;
	}

	/**
	 * @param {import('$lib/data/setupDefaults.js').FeedingMode} feedingMode
	 * @returns {string}
	 */
	function formatFeedingModeLabel(feedingMode) {
		if (feedingMode === 'formulaOnly') {
			return 'formula only';
		}

		return 'mixed feeding';
	}
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content="A small app for estimating remaining formula feeds today." />
</svelte:head>

<main class="page">
	<header class="app-header">
		<div>
			<h1>{appName}</h1>
			<p class="intro">Practical estimates for planning today’s feeds. Not medical advice.</p>
		</div>

		<a class="settings-link" href="/settings">Settings</a>
	</header>

	<DailyInput dailyInput={dailyInputState.dailyInput} onChange={dailyInputState.update} />

	<section class="card weight-card" aria-labelledby="current-weight-title">
		<div class="weight-copy">
			<p id="current-weight-title" class="card-title">Current weight</p>
			<p class="weight-helper">Used for daily estimate.</p>
		</div>

		<StepperInput
			value={$setup.currentWeightKg}
			min={0.1}
			step={0.1}
			unit="kg"
			decimalPlaces={1}
			useDecimalComma={true}
			enforceInteger={false}
			ariaLabel="Current weight in kilograms"
			decreaseAriaLabel="Decrease current weight by 100 grams"
			increaseAriaLabel="Increase current weight by 100 grams"
			onChange={handleCurrentWeightChange}
		/>
	</section>

	{#if !setupValidation.isValid}
		<section class="card">
			<p class="card-title">Complete your setup</p>
			<p class="body-text">Add the missing setup details in Settings to see today’s estimate.</p>

			<ul class="message-list">
				{#each setupValidation.messages as message}
					<li>{message}</li>
				{/each}
			</ul>

			<a class="inline-settings-link" href="/settings">Open Settings</a>
		</section>
	{:else if !dailyInputValidation.isValid}
		<section class="card">
			<p class="card-title">Check today’s input</p>
			<p class="body-text">Check today’s formula intake to update the estimate.</p>

			<ul class="message-list">
				{#each dailyInputValidation.messages as message}
					<li>{message}</li>
				{/each}
			</ul>
		</section>
	{:else if dailyFormulaTargetMl !== null}
		<section class="card remaining-card">
			<p class="card-title">Remaining formula today</p>
			<p class="remaining-value">{remainingFormulaMl} ml</p>

			{#if isAboveFormulaEstimate}
				<p class="body-text">
					Today’s entered formula is above the estimate. Use it as a practical guide.
				</p>
			{:else}
				<p class="body-text">This is an estimate, not a medical target.</p>
			{/if}
		</section>

		<section class="card quiet-card">
			<p class="card-title">Suggested bottle split</p>

			{#if dailyInputState.dailyInput.formulaFeedsLeftToday <= 0}
				<p class="body-text">Add feeds left to see bottle ideas.</p>
			{:else if primaryBottleDistributionSuggestion}
				<div class="suggestions">
					<div class="suggestion">
						<p class="suggestion-value">
							{formatBottleCombination(primaryBottleDistributionSuggestion.bottlesMl)}
						</p>
						<p class="body-text">
							Total: {primaryBottleDistributionSuggestion.totalMl} ml • {formatDifference(
								primaryBottleDistributionSuggestion.differenceMl
							)}
						</p>
					</div>
				</div>

				{#if otherBottleDistributionSuggestions.length > 0}
					<details class="other-options">
						<summary>See other options</summary>

						<div class="other-suggestions">
							{#each otherBottleDistributionSuggestions as suggestion}
								<div class="suggestion secondary-suggestion">
									<p class="suggestion-value">
										{formatBottleCombination(suggestion.bottlesMl)}
									</p>
									<p class="body-text">
										Total: {suggestion.totalMl} ml • {formatDifference(suggestion.differenceMl)}
									</p>
								</div>
							{/each}
						</div>
					</details>
				{/if}
			{:else}
				<p class="body-text">Check saved bottle sizes in Settings.</p>
			{/if}
		</section>

		<section class="card reference-card">
			<p class="card-title">Daily estimate</p>
			<p class="secondary-value">{dailyFormulaTargetMl} ml</p>

			{#if dailyEstimateMetadata.length > 0}
				<p class="estimate-metadata">{dailyEstimateMetadata.join(' • ')}</p>
			{/if}
		</section>
	{:else}
		<section class="card">
			<p class="card-title">Formula estimate is not ready yet</p>
			<p class="body-text">Check Settings, then save again.</p>

			<a class="inline-settings-link" href="/settings">Open Settings</a>
		</section>
	{/if}

	<details class="card about-card">
		<summary>About FeedCount</summary>

		<div class="about-content">
			<p>
				FeedCount estimates how much formula may still be needed today, using setup details, today’s
				entered formula intake, feeds left, and saved bottle sizes.
			</p>

			<p>
				The numbers are practical planning estimates only. They are not medical targets and do not
				replace advice from a clinician.
			</p>
		</div>
	</details>
</main>

<style>
	.page {
		min-height: 100vh;
		padding: 24px var(--space-page-x) 36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		background: var(--color-background);
	}

	.app-header {
		width: 100%;
		max-width: 420px;
		padding: 6px 2px 14px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.25rem, 9vw, 2.9rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.05em;
		color: var(--color-text);
	}

	.intro {
		margin: 14px 0 0;
		font-size: 0.96rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-muted-text);
	}

	.settings-link {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 34px;
		padding: 0 12px;
		border: 1px solid color-mix(in srgb, var(--color-info) 24%, var(--color-border));
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-info) 8%, var(--color-surface));
		color: var(--color-muted-text);
		font-size: 0.86rem;
		font-weight: 600;
		line-height: 1;
		text-decoration: none;
		box-shadow: 0 4px 14px var(--color-shadow);
	}

	.settings-link:hover {
		color: var(--color-text);
	}

	.inline-settings-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 38px;
		margin-top: 14px;
		padding: 0 14px;
		border: 1px solid color-mix(in srgb, var(--color-warm-accent) 36%, var(--color-border));
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-warm-accent) 18%, var(--color-surface));
		color: var(--color-text);
		font-size: 0.9rem;
		font-weight: 650;
		line-height: 1;
		text-decoration: none;
	}

	.card {
		width: 100%;
		max-width: 420px;
		padding: 18px;
		border: 1px solid var(--color-border);
		border-radius: 24px;
		background: var(--color-surface);
		box-shadow: 0 8px 24px var(--color-shadow);
	}

	.remaining-card,
	.quiet-card,
	.reference-card,
	.about-card {
		box-shadow: none;
	}

	.weight-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding: 14px 16px;
		background: color-mix(in srgb, var(--color-warm-accent) 8%, var(--color-surface));
		border-color: color-mix(in srgb, var(--color-warm-accent) 24%, var(--color-border));
		box-shadow: none;
	}

	.weight-copy {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.weight-helper {
		margin: 0;
		font-size: 0.84rem;
		font-weight: 400;
		line-height: 1.35;
		color: var(--color-muted-text);
	}

	.remaining-card {
		padding: 16px 18px;
		background: color-mix(in srgb, var(--color-success) 20%, var(--color-surface));
		border-color: color-mix(in srgb, var(--color-success) 34%, var(--color-border));
	}

	.quiet-card {
		background: color-mix(in srgb, var(--color-info) 8%, var(--color-muted-surface));
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
		color: var(--color-text);
	}

	.remaining-value {
		margin: 8px 0 0;
		font-size: 1.45rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.015em;
		color: var(--color-text);
	}

	.secondary-value {
		margin: 10px 0 0;
		font-size: 1.4rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.015em;
		color: var(--color-text);
	}

	.estimate-metadata {
		margin: 8px 0 0;
		font-size: 0.85rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-muted-text);
		overflow-wrap: anywhere;
	}

	.body-text {
		margin: 10px 0 0;
		font-size: 0.9rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-muted-text);
	}

	.message-list {
		margin: 12px 0 0;
		padding-left: 20px;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-muted-text);
	}

	.suggestions {
		display: grid;
		gap: 0;
		margin-top: 12px;
		border-top: 1px solid var(--color-border);
	}

	.suggestion {
		padding: 14px 0;
		border-bottom: 1px solid var(--color-border);
	}

	.suggestion-value {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--color-text);
	}

	.other-options {
		margin-top: 12px;
	}

	.other-options > summary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: auto;
		padding: 0;
		font-size: 0.9rem;
		font-weight: 600;
		line-height: 1.4;
		color: var(--color-muted-text);
		cursor: pointer;
		list-style: none;
	}

	.other-options > summary::-webkit-details-marker {
		display: none;
	}

	.other-options > summary::after {
		content: '⌄';
		font-size: 0.95rem;
		font-weight: 400;
		color: var(--color-muted-text);
		transition: transform 0.15s ease;
	}

	.other-options[open] > summary::after {
		transform: rotate(180deg);
	}

	.other-suggestions {
		margin-top: 10px;
		border-top: 1px solid var(--color-border);
	}

	.secondary-suggestion .suggestion-value {
		font-size: 1.05rem;
	}

	.about-card {
		padding: 0;
		overflow: hidden;
		background: var(--color-surface);
	}

	.about-card > summary {
		min-height: 58px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 0 18px;
		font-size: 1rem;
		font-weight: 650;
		line-height: 1.3;
		color: var(--color-text);
		cursor: pointer;
		list-style: none;
	}

	.about-card > summary::-webkit-details-marker {
		display: none;
	}

	.about-card > summary::after {
		content: '⌄';
		font-size: 1.1rem;
		font-weight: 400;
		color: var(--color-muted-text);
		transition: transform 0.15s ease;
	}

	.about-card[open] > summary::after {
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
		color: var(--color-muted-text);
	}

	.about-content p + p {
		margin-top: 10px;
	}

	@media (max-width: 389px) {
		.weight-card {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>