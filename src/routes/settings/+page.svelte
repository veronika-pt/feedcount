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
		content="FeedCount settings for baby profile, feeding details, and daily formula estimates."
	/>
</svelte:head>

<main class="settings-page">
	<button class="back-button" type="button" onclick={goHome}>
		← Back
	</button>

	<section class="settings-header">
		<h1>FeedCount settings</h1>
		<p>Update the profile and feeding details used for daily formula estimates.</p>
	</section>

	<SetupForm setup={$setup} onSave={updateSetup} />
</main>

<style>
	.settings-page {
		min-height: 100vh;
		width: 100%;
		padding: 18px var(--space-page-x) 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		background: var(--color-page-bg);
	}

	.back-button,
	.settings-header {
		width: 100%;
		max-width: 420px;
	}

	.back-button {
		min-height: 34px;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--color-text-muted);
		font: inherit;
		font-size: 0.9rem;
		font-weight: 550;
		line-height: 1;
		text-align: left;
		cursor: pointer;
	}

	.back-button:hover {
		color: var(--color-text-primary);
	}

	.settings-header {
		padding: 4px 2px 10px;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.55rem, 6vw, 1.85rem);
		font-weight: 650;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
	}

	.settings-header p {
		max-width: 34rem;
		margin: 8px 0 0;
		font-size: 0.92rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-text-muted);
	}
</style>