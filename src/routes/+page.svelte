<script>
	const appName = 'FeedCount';
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

		<button type="button">Start setup</button>
	</section>
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
		background: #f5f5f7;
		color: #1d1d1f;
	}

	.page {
		min-height: 100vh;
		padding: 24px 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card {
		width: 100%;
		max-width: 420px;
		padding: 24px;
		border-radius: 28px;
		background: #ffffff;
		box-shadow: 0 16px 40px rgb(0 0 0 / 0.08);
	}

	.eyebrow {
		margin: 0 0 8px;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #6e6e73;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.2rem, 10vw, 3.2rem);
		letter-spacing: -0.06em;
	}

	.intro {
		margin: 16px 0 0;
		font-size: 1.05rem;
		line-height: 1.5;
		color: #424245;
	}

	.note {
		margin: 20px 0 0;
		font-size: 0.95rem;
		line-height: 1.4;
		color: #6e6e73;
	}

	button {
		width: 100%;
		min-height: 52px;
		margin-top: 28px;
		border: 0;
		border-radius: 999px;
		background: #1d1d1f;
		color: #ffffff;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}

	button:active {
		transform: scale(0.99);
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			background: #000000;
			color: #f5f5f7;
		}

		.card {
			background: #1c1c1e;
			box-shadow: none;
		}

		.intro {
			color: #d1d1d6;
		}

		.note,
		.eyebrow {
			color: #a1a1a6;
		}

		button {
			background: #f5f5f7;
			color: #1d1d1f;
		}
	}
</style>