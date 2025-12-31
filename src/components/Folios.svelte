{#each portfolioSections as section}
	{#if section.component}
		<div
			id={section.id}
			class="fullPage portfolioSection"
			class:hidden={!sectionVisibility.get(section.id)}
			data-categories={section.categories}
		>
			<svelte:component this={section.component} sectionConfig={section.config} />
		</div>
	{/if}
{/each}

<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { Navigation } from '../utils/navigation.js';
	
	import portfolioConfig from '../config/portfolio.json';

	import PortfolioGallery from './portfolioSections/PortfolioGallery.svelte';
	import MusicPlaylistFolio from './portfolioSections/MusicPlaylistFolio.svelte';
	import Gridz from './portfolioSections/Gridz.svelte';
	import MusicFolio1 from './portfolioSections/MusicFolio1.svelte';
	import AnimFolio1 from './portfolioSections/AnimFolio1.svelte';
	import P4bookFolio from './portfolioSections/P4bookFolio.svelte';
	import Websites from './portfolioSections/Websites.svelte';

	// Component mapping for custom components (not using PortfolioGallery)
	const componentMap = {
		MusicPlaylistFolio,
		Gridz,
		MusicFolio1,
		AnimFolio1,
		P4bookFolio,
		Websites
	};

	// Map JSON config to components
	// Sections with 'items' array automatically use PortfolioGallery
	// Otherwise, use the component map
	const portfolioSections = portfolioConfig.portfolioSections.map((section) => {
		// If section has items, use PortfolioGallery directly
		// Otherwise, use the component from the map
		const component = section.items 
			? PortfolioGallery 
			: componentMap[section.component];
		
		return {
			id: section.id,
			component,
			categories: section.categories,
			config: section
		};
	});

	// Reactive portfolio section visibility from store
	const portfolioSectionVisibilityStore = stores.navigation.portfolioSectionVisibility;
	
	// Store reference for current screen (declared at top level for keyboard handler)
	const currentScreenStore = stores.navigation.currentScreen;
	
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

	// Store jQuery reference at top level to avoid linter issues
	const jQuery = typeof window !== 'undefined' ? window.$ : null;

	// Document-level keyboard handler for gallery navigation
	// This ensures ArrowLeft/ArrowRight work even after dragging when focus might be lost
	// We only handle if the event target is not the gallery list (to avoid double-handling with Slick's handler)
	function handleGalleryKeyboard(e) {
		// Only handle ArrowLeft and ArrowRight
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
			return;
		}
		
		// Don't interfere if user is typing in a form field
		const targetTag = e.target?.tagName;
		if (targetTag && targetTag.match(/INPUT|TEXTAREA|SELECT/)) {
			return;
		}
		
		// Check if we're on a portfolio section with a gallery
		// Find the currently visible portfolio section by checking intersection
		// This avoids store access inside the handler
		const visibleSections = document.querySelectorAll('.portfolioSection:not(.hidden)');
		let currentSection = null;
		
		// Find the section that's most visible (has highest intersection ratio)
		let maxRatio = 0;
		visibleSections.forEach((section) => {
			const rect = section.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
			const ratio = visibleHeight / viewportHeight;
			if (ratio > maxRatio && ratio > 0.4) {
				maxRatio = ratio;
				currentSection = section;
			}
		});
		
		if (!currentSection) return;
		
		// Find the gallery in the current section
		const gallery = currentSection.querySelector('.gallery');
		if (!gallery) return;
		
		// Check if gallery is initialized with Slick
		if (!jQuery || !jQuery.fn.slick) return;
		const galleryElement = jQuery(gallery);
		if (!galleryElement.hasClass('slick-initialized')) return;
		const slickInstance = galleryElement.slick('getSlick');
		if (!slickInstance || !slickInstance.options.accessibility) return;
		
		// Only handle if the event target is NOT the gallery list element
		// (Slick's handler will handle it if focus is on the gallery)
		// This prevents double navigation
		if (e.target === gallery || gallery.contains(e.target)) {
			// Let Slick's handler take care of it
			return;
		}
		
		// Trigger Slick's navigation (focus is elsewhere, so Slick's handler won't fire)
		if (e.key === 'ArrowLeft') {
			galleryElement.slick('slickPrev');
			e.preventDefault();
		} else if (e.key === 'ArrowRight') {
			galleryElement.slick('slickNext');
			e.preventDefault();
		}
	}

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
						const $gallery = window.$(this);
						$gallery.slick({
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
						
						// Restore focus to gallery after slide change (including after dragging)
						// This ensures keyboard navigation works after dragging
						$gallery.on('afterChange', function() {
							// Use setTimeout to ensure the event fires after Slick's internal handling
							setTimeout(() => {
								const galleryElement = this;
								if (galleryElement && document.activeElement !== galleryElement) {
									// Only restore focus if we're not already focused on an input/textarea/select
									const activeTag = document.activeElement?.tagName;
									if (!activeTag || !activeTag.match(/INPUT|TEXTAREA|SELECT/)) {
										galleryElement.focus();
									}
								}
							}, 0);
						});
					}
				});
			}
		}, 300);
		
		document.addEventListener('keydown', handleGalleryKeyboard);
		
		return () => {
			document.removeEventListener('keydown', handleGalleryKeyboard);
		};
	});
</script>
