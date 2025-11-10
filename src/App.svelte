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
	import RotateDevice from './components/RotateDevice.svelte';
	
	// Import styles
	import './styles.css';
	// Import slick base styles from npm package
	import 'slick-carousel/slick/slick.css';
	import 'slick-carousel/slick/slick-theme.css';
	
	// Import scripts - initialization now handles everything
	import { initScripts } from './scripts.js';
	
	onMount(() => {
		// Initialize all scripts (music player, navigation, etc.)
		// This now handles everything that was previously in bgMusicControls() and navigation()
		initScripts();
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
	<RotateDevice />
</div>
