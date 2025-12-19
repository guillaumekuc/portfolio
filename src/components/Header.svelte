<div id="header" class="header" class:visible={isVisible}>
	<div class="header-title">
		<button type="button" class="header-monogram-button" on:click={handleTitleClick}>
			<span class="header-monogram">
				<MonogramSvg />
			</span>
		</button>
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
	import { get } from 'svelte/store';
	import MonogramSvg from './MonogramSvg.svelte';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';
	import { Navigation } from '../utils/navigation.js';
	import navConfig from '../config/nav.json';
	import profileConfig from '../config/profile.json';
	import portfolioConfig from '../config/portfolio.json';

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
		// Step 1: Show overlay curtain
		Navigation.showOverlay();
		
		// Step 2: Wait for overlay to fully show, then do all changes behind it
		setTimeout(() => {
			// Update target and filter sections (visual changes hidden by overlay)
			stores.navigation.currentNavTarget.set(target);
			Navigation.filterPortfolioSectionsByNavTarget(target);
			
			// Small delay for DOM to update with filtered sections
			setTimeout(() => {
				const visibility = get(stores.navigation.portfolioSectionVisibility);
				let targetElement = null;
				
				// Find first visible section (including about)
				for (const section of portfolioConfig.portfolioSections) {
					const isVisible = !visibility || visibility.size === 0 
						? true 
						: (visibility.get(section.id) ?? true);
					
					if (isVisible) {
						targetElement = document.getElementById(section.id);
						if (targetElement) break;
					}
				}
				
				// Step 3: Instant scroll (teleport) behind the curtain
				if (targetElement) {
					Navigation.isNavigating = true;
					targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
				}
				
				// Step 4: Remove curtain to reveal final state
				setTimeout(() => {
					Navigation.isNavigating = false;
					Navigation.hideOverlay();
				}, 50);
			}, 50);
		}, 150);
	}

	function handleTitleClick() {
		// Use Navigation.goToHome() which handles scroll-snap properly
		Navigation.goToHome();
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
		/* Interface variables - map global variables to local scope */
		--bp-small-desktop: var(--breakpoint-small-desktop);
		--bp-tablet: var(--breakpoint-tablet);
		--bp-mobile: var(--breakpoint-mobile);

		/* Static values */
		--header-background-color: oklch(0.1776 0 0);
		--header-border-color: #2E2E2E;
		--header-primary-color: #FFFFFF;
		--header-accent-color: var(--accentColor);

		/* Responsive values (height inherits from global --safeMargin) */
		--header-height: var(--safeMargin);
		--header-monogram-size: 55px;
		--header-title-font-size: 27px;
		--header-title-gap: 12px;
		--header-title-padding: 38px;
		--header-nav-font-size: 24px;
		--header-nav-gap: 10px;
		--header-nav-padding: 5px 20px;
		--header-nav-radius: 16px;

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
		gap: var(--header-title-gap);

		border-right: 1px solid var(--header-border-color);
		height: 100%;
		padding-left: var(--header-title-padding);
		padding-right: var(--header-title-padding);

		font-family: 'M PLUS Rounded 1c';
		font-size: var(--header-title-font-size);
		font-weight: 400;
		letter-spacing: 0.05em;
	}

	.header-monogram-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: inline-block;
		height: var(--header-monogram-size);
		width: var(--header-monogram-size);
		transition: transform 0.2s ease;
	}

	.header-monogram-button:hover {
		transform: scale(1.1);
	}

	.header-monogram {
		color: var(--header-accent-color);
		display: inline-block;
		height: 100%;
		width: 100%;
		transition: color 0.2s ease;
	}

	.header-monogram-button:hover .header-monogram {
		color: var(--header-primary-color);
	}

	.header-monogram :global(svg) {
		height: 100%;
		width: auto;
		display: block;
	}

	.header-title-button {
		color: var(--shadeWhite);
		font-size: 1em;
		font-family: 'M PLUS Rounded 1c';
		letter-spacing: 0.05em;
		font-weight: 400;
		text-transform: lowercase;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.header-title-button:hover {
		color: var(--header-accent-color);
	}

	.header-nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		color: var(--shade3);
		gap: var(--header-nav-gap);
		height: 100%;
		padding-left: var(--header-nav-gap);
	}

	.header-nav button {
		font-family: 'M PLUS Rounded 1c';
		font-size: var(--header-nav-font-size);
		font-weight: 300;
		text-transform: lowercase;
		color: var(--shade3);
		padding: var(--header-nav-padding);
		border-radius: var(--header-nav-radius);
		border: 1px solid transparent;
	}

	.header-nav button:hover {
		color: var(--header-primary-color);
		border: 1px solid var(--header-primary-color);
	}

	.header-nav button.focus {
		color: var(--header-primary-color);
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.header {
			--header-monogram-size: 46px;
			--header-title-font-size: 24px;
			--header-title-gap: 10px;
			--header-title-padding: 30px;
			--header-nav-font-size: 20px;
			--header-nav-gap: 8px;
			--header-nav-padding: 4px 16px;
			--header-nav-radius: 14px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.header {
			--header-monogram-size: 36px;
			--header-title-font-size: 20px;
			--header-title-gap: 8px;
			--header-title-padding: 24px;
			--header-nav-font-size: 16px;
			--header-nav-gap: 6px;
			--header-nav-padding: 4px 12px;
			--header-nav-radius: 12px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.header {
			--header-monogram-size: 24px;
			--header-title-font-size: 16px;
			--header-title-gap: 6px;
			--header-title-padding: 16px;
			--header-nav-font-size: 12px;
			--header-nav-gap: 4px;
			--header-nav-padding: 3px 8px;
			--header-nav-radius: 10px;
		}
	}
</style>
