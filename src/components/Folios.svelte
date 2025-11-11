<div id="musicPlaylistFolio" class="fullPage folio folioMusic folioAll">
	<MusicPlaylistFolio />
</div>

<div id="illustrationFolio1" class="fullPage folio folio2D folioAll">
	<IllustrationFolio1 />
</div>

<div id="gridzFolio" class="fullPage folio folioWeb folioAll">
	<Gridz />
</div>

<div id="drawingFolio1" class="fullPage folio folio2D folioAll">
	<DrawingFolio1 />
</div>

<div id="modeFolio1" class="fullPage folio folioAll folio3D">
	<ModeFolio1 />
</div>

<div id="illustrationFolio2" class="fullPage folio folio2D folioAll">
	<IllustrationFolio2 />
</div>

<div id="musicVidFolio" class="fullPage folio folioMusic folioAll">
	<MusicFolio1 />
</div>

<div id="animFolio1" class="fullPage folio folio3D folioAll">
	<AnimFolio1 />
</div>

<div id="drawingFolio2" class="fullPage folio folio2D folioAll">
	<DrawingFolio2 />
</div>

<div id="P4book" class="fullPage folio folioMusic folioAll">
	<P4bookFolio />
</div>

<div id="websitesFolio" class="fullPage folio folioWeb folioAll">
	<Websites />
</div>

<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
	import MusicPlaylistFolio from './folios/MusicPlaylistFolio.svelte';
	import IllustrationFolio1 from './folios/IllustrationFolio1.svelte';
	import IllustrationFolio2 from './folios/IllustrationFolio2.svelte';
	import Gridz from './folios/Gridz.svelte';
	import DrawingFolio1 from './folios/DrawingFolio1.svelte';
	import DrawingFolio2 from './folios/DrawingFolio2.svelte';
	import ModeFolio1 from './folios/ModeFolio1.svelte';
	import MusicFolio1 from './folios/MusicFolio1.svelte';
	import AnimFolio1 from './folios/AnimFolio1.svelte';
	import P4bookFolio from './folios/P4bookFolio.svelte';
	import Websites from './folios/Websites.svelte';

	// Reactive folio visibility from store
	const folioVisibilityStore = stores.navigation.folioVisibility;
	$: folioVisibility = $folioVisibilityStore;

	// Reactive statements to update DOM based on store
	$: {
		if (folioVisibility && folioVisibility.size > 0) {
			// Update each folio's visibility based on store
			folioVisibility.forEach((isVisible, folioId) => {
				const folioElement = document.getElementById(folioId);
				if (folioElement) {
					if (isVisible) {
						folioElement.classList.remove('hidden');
						folioElement.style.removeProperty('display');
					} else {
						folioElement.classList.add('hidden');
						folioElement.style.setProperty('display', 'none', 'important');
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
