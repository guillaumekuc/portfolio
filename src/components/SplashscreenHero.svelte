<div id="splashscreen-hero" class="splashscreen-hero">
	<div bind:this={logoElement} class="splashscreen-logo">
		<EmblemSvg />
	</div>

	<div bind:this={titleElement} class="splashscreen-hero-title">
		<TitleSvg />
	</div>

	<h2 bind:this={headlineElement} id="splashscreen-hero-headline" class="splashscreen-hero-headline">{heroContent.headline}</h2>

	<div bind:this={socialsElement} class="splashscreen-hero-socials">
		{#each enabledSocials as social, index}
			<a
				href={social.url}
				target="_blank"
				rel="noopener noreferrer"
				class="social-link"
				aria-label={social.name}
			>
				<SocialIcon iconPath={social.icon} />
			</a>
		{/each}
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import heroContent from '../config/profile.json';
	import socialsData from '../config/socials.json';
	import TitleSvg from './TitleSvg.svelte';
	import EmblemSvg from './EmblemSvg.svelte';
	import SocialIcon from './SocialIcon.svelte';

	let logoElement;
	let titleElement;
	let headlineElement;
	let socialsElement;
	let hasAnimated = false;

	// Filter enabled socials for cleaner iteration
	$: enabledSocials = socialsData.socials.filter(social => !social.disabled);

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
		if (socialsElement) {
			// Animate the container first
			socialsElement.style.transition = 'opacity 0.3s ease-out 0.75s';
			socialsElement.style.opacity = '100%';
			
			// Then animate individual icons with staggered delays
			const socialLinks = socialsElement.querySelectorAll('.social-link');
			socialLinks.forEach((link, index) => {
				const delay = 0.75 + index * 0.1;
				link.style.transition = `opacity 0.5s ease-out ${delay}s, transform 0.2s ease`;
				link.style.opacity = '100%';
			});
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
		color: var(--splashscreen-hero-text-primary);
		opacity: 0;
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
        --splashscreen-hero-text-font-family: 'M PLUS Rounded 1c';


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
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		
	}

	.splashscreen-hero-headline {
        opacity: 0;
        font-family: var(--splashscreen-hero-text-font-family);
        font-size: var(--splashscreen-hero-text-font-size);
        font-weight: 700;
        letter-spacing: 0.1em;
        color: var(--splashscreen-hero-text-primary);
		margin-bottom: 0px;
	}

	.splashscreen-hero-socials {
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
		color: var(--splashscreen-hero-text-primary);
	}

	.splashscreen-hero-socials .social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		opacity: 0;
		transition: opacity 0.5s ease-out, transform 0.2s ease;
		color: inherit;
	}

	.splashscreen-hero-socials .social-link:hover {
		transform: scale(1.1);
	}
</style>

