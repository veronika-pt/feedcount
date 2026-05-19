<script>
	import { onMount } from 'svelte';
	import SetupForm from '$lib/components/SetupForm.svelte';
	import DailyInput from '$lib/components/DailyInput.svelte';
	import { initialiseSetup, setup, updateSetup } from '$lib/stores/setupStore.js';
	import { getDailyEnergyTarget } from '$lib/calculations/dailyEnergyTarget.js';
	import { getDailyFormulaTargetMl } from '$lib/calculations/dailyFormulaTarget.js';
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
			: Math.max(0, dailyFormulaTargetMl - dailyInputState.dailyInput.formulaConsumedMl)
	);

	onMount(() => {
		initialiseSetup();
		dailyInputState.load();
	});
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
				<p class="result-note">
					Based on today’s total formula intake entered below.
				</p>
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
</style>