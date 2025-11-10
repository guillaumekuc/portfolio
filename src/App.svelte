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
	
	// Import scripts - only what's still needed globally
	import { bgMusicControls, navigation, initScripts } from './scripts.js';
	
	onMount(() => {
		// Initialize script variables after DOM is ready
		initScripts();
		
		// Initialize scripts - slick is now handled in Folios.svelte
		// Music controls and navigation still need global coordination
		setTimeout(() => {
			bgMusicControls();
			navigation();
		}, 50);
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
