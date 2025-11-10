<script>
	import { onMount } from 'svelte';
	import Head from './components/Head.svelte';
	import VerticalClickNav from './components/VerticalClickNav.svelte';
	import Splashscreen from './components/Splashscreen.svelte';
	import Header from './components/Header.svelte';
	import Rubrics from './components/Rubrics.svelte';
	import Folios from './components/Folios.svelte';
	import About from './components/About.svelte';
	import Footer from './components/Footer.svelte';
	import Foot from './components/Foot.svelte';
	
	// Import styles
	import './styles.css';
	// Import slick base styles from npm package
	import 'slick-carousel/slick/slick.css';
	import 'slick-carousel/slick/slick-theme.css';
	
	// Import scripts
	import { bgMusicControls, navigation, slickCarousel, toolTips, initScripts, initLoadingScreen } from './scripts.js';
	
	onMount(() => {
		// Initialize scripts after DOM is ready
		initScripts();
		initLoadingScreen();
		
		// Initialize scripts - slick needs a bit more time for DOM to be fully ready
		setTimeout(() => {
			bgMusicControls();
			navigation();
			toolTips();
		}, 50);
		
		// Initialize slick after galleries are fully in DOM
		setTimeout(() => {
			slickCarousel();
		}, 300);
	});
</script>

<div id="siteContainer" class="siteContainer">
	<Head />
	<VerticalClickNav />
	<Splashscreen />
	<Header />
	<Rubrics />
	<Folios />
	<About />
	<Footer />
	<Foot />
</div>

