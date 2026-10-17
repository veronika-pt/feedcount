<script>
	import { base, resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
	<title>FeedCount — A little less maths at feeding time</title>
	<meta
		name="description"
		content="Formula planning for exclusively formula-fed babies under 12 months. Understand the calculation, estimate what’s left today, and explore bottle options. No account needed."
	/>
</svelte:head>

<div class="landing">
	<a class="skip-link" href="#main">Skip to content</a>
	<header class="site-header wrap">
		<a class="brand" href={resolve('/')} aria-label="FeedCount home"
			><img src={favicon} alt="" width="38" height="38" />FeedCount</a
		>
		<nav aria-label="Main navigation">
			<a class="how-link" href="#calculation">The calculation</a>
			<a class="nav-cta" href={resolve('/app')}>Open app <span aria-hidden="true">↗</span></a>
		</nav>
	</header>

	<main id="main" tabindex="-1">
		<section class="hero wrap" aria-labelledby="hero-title">
			<div class="hero-copy">
				<p class="age-label">FOR BABIES UNDER 12 MONTHS</p>
				<h1 id="hero-title">
					How much formula?<br /><em
						>Age is only part<br class="desktop-break" /> of the picture.</em
					>
				</h1>
				<p class="feeding-scope">
					For babies under 12 months who are fed exclusively on formula, without breast milk or
					solid foods.
				</p>
				<p class="lead">
					Your baby’s weight, age and sex, plus the calories in their formula, can all inform a
					daily estimate.
				</p>
				<p class="context">
					Guides on formula packaging can take different factors into account. FeedCount offers an
					approximate planning reference, not your baby’s exact feeding requirement.
				</p>
				<a class="text-link" href="#calculation">Let’s look at the maths</a>
			</div>
			<figure class="hero-visual">
				<div class="main-screenshot">
					<img
						src={`${base}/images/landing/feedcount-main.png`}
						alt="FeedCount example showing 240 ml consumed, four feeds left, an estimated remainder and a suggested bottle split."
						width="856"
						height="2594"
						fetchpriority="high"
					/>
				</div>
				<figcaption>Planning estimates. Not medical targets.</figcaption>
			</figure>
		</section>

		<section id="calculation" class="calculation-section" aria-labelledby="calculation-title">
			<div class="wrap">
				<div class="section-intro">
					<p class="eyebrow">01 / THE CALCULATION</p>
					<h2 id="calculation-title">A little maths.<br /><em>A daily reference.</em></h2>
					<p>
						The calculation turns estimated daily energy needs into a volume of prepared formula.
					</p>
				</div>
				<div
					class="equation"
					aria-label="Estimated daily formula in millilitres approximately equals weight in kilograms times energy factor, divided by formula calories per 100 millilitres, times 100."
				>
					<div class="equation-result">
						<span>Estimated daily formula</span><small>ml / day</small>
					</div>
					<span class="operator" aria-hidden="true">≈</span>
					<div class="fraction">
						<div class="numerator">Weight <span aria-hidden="true">×</span> Energy factor</div>
						<div class="denominator">Formula calories per 100 ml</div>
					</div>
					<span class="multiplier" aria-hidden="true">× 100</span>
				</div>
				<dl class="formula-key">
					<div>
						<dt><span>01</span> Weight</dt>
						<dd>Your baby’s current weight in kilograms.</dd>
					</div>
					<div>
						<dt><span>02</span> Energy factor</dt>
						<dd>
							A reference value for age and sex, in kcal/kg/day, from <a
								href="https://www.fao.org/4/y5686e/y5686e05.htm">FAO/WHO/UNU Table 3.3</a
							>.
						</dd>
					</div>
					<div>
						<dt><span>03</span> Formula calories</dt>
						<dd>
							The kcal per 100 ml of <strong>prepared formula</strong>, listed on the packaging.
						</dd>
					</div>
				</dl>
				<p class="calculation-note">
					This estimate assumes energy comes from formula. It does not subtract breast milk or solid
					foods, so it is not a required milk intake when other foods are part of your baby’s diet.
				</p>
			</div>
		</section>

		<section class="app-section wrap" aria-labelledby="app-title">
			<div class="app-intro">
				<div>
					<p class="eyebrow">02 / LET FEEDCOUNT DO IT</p>
					<h2 id="app-title">Simple maths.<br /><em>One less thing to do.</em></h2>
				</div>
				<div class="app-intro-copy">
					<p>
						You can work it out yourself. Or save your baby’s details in FeedCount and let the app
						handle the recalculations.
					</p>
					<a class="button" href={resolve('/app')}
						>Open FeedCount <span aria-hidden="true">↗</span></a
					>
					<p class="button-note">No account needed. Works in your browser.</p>
				</div>
			</div>
			<div class="walkthrough">
				<article class="walkthrough-step setup-step">
					<div class="step-copy">
						<span class="step-number">1</span>
						<h3>Make it yours.</h3>
						<p>Save your baby’s details and the calories in their prepared formula.</p>
					</div>
					<div class="screenshot-window setup-window">
						<img
							src={`${base}/images/landing/feedcount-setup.png`}
							alt="FeedCount settings with baby details, formula calories and saved bottle sizes."
							width="1284"
							height="2778"
							loading="lazy"
						/>
					</div>
				</article>
				<article class="walkthrough-step bottles-step">
					<div class="step-copy">
						<span class="step-number">2</span>
						<h3>Add your bottle sizes.</h3>
						<p>
							Save the prepared volumes you usually offer, so FeedCount can suggest practical
							combinations.
						</p>
					</div>
					<div class="screenshot-window bottles-window">
						<img
							src={`${base}/images/landing/feedcount-bottle-sizes.png`}
							alt="FeedCount settings showing formula calories and saved prepared bottle sizes."
							width="1284"
							height="2778"
							loading="lazy"
						/>
					</div>
				</article>
				<article class="walkthrough-step daily-step">
					<div class="step-copy">
						<span class="step-number">3</span>
						<h3>Plan the rest of today.</h3>
						<p>
							Enter the total already consumed and feeds left. See the estimated remainder and
							possible bottle combinations.
						</p>
					</div>
					<div class="screenshot-window daily-window">
						<img
							src={`${base}/images/landing/feedcount-bottle-split.png`}
							alt="FeedCount example with four feeds left, a 939 ml estimated remainder and two possible bottle combinations."
							width="1284"
							height="2778"
							loading="lazy"
						/>
					</div>
				</article>
			</div>
			<p class="example-note">Screenshots show example entries, not recommended feeding amounts.</p>
		</section>

		<section class="details-section wrap" aria-labelledby="details-title">
			<div>
				<p class="eyebrow">A FEW THINGS TO KNOW</p>
				<h2 id="details-title">A useful reference.<br /><em>With clear limits.</em></h2>
			</div>
			<div class="questions">
				<details>
					<summary>Is this an exact feeding recommendation?</summary>
					<p>
						No. FeedCount uses reference energy values to give a rough planning estimate for babies
						under 12 months. It cannot determine your baby’s exact needs and does not replace advice
						from a clinician. The result is not an amount your baby must finish.
					</p>
				</details>
				<details>
					<summary>What if my baby has breast milk or solids too?</summary>
					<p>
						The calculation converts the full estimated daily energy need into formula volume. It
						does not subtract energy from breast milk or complementary foods, so the result is not a
						required formula intake for mixed feeding or a diet that includes solids.
					</p>
				</details>
				<details>
					<summary>Why should I keep my baby’s weight up to date?</summary>
					<p>
						Weight is part of the formula estimate, so remember to update it as your baby grows.
						Enter it during the initial setup, then use the + and − buttons on the main screen to
						adjust it quickly whenever you have a new measurement.
					</p>
				</details>
				<details>
					<summary>Where is my data saved?</summary>
					<p>
						Your setup and today’s entries are saved locally in this browser. There is no account
						and no sync between devices. Clearing browser data may remove your saved information.
					</p>
				</details>
			</div>
		</section>

		<section class="closing wrap" aria-labelledby="closing-title">
			<p class="eyebrow">FOR BABIES UNDER 12 MONTHS</p>
			<h2 id="closing-title">A little less maths<br /><em>at feeding time.</em></h2>
			<a class="button" href={resolve('/app')}>Open FeedCount <span aria-hidden="true">↗</span></a>
			<p class="button-note">Free to use. No sign-up.</p>
		</section>
	</main>
	<footer class="site-footer wrap">
		<a class="brand footer-brand" href={resolve('/')}
			><img src={favicon} alt="" width="28" height="28" />FeedCount</a
		>
		<p>Planning estimates, not medical advice.</p>
		<a href="https://veronika.pt">Made by Veronika Troitskaia <span aria-hidden="true">↗</span></a>
	</footer>
</div>

<style>
	.landing {
		--color-background: #ede3d5;
		--screenshot-outline: #b7a994;
		color: var(--color-text);
		background: var(--color-background);
		font-size: 16px;
		line-height: 1.6;
	}
	.wrap {
		width: min(1120px, calc(100% - 96px));
		margin-inline: auto;
	}
	a {
		color: inherit;
		text-underline-offset: 4px;
	}
	a:focus-visible,
	summary:focus-visible {
		outline: 3px solid var(--color-primary-accent);
		outline-offset: 6px;
	}
	.skip-link {
		position: fixed;
		top: 12px;
		left: 12px;
		transform: translateY(-180%);
		padding: 12px 20px;
		background: var(--color-surface);
		z-index: 10;
	}
	.skip-link:focus {
		transform: translateY(0);
	}
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: 24px;
	}
	.brand {
		display: inline-flex;
		gap: 9px;
		align-items: center;
		font-size: 22px;
		font-weight: 650;
		letter-spacing: -0.02em;
		text-decoration: none;
	}
	nav {
		display: flex;
		align-items: center;
		gap: 30px;
		font-size: 14px;
	}
	nav a {
		text-decoration: none;
	}
	.nav-cta {
		border: 1px solid color-mix(in srgb, var(--color-info) 24%, var(--color-border));
		border-radius: 999px;
		padding: 9px 19px;
		background: color-mix(in srgb, var(--color-info) 8%, var(--color-surface));
	}
	.nav-cta span {
		margin-left: 13px;
	}
	.hero {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: 65px;
		align-items: center;
		padding-block: 64px 76px;
	}
	.age-label {
		margin: 0 0 25px;
		color: var(--color-text);
		font-size: 18px;
		font-weight: 650;
		letter-spacing: 0.04em;
	}
	.feeding-scope {
		max-width: 480px;
		margin: 22px 0 0;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.6;
	}
	h1,
	h2 {
		font-family: inherit;
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 1.14;
		margin: 0;
	}
	h1 {
		font-size: clamp(40px, 4vw, 55px);
	}
	h2 {
		font-size: clamp(32px, 3vw, 42px);
	}
	em {
		font: inherit;
	}
	.lead {
		font-size: 19px;
		line-height: 1.6;
		max-width: 480px;
		margin: 26px 0 17px;
	}
	.context {
		color: var(--color-muted-text);
		font-size: 14px;
		line-height: 1.7;
		max-width: 450px;
	}
	.text-link {
		display: inline-block;
		margin-top: 15px;
		font-size: 14px;
		font-weight: 600;
	}
	.hero-visual {
		width: min(360px, 100%);
		margin: 0 auto;
	}
	.main-screenshot {
		aspect-ratio: 856 / 1280;
		overflow: hidden;
		border-radius: 16px;
		outline: 1px solid var(--screenshot-outline);
	}
	.main-screenshot img {
		display: block;
		width: 100%;
		height: auto;
		margin-top: -40px;
	}
	figcaption {
		text-align: center;
		font-size: 12px;
		margin-top: 13px;
		color: var(--color-muted-text);
	}
	.calculation-section {
		padding-block: 60px 50px;
		scroll-margin-top: 24px;
	}
	.section-intro {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 85px;
		align-items: end;
	}
	.eyebrow {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		margin: 0 0 20px;
		color: var(--color-muted-text);
	}
	.section-intro .eyebrow {
		grid-column: 1 / -1;
	}
	.section-intro > p:last-child {
		max-width: 355px;
		color: var(--color-muted-text);
		margin: 0 0 3px;
	}
	.equation {
		margin-top: 35px;
		display: flex;
		justify-content: center;
		gap: 27px;
		align-items: center;
		background: var(--color-surface);
		padding: 36px 25px;
		border: 1px solid var(--color-border);
		border-radius: 24px;
	}
	.equation-result {
		font-size: 23px;
		font-weight: 600;
		line-height: 1.3;
	}
	.equation-result small {
		display: block;
		font-size: 12px;
		font-weight: 400;
		color: var(--color-muted-text);
		margin-top: 7px;
	}
	.operator {
		font-size: 31px;
		color: var(--color-muted-text);
	}
	.fraction {
		font-size: 20px;
		text-align: center;
	}
	.numerator {
		padding: 0 15px 12px;
		border-bottom: 1px solid var(--color-text);
	}
	.numerator span {
		padding-inline: 12px;
	}
	.denominator {
		padding: 12px 10px 0;
	}
	.multiplier {
		font-size: 23px;
		white-space: nowrap;
	}
	.formula-key {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 35px;
		margin-block: 28px 24px;
	}
	dt {
		font-size: 14px;
		font-weight: 650;
	}
	dt span {
		font-size: 11px;
		color: var(--color-muted-text);
		margin-right: 8px;
	}
	dd {
		margin: 8px 0 0;
		color: var(--color-muted-text);
		font-size: 14px;
		line-height: 1.7;
	}
	dd strong {
		font-weight: 600;
	}
	.calculation-note {
		margin: 0;
		padding-top: 20px;
		color: var(--color-muted-text);
		font-size: 13px;
	}
	.app-section {
		padding-block: 65px;
	}
	.app-intro {
		margin-bottom: 45px;
	}
	.app-intro-copy {
		margin-top: 24px;
		max-width: 620px;
	}
	.app-intro-copy > p:first-child {
		margin: 0 0 23px;
		color: var(--color-muted-text);
	}
	.button {
		display: inline-flex;
		align-items: center;
		gap: 40px;
		justify-content: space-between;
		padding: 14px 23px;
		border-radius: 999px;
		background: var(--color-button-bg);
		color: var(--color-button-text);
		font-size: 14px;
		font-weight: 650;
		text-decoration: none;
	}
	.button:hover {
		background: color-mix(in srgb, var(--color-button-bg) 88%, var(--color-text));
	}
	.button-note {
		font-size: 12px;
		color: var(--color-muted-text);
		margin: 10px 0 0;
	}
	.walkthrough {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 32px;
	}
	.walkthrough-step {
		min-width: 0;
	}
	.step-copy {
		position: relative;
		padding-left: 43px;
		margin-bottom: 28px;
		min-height: 112px;
	}
	.step-number {
		position: absolute;
		left: 0;
		top: 0;
		border: 1px solid var(--color-border);
		border-radius: 50%;
		width: 27px;
		height: 27px;
		display: grid;
		place-items: center;
		font-size: 12px;
	}
	h3 {
		margin: 0 0 9px;
		font-size: 21px;
		font-weight: 650;
		letter-spacing: -0.015em;
	}
	.step-copy p {
		font-size: 14px;
		color: var(--color-muted-text);
		margin: 0;
		max-width: 350px;
	}
	.screenshot-window {
		max-width: 300px;
		aspect-ratio: 1284 / 2520;
		overflow: hidden;
		margin: 0 0 0 43px;
		border-radius: 16px;
		outline: 1px solid var(--screenshot-outline);
	}
	.screenshot-window img {
		width: 100%;
		height: auto;
		display: block;
	}
	.setup-window img {
		margin-top: -50px;
	}
	.bottles-window img {
		margin-top: -55px;
	}
	.daily-window img {
		margin-top: -40px;
	}
	.example-note {
		text-align: center;
		color: var(--color-muted-text);
		font-size: 12px;
		margin: 25px 0 0;
	}
	.details-section {
		padding-block: 55px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 85px;
	}
	.details-section h2 {
		font-size: 34px;
	}
	details {
		border-bottom: 1px solid var(--color-border);
	}
	summary {
		padding: 19px 28px 19px 0;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		list-style: none;
		position: relative;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: '+';
		position: absolute;
		right: 2px;
		font-size: 20px;
		font-weight: 400;
		top: 13px;
		color: var(--color-muted-text);
	}
	details[open] summary::after {
		content: '−';
	}
	details p {
		font-size: 14px;
		color: var(--color-muted-text);
		margin: 0 0 20px;
	}
	.closing {
		text-align: center;
		padding: 48px 24px 60px;
	}
	.closing h2 {
		margin-bottom: 27px;
	}
	.site-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding-block: 24px;
		font-size: 12px;
		color: var(--color-muted-text);
	}
	.footer-brand {
		font-size: 17px;
		color: var(--color-text);
		gap: 4px;
	}
	.site-footer p {
		margin: 0;
	}
	.site-footer > a:last-child {
		text-decoration: none;
	}
	@media (prefers-color-scheme: dark) {
		.landing {
			--color-background: #202f44;
			--color-surface: #2a3b51;
			--color-muted-text: #c0c9d4;
			--color-border: #526278;
			--screenshot-outline: #93a1b4;
		}
	}
	@media (max-width: 1000px) {
		.wrap {
			width: calc(100% - 64px);
		}
		.hero {
			gap: 35px;
		}
		.section-intro,
		.app-intro,
		.details-section {
			gap: 35px;
		}
		.equation {
			gap: 18px;
		}
		.equation-result {
			font-size: 21px;
		}
		.fraction {
			font-size: 17px;
		}
		.walkthrough {
			grid-template-columns: 1fr;
			gap: 35px;
		}
		.walkthrough-step {
			width: min(100%, 430px);
			margin-inline: auto;
		}
	}
	@media (max-width: 700px) {
		.wrap {
			width: calc(100% - 40px);
		}
		.site-header {
			padding-block: 17px;
		}
		.brand {
			font-size: 20px;
			gap: 4px;
		}
		.brand img {
			width: 32px;
			height: 32px;
		}
		nav {
			gap: 0;
			font-size: 12px;
		}
		.how-link {
			display: none;
		}
		.nav-cta {
			padding: 8px 13px;
		}
		.hero {
			grid-template-columns: 1fr;
			padding-block: 37px 45px;
			gap: 35px;
		}
		.age-label {
			font-size: 14px;
			margin-bottom: 21px;
			letter-spacing: 0.025em;
		}
		h1 {
			font-size: clamp(34px, 8.5vw, 46px);
		}
		.desktop-break {
			display: none;
		}
		.lead {
			font-size: 17px;
			margin-top: 22px;
		}
		.context {
			font-size: 14px;
		}
		.calculation-section {
			padding-block: 40px 32px;
		}
		.section-intro,
		.app-intro,
		.details-section {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.section-intro .eyebrow {
			margin-bottom: 0;
		}
		h2 {
			font-size: 32px;
		}
		.section-intro > p:last-child {
			font-size: 15px;
		}
		.equation {
			flex-wrap: wrap;
			gap: 18px 13px;
			margin-top: 26px;
			padding: 24px 15px;
		}
		.equation-result {
			text-align: center;
			flex-basis: 100%;
			font-size: 22px;
		}
		.equation-result small {
			display: inline;
			margin-left: 5px;
		}
		.operator {
			font-size: 25px;
		}
		.fraction {
			font-size: clamp(12px, 3.1vw, 17px);
		}
		.numerator {
			padding: 0 0 9px;
		}
		.numerator span {
			padding-inline: 5px;
		}
		.denominator {
			padding: 9px 0 0;
		}
		.multiplier {
			font-size: 17px;
		}
		.formula-key {
			grid-template-columns: 1fr;
			gap: 19px;
		}
		dd {
			margin-top: 4px;
		}
		.app-section {
			padding-block: 40px 35px;
		}
		.app-intro {
			margin-bottom: 35px;
		}
		.app-intro-copy > p:first-child {
			font-size: 15px;
			margin-bottom: 20px;
		}
		.walkthrough {
			grid-template-columns: 1fr;
			gap: 35px;
		}
		.step-copy {
			margin-bottom: 20px;
			min-height: 0;
		}
		.details-section {
			padding-block: 35px;
			gap: 16px;
		}
		.details-section h2 {
			font-size: 30px;
		}
		.closing {
			padding-block: 35px;
		}
		.closing h2 {
			font-size: 32px;
		}
		.site-footer {
			flex-wrap: wrap;
			gap: 13px;
			padding-block: 20px;
		}
		.site-footer p {
			order: 3;
			flex-basis: 100%;
		}
	}
</style>
