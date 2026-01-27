<div bind:this={navElement} class="splashNav">
	{#each navItems as item, index}
	{#if item.type === 'external'}
		{#if item.id === 'contact'}
			<a
				bind:this={navLinkElements[index]}
				id="{item.id}Btn"
				class="external"
				class:cta={item.cta}
				class:focus={$selectedMenuItemStore === index}
				href="#"
				on:click|preventDefault={() => handleContactClick()}
			>
				{#if item.icon}
					<NavIcon iconPath={item.icon.src} alt={item.icon.alt} />
				{/if}
				<span class="navLabel">{item.label}</span>
			</a>
		{:else}
			<a
				bind:this={navLinkElements[index]}
				id="{item.id}Btn"
				class="external"
				class:cta={item.cta}
				class:focus={$selectedMenuItemStore === index}
				href={item.url}
				target={item.openInNewTab ? '_blank' : undefined}
				rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
			>
				{#if item.icon}
					<NavIcon iconPath={item.icon.src} alt={item.icon.alt} />
				{/if}
				<span class="navLabel">{item.label}</span>
			</a>
		{/if}
		{:else}
			<a
				bind:this={navLinkElements[index]}
				id="{item.id}Btn"
				class:cta={item.cta}
				class:focus={$selectedMenuItemStore === index}
				class:active={item.target && item.target === $currentNavTargetStore}
				role="button"
				tabindex="0"
				on:click={() => handleNavItemClick(item, index)}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleNavItemClick(item, index);
					}
				}}
			>
				{#if item.icon}
					<NavIcon iconPath={item.icon.src} alt={item.icon.alt} />
				{/if}
				<span class="navLabel">{item.label}</span>
			</a>
		{/if}
	{/each}
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { shortcuts } from '../utils/shortcuts.js';
	import { stores } from '../stores.js';
	import { Animation } from '../utils/animation.js';
	import { Navigation } from '../utils/navigation.js';
	import { debugLog } from '../utils/debuglog.js';
	import { getMailtoUrl } from '../utils/email.js';
	import navConfig from '../config/nav.json';
	import siteConfig from '../config/site.json';
	import portfolioConfig from '../config/portfolio.json';
	import NavIcon from './NavIcon.svelte';
	import { get } from 'svelte/store';

	let navElement;
	let navLinkElements = [];
	
	// Get navigation items from config and replace placeholders
	const navItems = navConfig.navigation.map(item => {
		if (item.url === '{{EMAIL}}') {
			return { ...item, url: getMailtoUrl() };
		}
		if (item.url === '{{BLOG_URL}}') {
			return { ...item, url: siteConfig.blog.url };
		}
		return item;
	});
	
	// Extract the store for reactive access
	const selectedMenuItemStore = stores.navigation.selectedMenuItem;
	const currentNavTargetStore = stores.navigation.currentNavTarget;

	// Find CTA item (used for initialization)
	function findCtaItem() {
		return navItems.find(item => item.cta === true);
	}

	function findCtaIndex() {
		return navItems.findIndex(item => item.cta === true);
	}

	function findCtaTarget() {
		const ctaItem = findCtaItem();
		return ctaItem && ctaItem.type === 'internal' ? ctaItem.target : null;
	}

	// Initialize selectedMenuItem to CTA index if not set
	function initializeSelectedMenuItem() {
		const currentSelected = $selectedMenuItemStore;
		if (currentSelected < 0) {
			const ctaIndex = findCtaIndex();
			if (ctaIndex >= 0) {
				selectedMenuItemStore.set(ctaIndex);
			}
		}
	}

	function handleNavAnimate() {
		const ANIMATION_BASE_DELAY_MS = 3000;
		const ANIMATION_DELAY_INCREMENT_MS = 250;
		const ANIMATION_TRANSITION_DURATION_MS = 1500;

		if (navElement) {
			navElement.style.opacity = '100%';
		}
		
		// Dynamically set transition delays based on index
		navLinkElements.forEach((link, index) => {
			if (!link) return;
			
			const baseDelaySeconds = ANIMATION_BASE_DELAY_MS / 1000;
			const delayIncrementSeconds = ANIMATION_DELAY_INCREMENT_MS / 1000;
			const transitionDurationSeconds = ANIMATION_TRANSITION_DURATION_MS / 1000;
			const delay = baseDelaySeconds + (index * delayIncrementSeconds);
			
			link.style.transition = `opacity ${transitionDurationSeconds}s ease-out ${delay}s`;
			link.style.opacity = '100%';
		});
	}

	function goToPortfolioSections() {
		// Find item with cta property (Quick Tour), or default to first internal item
		const ctaIndex = findCtaIndex();
		const defaultIndex = ctaIndex >= 0 ? ctaIndex : navItems.findIndex(item => item.type === 'internal');
		
		if (defaultIndex >= 0) {
			selectedMenuItemStore.set(defaultIndex);
			const link = navLinkElements[defaultIndex];
			if (link) {
				Animation.programmaticHover(link);
			}
			// Trigger navigation
			handleNavItemClick(navItems[defaultIndex], defaultIndex);
		}
	}

	function selectPreviousMenuItem() {
		// Initialize if needed
		initializeSelectedMenuItem();
		
		const selectedMenuItem = $selectedMenuItemStore;
		if (selectedMenuItem < 0) return;
		
		const totalItems = navItems.length;
		// Cycle backwards through all items
		const newSelectedMenuItem = selectedMenuItem <= 0 
			? totalItems - 1 
			: selectedMenuItem - 1;
		
		selectedMenuItemStore.set(newSelectedMenuItem);
	}

	function selectNextMenuItem() {
		// Initialize if needed
		initializeSelectedMenuItem();
		
		const selectedMenuItem = $selectedMenuItemStore;
		if (selectedMenuItem < 0) return;
		
		const totalItems = navItems.length;
		// Cycle forwards through all items
		const newSelectedMenuItem = selectedMenuItem >= totalItems - 1 
			? 0 
			: selectedMenuItem + 1;
		
		selectedMenuItemStore.set(newSelectedMenuItem);
	}

	// Scroll to target for internal items only
	function scrollToTarget() {
		// Initialize if needed
		initializeSelectedMenuItem();
		
		const selectedMenuItem = $selectedMenuItemStore;
		if (selectedMenuItem < 0 || selectedMenuItem >= navItems.length) return;
		
		const item = navItems[selectedMenuItem];
		
		// Only works for internal items
		if (item.type === 'internal' && item.target) {
			handleNavItemClick(item, selectedMenuItem);
		}
	}

	// Trigger nav item: scroll if internal, open link if external
	function triggerNavItem() {
		// Initialize if needed
		initializeSelectedMenuItem();
		
		const selectedMenuItem = $selectedMenuItemStore;
		if (selectedMenuItem < 0 || selectedMenuItem >= navItems.length) return;
		
		const item = navItems[selectedMenuItem];
		
		if (item.id === 'contact') {
			// Contact button: open modal
			handleContactClick();
		} else if (item.type === 'internal' && item.target) {
			// Internal items: scroll to target
			handleNavItemClick(item, selectedMenuItem);
		} else if (item.type === 'external') {
			// External items: programmatically click the link
			const link = navLinkElements[selectedMenuItem];
			if (link) {
				link.click();
			}
		}
	}

	// Find target element for scrolling (by ID or category)
	function findTargetElement(target) {
		// First, try to find by ID (target might be an element ID like 'about')
		let targetElement = document.querySelector(`#${target}`);
		
		if (targetElement) {
			// Verify it's visible using store (for portfolio sections) or computed style (for about)
			if (targetElement.classList.contains('portfolioSection')) {
				const visibility = get(stores.navigation.portfolioSectionVisibility);
				const isVisible = !visibility || visibility.size === 0 
					? true 
					: (visibility.get(targetElement.id) ?? true);
				if (!isVisible) {
					targetElement = null;
				}
			} else {
				// For non-portfolio sections (like about), check computed style
				const style = window.getComputedStyle(targetElement);
				if (style.display === 'none' || style.visibility === 'hidden') {
					targetElement = null;
				}
			}
		}
		
		// If not found by ID, find first visible portfolio section with matching category using config
		if (!targetElement) {
			const visibility = get(stores.navigation.portfolioSectionVisibility);
			
			for (const section of portfolioConfig.portfolioSections) {
				const categories = section.categories.split(/\s+/);
				if (categories.includes(target)) {
					const isVisible = !visibility || visibility.size === 0 
						? true 
						: (visibility.get(section.id) ?? true);
					
					if (isVisible) {
						targetElement = document.getElementById(section.id);
						if (targetElement) break;
					}
				}
			}
		}
		
		return targetElement;
	}

	function handleContactClick() {
		stores.navigation.currentModal.set('contactModal');
	}

	function handleNavItemClick(item, index) {
		selectedMenuItemStore.set(index);
		
		// Handle contact button - open modal instead of mailto
		if (item.id === 'contact') {
			handleContactClick();
			return;
		}
		
		if (item.type !== 'internal' || !item.target) {
			debugLog('External nav item clicked:', item.id);
			return;
		}
		
		const htmlElement = document.documentElement;
		let scrollTimer;
		let cleanupDone = false;
		
		const cleanup = () => {
			if (cleanupDone) return;
			cleanupDone = true;
			htmlElement.style.scrollSnapType = 'y mandatory';
			Navigation.isNavigating = false;
			window.removeEventListener('scroll', onScroll);
			clearTimeout(scrollTimer);
			clearTimeout(fallbackTimer);
		};
		
		const onScroll = () => {
			clearTimeout(scrollTimer);
			scrollTimer = setTimeout(cleanup, 150);
		};
		
		// Suppress IntersectionObserver and snap during scroll
		Navigation.isNavigating = true;
		htmlElement.style.scrollSnapType = 'none';
		
		stores.navigation.currentNavTarget.set(item.target);
		Navigation.filterPortfolioSectionsByNavTarget(item.target);
		
		setTimeout(() => {
			const targetElement = findTargetElement(item.target);
			if (targetElement) {
				window.addEventListener('scroll', onScroll, { passive: true });
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				const fallbackTimer = setTimeout(cleanup, 3000);
				debugLog('Navigated to section:', targetElement.id);
			}
		}, 100);
	}

	onMount(() => {
		// Don't initialize selectedMenuItem on mount - let it start at -1
		// It will be initialized when keyboard navigation starts
		
		shortcuts.addScreenShortcut('splashscreen', 'ArrowDown', scrollToTarget);
		shortcuts.addScreenShortcut('splashscreen', 'ArrowLeft', selectPreviousMenuItem);
		shortcuts.addScreenShortcut('splashscreen', 'ArrowRight', selectNextMenuItem);
		shortcuts.addScreenShortcut('splashscreen', 'Enter', triggerNavItem);

		window.addEventListener('navAnimate', handleNavAnimate);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('splashscreen');
		window.removeEventListener('navAnimate', handleNavAnimate);
	});
</script>

<style>
	.splashNav {
		/* Font interface variables - map global variables to local scope */
		--splashscreen-nav-font-family: var(--ffRounded);
		--splashscreen-nav-primary-color: var(--color-white);
		--splashscreen-nav-accent-color: var(--color-accent);
		--splashscreen-nav-background-color: oklch(18% 0 0 / 0.67);

		/* Responsive values */
		--splashscreen-nav-width: 1220px;
		--splashscreen-nav-gap: 40px;
		--splashscreen-nav-radius: 16px;
		--splashscreen-nav-bottom: 16px;
		--splashscreen-nav-padding: 10px;
		--splashscreen-nav-link-padding: 5px 20px;
		--splashscreen-nav-font-size: 24px;
		--splashscreen-nav-icon-size: 32px;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: var(--splashscreen-nav-gap);

		position: absolute;
		width: min(var(--splashscreen-nav-width), calc(100vw - 32px));
		max-width: 100%;
		height: auto;
		left: 50%;
		transform: translateX(-50%);
		padding: var(--splashscreen-nav-padding);

		bottom: var(--splashscreen-nav-bottom);

		background-color: var(--splashscreen-nav-background-color);
		background-blend-mode: luminosity;
		backdrop-filter: blur(2px);

		border-radius: var(--splashscreen-nav-radius);
	}

	.splashNav :global(.nav-icon) {
		height: var(--splashscreen-nav-icon-size);
		width: var(--splashscreen-nav-icon-size);
	}

	.splashNav a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		border-radius: var(--splashscreen-nav-radius);
		border: 1px solid transparent;

		padding: var(--splashscreen-nav-link-padding);

		color: var(--splashscreen-nav-primary-color);
		text-transform: lowercase;
		font-family: var(--splashscreen-nav-font-family);
		font-style: normal;
		font-weight: 300;
		font-size: var(--splashscreen-nav-font-size);

		opacity: 20%;
		pointer-events: auto;
		user-select: none;
		
		/* Transition will be set dynamically in handleNavAnimate */
		transition: opacity 1.5s ease-out;
	}

	.splashNav a.external:not([id="contactBtn"]) .navLabel::after {
		content: '↗';
		margin-left: 0.25em;
		font-size: 0.8em;
	}


	.splashNav a:hover {
		transition: none !important;
		opacity: 100%;
		cursor: pointer;
		border: 1px solid var(--splashscreen-nav-primary-color);
	}
	
	.splashNav a.focus {
		transition: none !important;
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}
	
	.splashNav a.active {
		transition: none !important;
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-accent-color) !important;
	}

	/* Active + hover: white border takes precedence */
	.splashNav a.active:hover {
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* Active + focus: white border takes precedence */
	.splashNav a.active.focus {
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* Active + focus + hover: white border takes precedence */
	.splashNav a.active.focus:hover {
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* CTA default state - green background, low opacity, no border */
	.splashNav a.cta {
		font-family: var(--splashscreen-nav-font-family);
		text-transform: capitalize;
		font-weight: 700;
		letter-spacing: 0.05em;
		background-image: var(--color-accent-gradient);
		opacity: 20%;
		border: 1px solid transparent;
	}

	/* CTA hover state - white border, full opacity */
	.splashNav a.cta:hover {
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* CTA focus state (keyboard navigation) - green border, full opacity */
	.splashNav a.cta.focus {
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* CTA active state (current selection) - no border, full opacity */
	.splashNav a.cta.active {
		opacity: 100% !important;
		border: 1px solid transparent !important;
	}

	/* CTA focus + hover - white border takes precedence */
	.splashNav a.cta.focus:hover {
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* CTA active + hover - white border, full opacity */
	.splashNav a.cta.active:hover {
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* CTA active + focus - green border (focus takes precedence over active) */
	.splashNav a.cta.active.focus {
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}

	/* CTA active + focus + hover - white border (hover takes precedence) */
	.splashNav a.cta.active.focus:hover {
		opacity: 100% !important;
		border: 1px solid var(--splashscreen-nav-primary-color) !important;
	}
	
	:global(.splashNav > a.programmaticHover) {
		opacity: 100% !important;
		transition: none !important;
		border: 1px solid var(--splashscreen-nav-primary-color);
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.splashNav {
			--splashscreen-nav-width: 1000px;
			--splashscreen-nav-gap: 32px;
			--splashscreen-nav-radius: 14px;
			--splashscreen-nav-bottom: 14px;
			--splashscreen-nav-padding: 8px;
			--splashscreen-nav-link-padding: 4px 16px;
			--splashscreen-nav-font-size: 20px;
			--splashscreen-nav-icon-size: 28px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.splashNav {
			--splashscreen-nav-width: 800px;
			--splashscreen-nav-gap: 24px;
			--splashscreen-nav-radius: 12px;
			--splashscreen-nav-bottom: 12px;
			--splashscreen-nav-padding: 6px;
			--splashscreen-nav-link-padding: 4px 12px;
			--splashscreen-nav-font-size: 16px;
			--splashscreen-nav-icon-size: 0px;
		}

		.splashNav :global(.nav-icon) {
			display: none;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.splashNav {
			--splashscreen-nav-width: 600px;
			--splashscreen-nav-gap: 12px;
			--splashscreen-nav-radius: 10px;
			--splashscreen-nav-bottom: 8px;
			--splashscreen-nav-padding: 4px;
			--splashscreen-nav-link-padding: 3px 8px;
			--splashscreen-nav-font-size: 12px;
			--splashscreen-nav-icon-size: 0px;
		}

		.splashNav :global(.nav-icon) {
			display: none;
		}
	}

	/* Horizontal width constraints - reduce gaps when screen is narrow */
	@media (max-width: 1400px) {
		.splashNav {
			--splashscreen-nav-gap: 32px;
		}
	}

	@media (max-width: 1200px) {
		.splashNav {
			--splashscreen-nav-gap: 24px;
		}
	}

	@media (max-width: 1000px) {
		.splashNav {
			--splashscreen-nav-gap: 16px;
		}
	}

	@media (max-width: 800px) {
		.splashNav {
			--splashscreen-nav-gap: 12px;
		}
	}

	@media (max-width: 600px) {
		.splashNav {
			--splashscreen-nav-gap: 8px;
		}
	}

</style>
