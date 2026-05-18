<script>
	import { onMount } from 'svelte';
	import SetupForm from '$lib/components/SetupForm.svelte';
	import { initialiseSetup, setup, updateSetup } from '$lib/stores/setupStore.js';

	const appName = 'FeedCount';

	onMount(() => {
		initialiseSetup();
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
	</section>

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
</style>