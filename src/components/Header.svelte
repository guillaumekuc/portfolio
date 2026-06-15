<div id="header" class="header" class:visible={isVisible}>
	<div class="header-title">
		<button type="button" class="header-monogram-button" on:click={handleTitleClick}>
			<span class="header-monogram">
				<MonogramSvg />
			</span>
		</button>
		<button type="button" class="header-title-button" on:click={handleTitleClick}>
			{#if siteTitleParts.suffix}
				{siteTitleParts.primary}<small class="header-site-suffix">{siteTitleParts.suffix}</small>
			{:else}
				{profile.siteName}
			{/if}
		</button>
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
				<span class="header-nav-label">{item.label}</span>
			</button>
		{/each}
	</div>
	<div class="header-actions">
		<LanguageSelector />
		<button type="button" class="header-help-button" on:click={handleHelpClick}>
			<img src="/img/nav/help.svg" alt={helpAlt} />
		</button>
	</div>
</div>
<!--#header-->

<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import MonogramSvg from './MonogramSvg.svelte';
	import LanguageSelector from './LanguageSelector.svelte';
	import { stores } from '../stores.js';
	import { t } from '../utils/i18n.js';
	import { DOM } from '../utils/dom.js';
	import { Navigation } from '../utils/navigation.js';
	import navConfig from '../config/nav.json';
	import profileConfig from '../config/profile.json';
	import portfolioConfig from '../config/portfolio.json';

	// Get profile info from config
	const profile = profileConfig;

	/** Suffix = substring from the first "." onward (e.g. guillaumekuc + .art, foo + .bar.baz). */
	function splitSiteTitle(siteName) {
		if (typeof siteName !== 'string') {
			return { primary: '', suffix: '' };
		}
		const i = siteName.indexOf('.');
		if (i === -1) {
			return { primary: siteName, suffix: '' };
		}
		return {
			primary: siteName.slice(0, i),
			suffix: siteName.slice(i)
		};
	}

	const siteTitleParts = splitSiteTitle(profile.siteName);

	// Visibility state for header
	let isVisible = false;

	const localeStore = stores.i18n.locale;

	// Filter navigation items to only include internal items
	// Sort so CTA items come first, then map to the format needed for the header
	$: headerNavItems = navConfig.navigation
		.filter(item => item.type === 'internal' && item.target)
		.sort((a, b) => {
			if (a.cta && !b.cta) return -1;
			if (!a.cta && b.cta) return 1;
			return 0;
		})
		.map(item => ({
			id: `headerNavButton-${item.id}`,
			target: item.target,
			label: t($localeStore, `nav.${item.id}`)
		}));

	// Extract the store for reactive access
	const currentNavTargetStore = stores.navigation.currentNavTarget;
	$: currentNavTarget = $currentNavTargetStore;
	$: helpAlt = t($localeStore, 'common.help');

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

	function handleHelpClick() {
		stores.navigation.currentModal.set('helpModal');
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
		/* Font interface variables - map global variables to local scope */
		--header-font-rounded: var(--ffRounded);
	}
	.header {
		/* Interface variables - map global variables to local scope */
		--bp-small-desktop: var(--breakpoint-small-desktop);
		--bp-tablet: var(--breakpoint-tablet);
		--bp-mobile: var(--breakpoint-mobile);

		/* Color interface variables */
		--header-background-color: var(--color-background-tertiary);
		--header-border-color: var(--color-gray-dark);
		--header-primary-color: var(--color-white);
		--header-accent-color: var(--color-accent);
		--header-text-secondary: #6e6e6e;

		/* Responsive values (height inherits from global --header-footer-height) */
		--header-height: var(--header-footer-height);
		--header-monogram-size: 55px;
		--header-title-font-size: 27px;
		--header-title-gap: 4px;
		--header-title-padding: 38px;
		--header-nav-font-size: 24px;
		--header-nav-padding: 5px 25px;

		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
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

		font-family: var(--header-font-rounded);
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
		transform: translateY(3px);
	}


	.header-monogram {
		color: var(--header-accent-color);
		display: inline-block;
		height: 100%;
		width: 100%;
	}

	.header-monogram :global(svg) {
		height: 100%;
		width: auto;
		display: block;
	}

	.header-title-button {
		color: var(--header-primary-color);
		font-size: 1em;
		font-family: var(--header-font-rounded);
		letter-spacing: 0.05em;
		font-weight: 400;
		text-transform: lowercase;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: inline-block;
		transition: color 0.2s ease;
	}

	.header-title:hover .header-title-button,
	.header-title:focus-within .header-title-button {
		color: var(--header-accent-color);
	}

	.header-title-button:focus-visible {
		outline: 2px solid var(--header-accent-color);
		outline-offset: 3px;
	}

	.header-site-suffix {
		font-size: 0.68em;
		font-weight: 300;
		letter-spacing: inherit;
	}

	.header-monogram-button:focus-visible {
		outline: 2px solid var(--header-accent-color);
		outline-offset: 2px;
		border-radius: 4px;
	}

	.header-nav {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: left;
		color: var(--header-text-secondary);
		height: 100%;
	}

	.header-nav button {
		position: relative;
		font-family: var(--header-font-rounded);
		font-size: var(--header-nav-font-size);
		font-weight: 300;
		text-transform: lowercase;
		color: var(--header-text-secondary);
		padding: var(--header-nav-padding);
		border: none;
		background: none;
		cursor: pointer;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.18s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Accent bar: full padded “cell” width (padding box), not glyph width */
	.header-nav button::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 2px;
		height: 3px;
		background-color: var(--header-accent-color);
		opacity: 0;
		transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
	}

	.header-nav-label {
		display: inline-block;
		position: relative;
		z-index: 1;
	}

	.header-nav button:hover,
	.header-nav button.focus {
		color: var(--header-primary-color);
	}

	.header-nav button:hover::after,
	.header-nav button.focus::after {
		opacity: 1;
	}

	.header-nav button:focus-visible {
		outline: 2px solid var(--header-accent-color);
		outline-offset: -2px;
	}

	.header-actions {
		margin-left: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 22px;
		margin-right: var(--header-title-padding);
	}

	.header-help-button {
		font-family: var(--header-font-rounded);
		font-size: var(--header-nav-font-size);
		font-weight: 300;
		color: var(--header-text-secondary);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: color 0.2s ease;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: calc(var(--header-nav-font-size) + 10px);
		width: calc(var(--header-nav-font-size) + 10px);
	}

	.header-help-button img {
		width: var(--header-nav-font-size);
		height: var(--header-nav-font-size);
		object-fit: contain;
		filter: brightness(0) saturate(100%) invert(0.4);
		transition: filter 0.2s ease;
	}

	.header-help-button:hover {
		color: var(--header-primary-color);
	}

	.header-help-button:hover img {
		filter: brightness(0) saturate(100%) invert(1);
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.header {
			--header-monogram-size: 46px;
			--header-title-font-size: 24px;
			--header-title-gap: 3px;
			--header-title-padding: 30px;
			--header-nav-font-size: 20px;
			--header-nav-padding: 4px 20px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.header {
			--header-monogram-size: 36px;
			--header-title-font-size: 20px;
			--header-title-gap: 2px;
			--header-title-padding: 24px;
			--header-nav-font-size: 16px;
			--header-nav-padding: 4px 15px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.header {
			--header-monogram-size: 24px;
			--header-title-font-size: 16px;
			--header-title-gap: 2px;
			--header-title-padding: 16px;
			--header-nav-font-size: 12px;
			--header-nav-padding: 3px 10px;
		}
	}
</style>
