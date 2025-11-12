<div id="splashscreen-hero" class="splashscreen-hero">
	<div bind:this={logoElement} class="splashscreen-logo">
		<EmblemSvg />
	</div>

	<div bind:this={titleElement} class="splashscreen-hero-title">
		<TitleSvg />
	</div>

	<h2 bind:this={headlineElement} id="splashscreen-hero-headline" class="splashscreen-hero-headline">{heroContent.headline}</h2>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import heroContent from '../config/splashscreen-hero.json';
	import TitleSvg from './TitleSvg.svelte';
	import EmblemSvg from './EmblemSvg.svelte';

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
    @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap');

	.splashscreen-logo {
		color: var(--splashscreen-hero-text-primary);
		opacity: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.splashscreen-hero {
		--splashscreen-hero-gap: 12px;
        --splashscreen-hero-text-primary: #FFF;
        --splashscreen-hero-text-accent: #60BF60;
        --splashscreen-hero-text-outline: #FFF;
        --splashscreen-hero-text-font-size: 27px;


		position: absolute;
		z-index: 1;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--splashscreen-hero-gap);
	}



	.splashscreen-hero-emblem {
		width: 304px;
		height: auto;
	}

	.splashscreen-hero-title {
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
        color: var(--splashscreen-hero-text-accent);
	}

	.splashscreen-hero-headline {
        opacity: 0;
        font-family: 'M PLUS Rounded 1c';
        font-size: var(--splashscreen-hero-text-font-size);
        font-weight: bold;
        letter-spacing: 0.1em;
        color: var(--splashscreen-hero-text-primary);
	}
</style>

