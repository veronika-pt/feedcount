<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { base, resolve } from '$app/paths';
	import { initialiseSetup, setup } from '$lib/stores/setupStore.js';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let ready = $state(false);
	const isOnboarding = $derived(page.route.id === '/onboarding');
	const canRenderPage = $derived(ready && isOnboarding !== $setup.onboardingCompleted);

	onMount(() => {
		initialiseSetup();
		ready = true;
	});

	$effect(() => {
		if (!ready) return;
		if (!$setup.onboardingCompleted && !isOnboarding) {
			void goto(resolve('/onboarding'), { replaceState: true });
		} else if ($setup.onboardingCompleted && isOnboarding) {
			void goto(resolve('/'), { replaceState: true });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" sizes="180x180" href={`${base}/apple-touch-icon.png`} />
	<link rel="manifest" href={`${base}/manifest.webmanifest`} />
	<meta name="theme-color" content="#f7f1e8" />
	<meta name="theme-color" content="#101716" media="(prefers-color-scheme: dark)" />
</svelte:head>

{#if canRenderPage}
	{@render children()}
{:else}
	<p class="loading" role="status">Loading FeedCount…</p>
{/if}

<style>
	.loading {
		margin: 24px var(--space-page-x);
		text-align: center;
		color: var(--color-muted-text);
	}
</style>
