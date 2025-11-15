<div id="header" class="header" class:visible={isVisible}>
	<div class="header-title">
		<span class="header-monogram">
			<MonogramSvg />
		</span>
		<button type="button" class="header-title-button" on:click={handleTitleClick}>{profile.siteName}</button>
	</div>
		<div class="header-nav">
			{#each headerNavItems as item, index}
				<button
					type="button"
					id={item.id}
					class={item.id}
					class:focus={currentNavTarget === item.target}
					on:click={() => handleHeaderNavClick(item.target)}
				>
					{item.label}
				</button>
			{/each}
		</div>
</div>
<!--#header-->

<script>
	import { onMount } from 'svelte';
	import HeaderLinks from './HeaderLinks.svelte';
	import MonogramSvg from './MonogramSvg.svelte';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';
	import { Navigation } from '../utils/navigation.js';
	import navConfig from '../config/nav.json';
	import profileConfig from '../config/profile.json';

	// Get profile info from config
	const profile = profileConfig;

	// Visibility state for header
	let isVisible = false;

	// Filter navigation items to only include internal items
	// Sort so CTA items come first, then map to the format needed for the header
	const headerNavItems = navConfig.navigation
		.filter(item => item.type === 'internal' && item.target)
		.sort((a, b) => {
			// CTA items come first
			if (a.cta && !b.cta) return -1;
			if (!a.cta && b.cta) return 1;
			return 0; // Maintain original order for non-CTA items
		})
		.map(item => ({
			id: `headerNavButton-${item.id}`,
			target: item.target,
			label: item.label
		}));

	// Extract the store for reactive access
	const currentNavTargetStore = stores.navigation.currentNavTarget;
	$: currentNavTarget = $currentNavTargetStore;

	function handleHeaderNavClick(target) {
		// Update the current nav target
		stores.navigation.currentNavTarget.set(target);

		// Hide irrelevant portfolio sections using the new nav-based filtering
		Navigation.filterPortfolioSectionsByNavTarget(target);

		// Scroll to first visible portfolio section
		setTimeout(() => {
			const allPortfolioSections = document.querySelectorAll('.portfolioSection');
			for (const portfolioSection of allPortfolioSections) {
				const style = window.getComputedStyle(portfolioSection);
				if (style.display !== 'none' && style.visibility !== 'hidden') {
					portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
					break;
				}
			}
		}, 100);
	}

	function handleTitleClick() {
		const splashscreen = document.querySelector('#splashscreen');
		if (splashscreen) splashscreen.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		const cleanup = DOM.setupSplashscreenVisibilityObserver((visible) => {
			isVisible = visible;
		});

		return cleanup;
	});
</script>

<style>


	.header {
		--header-height: 66px;
		--header-background-color: oklch(0.1776 0 0);
		--header-border-color: #2E2E2E;
		--header-primary-color: #FFFFFF;
		--header-accent-color: #60BF60;


		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: left;
		
		position: fixed;
		top: 0;
		height: var(--header-height);
		width: 100%;
		color: white;
		background-color: var(--header-background-color);
		z-index: 100;
		transform: translateY(-100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
		border-bottom: 1px solid var(--header-border-color);
	}

	.header.visible {
		transform: translateY(0);
		pointer-events: auto;
	}

	.header-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		gap: 12px;

		border-right: 1px solid var(--header-border-color);
		height: 100%;
		padding-left: 38px;
		padding-right: 38px;

		font-family: 'M PLUS Rounded 1c';
		font-size: 27px;
		font-weight: 400;
		letter-spacing: 0.05em;
	}

	.header-monogram {
		color: #60BF60;
		display: inline-block;
	}

	.header-monogram :global(svg) {
		height: 1em;
		width: auto;
		height: 100%;
		display: block;
	}

	.header-title-button {
		color: var(--shadeWhite);
		font-size: 1em;
		font-family: 'M PLUS Rounded 1c';
		letter-spacing: 0.05em;
		font-weight: 400;
		text-transform: lowercase;

	}

	.header-nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		color: var(--shade3);
		gap: 10px;
		height: 100%;
		padding-left: 10px;

	}

	.header-nav button {
		font-family: 'M PLUS Rounded 1c';
		font-size: 24px;
		font-weight: 300;
		text-transform: lowercase;
		color: var(--shade3);
		padding: 5px 20px;
		border-radius: 16px;
		border: 1px solid transparent;
	}

	.header-nav button:hover {
		color: var(--header-primary-color);
		border: 1px solid var(--header-primary-color);
	}
	.header-nav button.focus {
		color: var(--header-primary-color);
	
	}
</style>
