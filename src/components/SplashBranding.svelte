<div id="splashscreen-hero" class="splashscreen-hero">
	<div bind:this={logoElement} class="splashscreen-logo"></div>
	<h1 bind:this={titleElement} id="splashscreen-hero-title" class="splashscreen-hero-title">{heroContent.name}</h1>
	<h2 bind:this={headlineElement} id="splashscreen-hero-headline" class="splashscreen-hero-headline">{heroContent.headline}</h2>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import heroContent from '../config/splashscreen-hero.json';

	let logoElement;
	let titleElement;
	let headlineElement;
	let hasAnimated = false;

	function animateHero() {
		if (logoElement) {
			logoElement.style.transition = 'opacity 1s ease-out 0s';
			logoElement.style.opacity = '100%';
		}
		if (titleElement) {
			titleElement.style.transition = 'opacity 1s ease-out 0.25s';
			titleElement.style.opacity = '100%';
		}
		if (headlineElement) {
			headlineElement.style.transition = 'opacity 1s ease-out 0.5s';
			headlineElement.style.opacity = '100%';
		}
	}

	function handleHeroTrigger() {
		if (!hasAnimated) {
			hasAnimated = true;
			animateHero();
		}
	}

	onMount(() => {
		window.addEventListener('heroAnimate', handleHeroTrigger);
	});

	onDestroy(() => {
		window.removeEventListener('heroAnimate', handleHeroTrigger);
	});
</script>

<style>

	.splashscreen-logo {
		width: 100%;
		height: 450px;
		background-color: red;
		opacity: 0;
	}

	.splashscreen-hero {
		--splashscreen-hero-gap: 12px;
		position: absolute;
		z-index: 1;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--splashscreen-hero-gap);
	}

	.splashscreen-hero-title {
		opacity: 0;
		font-size: 100%;
		font-family: var(--ff1);
		font-weight: 400;
		font-variant: small-caps;
		vertical-align: top;
		margin: 0;
		transition: opacity 1s ease-out 3s;
	}

	.splashscreen-hero-headline {
		opacity: 0;
		font-size: 66.66%;
		line-height: 1;
		margin: 0;
		transition: opacity 1s ease-out 3.25s;
	}
</style>

