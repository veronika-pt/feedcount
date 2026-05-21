<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SetupForm from '$lib/components/SetupForm.svelte';
	import { initialiseSetup, setup, updateSetup } from '$lib/stores/setupStore.js';

	onMount(() => {
		initialiseSetup();
	});

	function goHome() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Settings · FeedCount</title>
	<meta
		name="description"
		content="FeedCount setup details for daily formula estimates."
	/>
</svelte:head>

<main class="settings-page">
	<button class="back-button" type="button" onclick={goHome}>
		← Back
	</button>

	<section class="settings-header">
		<p class="eyebrow">Settings</p>
		<h1>Baby profile</h1>
		<p>
			Update the details FeedCount uses for daily formula estimates.
		</p>
	</section>

	<SetupForm setup={$setup} onSave={updateSetup} />
</main>

<style>
	.settings-page {
		min-height: 100vh;
		width: 100%;
		padding: 24px var(--space-page-x) 36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		background: color-mix(in srgb, var(--color-page-bg) 76%, white 24%);
	}

	.back-button,
	.settings-header {
		width: 100%;
		max-width: 420px;
	}

	.back-button {
		min-height: 38px;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--color-text-secondary);
		font: inherit;
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1;
		text-align: left;
		cursor: pointer;
	}

	.back-button:hover {
		color: var(--color-text-primary);
	}

	.settings-header {
		padding: 4px 2px 8px;
	}

	.eyebrow {
		margin: 0 0 8px;
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 8vw, 2.5rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.05em;
		color: var(--color-text-primary);
	}

	.settings-header p:not(.eyebrow) {
		margin: 12px 0 0;
		font-size: 0.96rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-text-secondary);
	}
</style>