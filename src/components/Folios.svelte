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
	
	$: sectionVisibility = (() => {
		const map = new Map();
		const storeValue = $portfolioSectionVisibilityStore;
		portfolioSections.forEach((section) => {
			map.set(section.id, storeValue?.get(section.id) ?? true);
		});
		return map;
	})();

	const jQuery = window.$;
	
	// Import shortcuts system
	import { shortcuts } from '../utils/shortcuts.js';
	
	function createGalleryHandlers(sectionId) {
		function handleGalleryPrev(e) {
			if (e.target.tagName.match(/INPUT|TEXTAREA|SELECT/)) return;
			const gallery = document.getElementById(sectionId).querySelector('.gallery');
			if (e.target === gallery || gallery.contains(e.target)) return;
			jQuery(gallery).slick('slickPrev');
		}
		
		function handleGalleryNext(e) {
			if (e.target.tagName.match(/INPUT|TEXTAREA|SELECT/)) return;
			const gallery = document.getElementById(sectionId).querySelector('.gallery');
			jQuery(gallery).slick('slickNext');
		}
		
		function handleGalleryEnter(e) {
			if (e.target.tagName.match(/INPUT|TEXTAREA|SELECT/)) return;
			const gallery = document.getElementById(sectionId).querySelector('.gallery');
			const slide = gallery.querySelector('.slick-slide.slick-center:not(.slick-cloned)') ||
			              gallery.querySelector('.slick-slide.slick-current:not(.slick-cloned)');
			if (slide) {
				const video = slide.querySelector('video');
				if (video) {
					video.paused ? video.play() : video.pause();
				}
			}
		}
		
		return { prev: handleGalleryPrev, next: handleGalleryNext, enter: handleGalleryEnter };
	}
	
	function registerGalleryShortcuts() {
		portfolioSections.forEach((section) => {
			if (section.config.items?.length && section.id !== 'musicPlaylistFolio') {
				const handlers = createGalleryHandlers(section.id);
				shortcuts.addScreenShortcut(section.id, 'ArrowLeft', handlers.prev, true);
				shortcuts.addScreenShortcut(section.id, 'ArrowRight', handlers.next, true);
				shortcuts.addScreenShortcut(section.id, 'Enter', handlers.enter, true);
			}
		});
	}
	
	function unregisterGalleryShortcuts() {
		portfolioSections.forEach((section) => {
			if (section.config.items?.length && section.id !== 'musicPlaylistFolio') {
				shortcuts.removeScreenShortcuts(section.id);
			}
		});
	}

	onMount(() => {
		Navigation.refreshScrollTracking();
		const currentNavTarget = get(stores.navigation.currentNavTarget);
		if (currentNavTarget) {
			Navigation.filterPortfolioSectionsByNavTarget(currentNavTarget);
		}
		
		setTimeout(() => {
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
					
					$gallery.on('afterChange', function() {
						setTimeout(() => {
							if (document.activeElement.tagName && !document.activeElement.tagName.match(/INPUT|TEXTAREA|SELECT/)) {
								this.focus();
							}
						}, 0);
					});
				}
			});
		}, 300);
		
		registerGalleryShortcuts();
		
		return () => {
			unregisterGalleryShortcuts();
		};
	});
</script>
