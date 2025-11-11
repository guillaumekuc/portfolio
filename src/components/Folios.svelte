<div id="musicPlaylistFolio" class="fullPage portfolioSection portfolio-music portfolio-all">
	<MusicPlaylistFolio />
</div>

<div id="illustrationFolio1" class="fullPage portfolioSection portfolio-2d portfolio-all">
	<IllustrationFolio1 />
</div>

<div id="gridzFolio" class="fullPage portfolioSection portfolio-web portfolio-all">
	<Gridz />
</div>

<div id="drawingFolio1" class="fullPage portfolioSection portfolio-2d portfolio-all">
	<DrawingFolio1 />
</div>

<div id="modeFolio1" class="fullPage portfolioSection portfolio-all portfolio-3d">
	<ModeFolio1 />
</div>

<div id="illustrationFolio2" class="fullPage portfolioSection portfolio-2d portfolio-all">
	<IllustrationFolio2 />
</div>

<div id="musicVidFolio" class="fullPage portfolioSection portfolio-music portfolio-all">
	<MusicFolio1 />
</div>

<div id="animFolio1" class="fullPage portfolioSection portfolio-3d portfolio-all">
	<AnimFolio1 />
</div>

<div id="drawingFolio2" class="fullPage portfolioSection portfolio-2d portfolio-all">
	<DrawingFolio2 />
</div>

<div id="P4book" class="fullPage portfolioSection portfolio-music portfolio-all">
	<P4bookFolio />
</div>

<div id="websitesFolio" class="fullPage portfolioSection portfolio-web portfolio-all">
	<Websites />
</div>

<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
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

	// Reactive portfolio section visibility from store
	const portfolioSectionVisibilityStore = stores.navigation.portfolioSectionVisibility;
	$: portfolioSectionVisibility = $portfolioSectionVisibilityStore;

	// Reactive statements to update DOM based on store
	$: {
		if (portfolioSectionVisibility && portfolioSectionVisibility.size > 0) {
			// Update each portfolio section's visibility based on store
			portfolioSectionVisibility.forEach((isVisible, portfolioSectionId) => {
				const portfolioSectionElement = document.getElementById(portfolioSectionId);
				if (portfolioSectionElement) {
					if (isVisible) {
						portfolioSectionElement.classList.remove('hidden');
						portfolioSectionElement.style.removeProperty('display');
					} else {
						portfolioSectionElement.classList.add('hidden');
						portfolioSectionElement.style.setProperty('display', 'none', 'important');
					}
				}
			});
		}
	}

	onMount(() => {
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
