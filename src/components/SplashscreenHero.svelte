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
	.splashscreen-hero {
		/* Static values */
		--splashscreen-hero-text-primary: var(--color-white);
		--splashscreen-hero-text-accent: var(--color-accent);
		--splashscreen-hero-text-outline: var(--color-white);
		--splashscreen-hero-text-font-family: var(--ffRounded);

		/* Responsive values */
		--splashscreen-hero-gap: 12px;
		--splashscreen-hero-text-font-size: 27px;
		--splashscreen-hero-logo-size: 304px;
		--splashscreen-hero-title-size: 304px;
		--splashscreen-hero-title-margin: 0.5rem;
		--splashscreen-hero-socials-gap: 16px;
		--splashscreen-hero-social-icon-size: 32px;

		/* Nav bar height calculation (matching SplashNav.svelte structure) */
		--splashscreen-nav-padding: 10px;
		--splashscreen-nav-icon-size: 32px;
		--splashscreen-nav-font-size: 24px;
		--splashscreen-nav-link-padding-vertical: 5px;
		--splashscreen-nav-bottom: 16px;
		--splashscreen-nav-total-height: calc(
			var(--splashscreen-nav-padding) * 2 +
			var(--splashscreen-nav-icon-size) +
			var(--splashscreen-nav-font-size) +
			var(--splashscreen-nav-link-padding-vertical) * 2
		);

		position: absolute;
		z-index: 1;
		top: 0;
		bottom: calc(var(--splashscreen-nav-bottom) + var(--splashscreen-nav-total-height));
		left: 0;
		right: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--splashscreen-hero-gap);

		animation: breathe 6s ease-in-out infinite;
		pointer-events: none;
	}

	.splashscreen-logo {
		width: var(--splashscreen-hero-logo-size);
		height: auto;
		color: var(--splashscreen-hero-text-primary);
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.splashscreen-hero-title {
		width: var(--splashscreen-hero-title-size);
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--splashscreen-hero-text-accent);
		margin-top: var(--splashscreen-hero-title-margin);
	}

	.splashscreen-hero-headline {
		opacity: 0;
		font-family: var(--splashscreen-hero-text-font-family);
		font-size: var(--splashscreen-hero-text-font-size);
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--splashscreen-hero-text-primary);
		margin-bottom: 0px;
	}

	.splashscreen-hero-socials {
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--splashscreen-hero-socials-gap);
		flex-wrap: wrap;
		color: var(--splashscreen-hero-text-primary);
	}

	.splashscreen-hero-socials .social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--splashscreen-hero-social-icon-size);
		height: var(--splashscreen-hero-social-icon-size);
		opacity: 0;
		transition: opacity 0.5s ease-out, transform 0.2s ease;
		color: inherit;
		pointer-events: auto;
	}

	.splashscreen-hero-socials .social-link:hover {
		transform: scale(1.1);
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.splashscreen-hero {
			--splashscreen-hero-gap: 10px;
			--splashscreen-hero-text-font-size: 24px;
			--splashscreen-hero-logo-size: 260px;
			--splashscreen-hero-title-size: 270px;
			--splashscreen-hero-title-margin: 0.4rem;
			--splashscreen-hero-social-icon-size: 28px;
			--splashscreen-nav-padding: 8px;
			--splashscreen-nav-icon-size: 28px;
			--splashscreen-nav-font-size: 20px;
			--splashscreen-nav-link-padding-vertical: 4px;
			--splashscreen-nav-bottom: 14px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.splashscreen-hero {
			--splashscreen-hero-gap: 6px;
			--splashscreen-hero-text-font-size: 20px;
			--splashscreen-hero-logo-size: 200px;
			--splashscreen-hero-title-size: 225px;
			--splashscreen-hero-title-margin: 0.25rem;
			--splashscreen-hero-socials-gap: 12px;
			--splashscreen-hero-social-icon-size: 26px;
			--splashscreen-nav-padding: 6px;
			--splashscreen-nav-icon-size: 0px;
			--splashscreen-nav-font-size: 16px;
			--splashscreen-nav-link-padding-vertical: 4px;
			--splashscreen-nav-bottom: 12px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.splashscreen-hero {
			--splashscreen-hero-gap: 4px;
			--splashscreen-hero-text-font-size: 16px;
			--splashscreen-hero-logo-size: 100px;
			--splashscreen-hero-title-size: 180px;
			--splashscreen-hero-title-margin: 0.15rem;
			--splashscreen-hero-socials-gap: 10px;
			--splashscreen-hero-social-icon-size: 22px;
			--splashscreen-nav-padding: 4px;
			--splashscreen-nav-icon-size: 0px;
			--splashscreen-nav-font-size: 12px;
			--splashscreen-nav-link-padding-vertical: 3px;
			--splashscreen-nav-bottom: 8px;
		}
	}

	@keyframes breathe {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

</style>

