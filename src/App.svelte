<Header />
<Footer />
<Head />
<VerticalClickNav />
<Splashscreen />
<Folios />
<About />
<RotateDevice />

<script>
	import { onMount } from 'svelte';
	import Head from './components/Head.svelte';
	import VerticalClickNav from './components/VerticalClickNav.svelte';
	import Splashscreen from './components/Splashscreen.svelte';
	import Header from './components/Header.svelte';
	import Folios from './components/Folios.svelte';
	import About from './components/About.svelte';
	import Footer from './components/Footer.svelte';
	import RotateDevice from './components/RotateDevice.svelte';

	// Import styles
	import './styles.css';
	// Import slick base styles from npm package
	import 'slick-carousel/slick/slick.css';
	import 'slick-carousel/slick/slick-theme.css';

	import { debugLog } from './utils/debuglog.js';

	onMount(() => {
		// Scripts are now initialized by Splashscreen component when audio element is available
		// This ensures the element exists before initialization
		debugLog('App mounted');
	});
</script>
