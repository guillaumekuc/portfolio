<div bind:this={navElement} class="splashNav">
	{#each navItems as item, index}
		{#if item.type === 'external'}
			<a
				bind:this={navLinkElements[index]}
				id="{item.id}Btn"
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
		{:else}
			<a
				bind:this={navLinkElements[index]}
				id="{item.id}Btn"
				class:cta={item.cta}
				class:focus={$selectedMenuItemStore === index}
				role="button"
				tabindex="0"
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
	import navConfig from '../config/nav.json';
	import NavIcon from './NavIcon.svelte';

	let navElement;
	let navLinkElements = [];
	
	// Get navigation items from config
	const navItems = navConfig.navigation;
	
	// Extract the store for reactive access
	const selectedMenuItemStore = stores.navigation.selectedMenuItem;

	function findCtaIndex() {
		return navItems.findIndex(item => item.cta === true);
	}

	// Selects the CTA item if no item is currently selected
	function selectCtaIfNoSelection() {
		const selectedMenuItem = $selectedMenuItemStore;
		if (selectedMenuItem < 0) {
			const ctaIndex = findCtaIndex();
			if (ctaIndex >= 0) {
				selectedMenuItemStore.set(ctaIndex);
				return true;
			}
		}
		return false;
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
			if (link) {
				const baseDelaySeconds = ANIMATION_BASE_DELAY_MS / 1000;
				const delayIncrementSeconds = ANIMATION_DELAY_INCREMENT_MS / 1000;
				const transitionDurationSeconds = ANIMATION_TRANSITION_DURATION_MS / 1000;
				const delay = baseDelaySeconds + (index * delayIncrementSeconds);
				link.style.transition = `opacity ${transitionDurationSeconds}s ease-out ${delay}s`;
				link.style.opacity = '100%';
			}
		});
		// Calculate total animation time: base delay + (items * increment) + transition duration
		const totalAnimationTime = ANIMATION_BASE_DELAY_MS + (navLinkElements.length * ANIMATION_DELAY_INCREMENT_MS) + ANIMATION_TRANSITION_DURATION_MS;
		setTimeout(() => {
			navLinkElements.forEach((link) => {
				if (link) link.style.pointerEvents = 'auto';
			});
		}, totalAnimationTime);
	}

	function goToCategories() {
		// Find item with cta property, or default to first item
		const ctaIndex = findCtaIndex();
		const defaultIndex = ctaIndex >= 0 ? ctaIndex : 0;
		selectedMenuItemStore.set(defaultIndex);
		const link = navLinkElements[defaultIndex];
		if (link) {
			Animation.programmaticHover(link);
		}
		document.querySelector('#categories')?.scrollIntoView();
	}

	function selectPreviousMenuItem() {
		// If no selection, select CTA item first
		if (selectCtaIfNoSelection()) {
			return;
		}
		
		const selectedMenuItem = $selectedMenuItemStore;
		const totalItems = navItems.length;
		// Cycle backwards
		const newSelectedMenuItem = selectedMenuItem <= 0 ? totalItems - 1 : selectedMenuItem - 1;
		selectedMenuItemStore.set(newSelectedMenuItem);
	}

	function selectNextMenuItem() {
		// If no selection, select CTA item first
		if (selectCtaIfNoSelection()) {
			return;
		}
		
		const selectedMenuItem = $selectedMenuItemStore;
		const totalItems = navItems.length;
		// Cycle forwards
		const newSelectedMenuItem = selectedMenuItem >= totalItems - 1 ? 0 : selectedMenuItem + 1;
		selectedMenuItemStore.set(newSelectedMenuItem);
	}

	function triggerSelectedMenuItem() {
		const selectedMenuItem = $selectedMenuItemStore;
		if (selectedMenuItem >= 0 && selectedMenuItem < navItems.length) {
			// For now, just reset to CTA item (behavior will be added later)
			const ctaIndex = findCtaIndex();
			const defaultIndex = ctaIndex >= 0 ? ctaIndex : 0;
			selectedMenuItemStore.set(defaultIndex);
		}
	}

	onMount(() => {
		shortcuts.addScreenShortcut('splashscreen', 'ArrowDown', goToCategories);
		shortcuts.addScreenShortcut('splashscreen', 'ArrowLeft', selectPreviousMenuItem);
		shortcuts.addScreenShortcut('splashscreen', 'ArrowRight', selectNextMenuItem);
		shortcuts.addScreenShortcut('splashscreen', 'Enter', triggerSelectedMenuItem);

		window.addEventListener('navAnimate', handleNavAnimate);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('splashscreen');
		window.removeEventListener('navAnimate', handleNavAnimate);
	});
</script>

<style>


	.splashNav {
		--splashscreen-nav-radius: 16px;
		--splashscreen-nav-bottom: 16px;
		--splashscreen-nav-width: 1220px;
		--splashscreen-nav-height: auto;
		--splashscreen-nav-font-family: 'M PLUS Rounded 1c';
		--splashscreen-nav-primary-color: white;
		--splashscreen-nav-accent-color: #60BF60;
		--splashscreen-nav-background-color: oklch(18% 0 0 / 0.67);

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		position: absolute;
		width: var(--splashscreen-nav-width);
		height: var(--splashscreen-nav-height);
		left: auto;
		right: auto;
		padding: 10px;

		bottom: var(--splashscreen-nav-bottom);

		background-color: var(--splashscreen-nav-background-color);
		background-blend-mode: luminosity;
		backdrop-filter: blur(2px);

		border-radius: var(--splashscreen-nav-radius);


	}

	.splashNav :global(.nav-icon) {
		height: 32px;
		width: 32px;
	}

	.splashNav a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		border-radius: var(--splashscreen-nav-radius);
		border: 1px solid transparent;

		padding: 5px 20px;

		color: var(--splashscreen-nav-primary-color);
		text-transform: lowercase;
		font-family: var(--splashscreen-nav-font-family) ;
		font-style: normal;
		font-weight: 300;
		font-size: 24px;

		opacity: 20%;
		pointer-events: none;
		user-select: none;
	}

	.splashNav a.cta {
		font-family: 'M PLUS Rounded 1c';
		text-transform: capitalize;
		font-weight: 700;
		letter-spacing: 0.05em;
		background-color: var(--splashscreen-nav-accent-color);
	}

	/* Transition will be set dynamically in handleNavAnimate */
	.splashNav a {
		transition: opacity 1.5s ease-out;
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
	
	:global(.splashNav > a.programmaticHover) {
		opacity: 100% !important;
		transition: none !important;
		border: 1px solid var(--splashscreen-nav-primary-color);
	}
</style>
