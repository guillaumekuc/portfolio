{#each portfolioSections as section}
	{#if section.component}
		<div
			id={section.id}
			class="fullPage portfolioSection"
			class:hidden={!sectionVisibility.get(section.id)}
			data-categories={section.categories}
		>
			<svelte:component this={section.component} />
		</div>
	{/if}
{/each}

<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { Navigation } from '../utils/navigation.js';
	
	import portfolioConfig from '../config/portfolio.json';

	import MusicPlaylistFolio from './portfolioSections/MusicPlaylistFolio.svelte';
	import IllustrationFolio1 from './portfolioSections/IllustrationFolio1.svelte';
	import IllustrationFolio2 from './portfolioSections/IllustrationFolio2.svelte';
	import Gridz from './portfolioSections/Gridz.svelte';
	import DrawingFolio1 from './portfolioSections/DrawingFolio1.svelte';
	import DrawingFolio2 from './portfolioSections/DrawingFolio2.svelte';
	import ModeFolio1 from './portfolioSections/ModeFolio1.svelte';
	import MusicFolio1 from './portfolioSections/MusicFolio1.svelte';
	import AnimFolio1 from './portfolioSections/AnimFolio1.svelte';
	import P4bookFolio from './portfolioSections/P4bookFolio.svelte';
	import Websites from './portfolioSections/Websites.svelte';

	// Component mapping
	const componentMap = {
		MusicPlaylistFolio,
		IllustrationFolio1,
		IllustrationFolio2,
		Gridz,
		DrawingFolio1,
		DrawingFolio2,
		ModeFolio1,
		MusicFolio1,
		AnimFolio1,
		P4bookFolio,
		Websites
	};

	// Map JSON config to components
	const portfolioSections = portfolioConfig.portfolioSections.map((section) => ({
		id: section.id,
		component: componentMap[section.component],
		categories: section.categories
	}));

	// Reactive portfolio section visibility from store
	const portfolioSectionVisibilityStore = stores.navigation.portfolioSectionVisibility;
	
	// Create a reactive map of visibility for each section
	// This ensures Svelte properly tracks store changes
	$: sectionVisibility = (() => {
		const visibilityMap = new Map();
		const storeValue = $portfolioSectionVisibilityStore;
		
		portfolioSections.forEach((section) => {
			// If store is empty/uninitialized, show all by default
			if (!storeValue || storeValue.size === 0) {
				visibilityMap.set(section.id, true);
			} else {
				// Get visibility from store, default to true if not found
				visibilityMap.set(section.id, storeValue.get(section.id) ?? true);
			}
		});
		
		return visibilityMap;
	})();

	onMount(() => {
		// Refresh scroll tracking to register new sections with IntersectionObserver
		Navigation.refreshScrollTracking();
		
		// Ensure filtering is applied on mount if it hasn't been applied yet
		const currentNavTarget = get(stores.navigation.currentNavTarget);
		if (currentNavTarget) {
			// Apply filtering to ensure sections are visible based on current target
			Navigation.filterPortfolioSectionsByNavTarget(currentNavTarget);
		}
		
		// Initialize slick carousel on galleries
		// jQuery is already available globally from scripts.js
		setTimeout(() => {
			const galleries = document.querySelectorAll('.gallery');
			if (galleries.length > 0 && typeof window.$ !== 'undefined' && window.$.fn.slick) {
				window.$('.gallery').each(function () {
					if (!window.$(this).hasClass('slick-initialized')) {
						window.$(this).slick({
							dots: false,
							infinite: true,
							speed: 300,
							slidesToShow: 1,
							centerMode: true,
							variableWidth: true,
							arrows: true,
							focusOnSelect: true,
							autoplay: false,
							centerPadding: '0px',
							draggable: true,
							touchThreshold: 100
						});
					}
				});
			}
		}, 300);
	});
</script>
