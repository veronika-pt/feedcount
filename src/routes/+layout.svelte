<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
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
