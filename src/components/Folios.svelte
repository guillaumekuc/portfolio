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
	
	// Import shortcuts system
	import { shortcuts } from '../utils/shortcuts.js';
	
	// Gallery navigation handlers - registered as screen shortcuts for each section with a gallery
	function createGalleryHandlers(sectionId) {
		// Handler for ArrowLeft - navigate to previous slide
		function handleGalleryPrev(e) {
			// Don't interfere if user is typing in a form field
			const targetTag = e.target?.tagName;
			if (targetTag && targetTag.match(/INPUT|TEXTAREA|SELECT/)) {
				return;
			}
			
			const section = document.getElementById(sectionId);
			if (!section) return;
			
			const gallery = section.querySelector('.gallery');
			if (!gallery) return;
			
			// Check if gallery is initialized with Slick
			if (!jQuery || !jQuery.fn.slick) return;
			const galleryElement = jQuery(gallery);
			if (!galleryElement.hasClass('slick-initialized')) return;
			
			// Only handle if the event target is NOT the gallery list element
			// (Slick's handler will handle it if focus is on the gallery)
			if (e.target === gallery || gallery.contains(e.target)) {
				return; // Let Slick's handler take care of it
			}
			
			// Trigger Slick's navigation (focus is elsewhere, so Slick's handler won't fire)
			galleryElement.slick('slickPrev');
			e.preventDefault();
		}
		
		// Handler for ArrowRight - navigate to next slide
		function handleGalleryNext(e) {
			// Don't interfere if user is typing in a form field
			const targetTag = e.target?.tagName;
			if (targetTag && targetTag.match(/INPUT|TEXTAREA|SELECT/)) {
				return;
			}
			
			const section = document.getElementById(sectionId);
			if (!section) return;
			
			const gallery = section.querySelector('.gallery');
			if (!gallery) return;
			
			// Check if gallery is initialized with Slick
			if (!jQuery || !jQuery.fn.slick) return;
			const galleryElement = jQuery(gallery);
			if (!galleryElement.hasClass('slick-initialized')) return;
			
			// Only handle if the event target is NOT the gallery list element
			// (Slick's handler will handle it if focus is on the gallery)
			if (e.target === gallery || gallery.contains(e.target)) {
				return; // Let Slick's handler take care of it
			}
			
			// Trigger Slick's navigation (focus is elsewhere, so Slick's handler won't fire)
			galleryElement.slick('slickNext');
			e.preventDefault();
		}
		
		// Handler for Enter - play/pause video in current slide
		function handleGalleryEnter(e) {
			// Don't interfere if user is typing in a form field
			const targetTag = e.target?.tagName;
			if (targetTag && targetTag.match(/INPUT|TEXTAREA|SELECT/)) {
				return;
			}
			
			const section = document.getElementById(sectionId);
			if (!section) return;
			
			const gallery = section.querySelector('.gallery');
			if (!gallery) return;
			
			// Check if gallery is initialized with Slick
			if (!jQuery || !jQuery.fn.slick) return;
			const galleryElement = jQuery(gallery);
			if (!galleryElement.hasClass('slick-initialized')) return;
			const slickInstance = galleryElement.slick('getSlick');
			if (!slickInstance || !slickInstance.options.accessibility) return;
			
			// Get all slides (including clones in infinite mode)
			const allSlides = gallery.querySelectorAll('.slick-slide');
			
			// Try to find the center slide using multiple strategies
			let currentSlide = null;
			
			// Strategy 1: Use .slick-center class (most reliable for centerMode)
			currentSlide = gallery.querySelector('.slick-slide.slick-center:not(.slick-cloned)');
			
			// Strategy 2: If no center found, try slick-current
			if (!currentSlide) {
				currentSlide = gallery.querySelector('.slick-slide.slick-current:not(.slick-cloned)');
			}
			
			// Strategy 3: Use currentSlideIndex from Slick API (but skip clones)
			if (!currentSlide) {
				for (let i = 0; i < allSlides.length; i++) {
					const slide = allSlides[i];
					if (!slide.classList.contains('slick-cloned') && 
					    slide.classList.contains('slick-active') &&
					    (slide.classList.contains('slick-center') || slide.classList.contains('slick-current'))) {
						currentSlide = slide;
						break;
					}
				}
			}
			
			// Strategy 4: Last resort - find any active non-cloned slide with video
			if (!currentSlide) {
				for (let i = 0; i < allSlides.length; i++) {
					const slide = allSlides[i];
					if (!slide.classList.contains('slick-cloned') && 
					    slide.classList.contains('slick-active') &&
					    slide.querySelector('video')) {
						currentSlide = slide;
						break;
					}
				}
			}
			
			if (currentSlide) {
				// Video might be directly in slide or inside .gallery-item
				const video = currentSlide.querySelector('video');
				if (video) {
					// Toggle play/pause on the video
					if (video.paused) {
						video.play().catch(err => {
							// Handle play() promise rejection (e.g., autoplay policy)
							console.warn('Video play failed:', err);
						});
					} else {
						video.pause();
					}
					e.preventDefault();
				}
			}
		}
		
		return {
			prev: handleGalleryPrev,
			next: handleGalleryNext,
			enter: handleGalleryEnter
		};
	}
	
	// Register gallery shortcuts for sections that have galleries (use PortfolioGallery component)
	function registerGalleryShortcuts() {
		portfolioSections.forEach((section) => {
			// Only register for sections that use PortfolioGallery (have items array)
			if (section.config.items && section.config.items.length > 0) {
				const handlers = createGalleryHandlers(section.id);
				shortcuts.addScreenShortcut(section.id, 'ArrowLeft', handlers.prev, true);
				shortcuts.addScreenShortcut(section.id, 'ArrowRight', handlers.next, true);
				shortcuts.addScreenShortcut(section.id, 'Enter', handlers.enter, true);
			}
		});
	}
	
	// Clean up gallery shortcuts
	function unregisterGalleryShortcuts() {
		portfolioSections.forEach((section) => {
			if (section.config.items && section.config.items.length > 0) {
				shortcuts.removeScreenShortcuts(section.id);
			}
		});
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
		
		// Register gallery shortcuts as screen shortcuts for each section
		// This ensures they respect modal blocking and follow the shortcuts system architecture
		registerGalleryShortcuts();
		
		return () => {
			unregisterGalleryShortcuts();
		};
	});
</script>
