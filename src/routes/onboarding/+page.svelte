<script>
	import SetupForm from '$lib/components/SetupForm.svelte';
	import { setup, saveSetupForm } from '$lib/stores/setupStore.js';

	/**
	 * @param {import('$lib/data/setupDefaults.js').FeedCountSetup} nextSetup
	 * @param {import('$lib/data/setupDefaults.js').FeedCountSetup} baseline
	 */
	function finishSetup(nextSetup, baseline) {
		// The save boundary also handles setup completed elsewhere. The layout opens Home.
		return saveSetupForm(nextSetup, baseline, { onboarding: true });
	}
</script>

<svelte:head>
	<title>Set up FeedCount</title>
	<meta
		name="description"
		content="Set up your baby’s details and usual prepared formula bottle sizes."
	/>
</svelte:head>

<main class="onboarding-page">
	<SetupForm setup={$setup} onSave={finishSetup} onboarding />
</main>

<style>
	.onboarding-page {
		min-height: 100vh;
		width: 100%;
		padding: 24px var(--space-page-x) 32px;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		background: var(--color-page-bg);
	}
</style>
