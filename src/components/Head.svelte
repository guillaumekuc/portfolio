<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
	import { Animation } from '../utils/animation.js';
	import { Navigation } from '../utils/navigation.js';
	import { Loading } from '../utils/loading.js';

	let loadElement;
	let startScreenElement;
	let enterBtn;

	function handleEnter() {
		// Initialize scroll
		Navigation.initializeScroll();
		
		// Hide all folios
		document.querySelectorAll('.folio').forEach(function(folio) { 
			folio.classList.add('hidden');
		});
		
		// Animate opening
		Animation.animateOpening({
			startScreen: startScreenElement,
			art: document.querySelector('#splashArt'),
			title: document.querySelector('#splashTitle'),
			subtitle: document.querySelector('#splashSubTitle'),
			oneLiner: document.querySelector('#splashDescription'),
			domains: document.querySelector('#splashDomains'),
			splashNav: document.querySelector('#splashNav'),
			splashLinks: document.querySelectorAll('.splashLinks a'),
			splashNavLinks: document.querySelectorAll('.splashNav a')
		});
		
		// Display scrollbar
		document.body.style.overflow = 'auto';
		
		// Update current screen
		stores.navigation.currentScreen.set('splashscreen');
		
		// Trigger music launch (will be handled by Splashscreen component)
		const event = new CustomEvent('enterPressed');
		window.dispatchEvent(event);
	}

	onMount(() => {
		loadElement = document.getElementById('load');
		startScreenElement = document.getElementById('startScreen');
		enterBtn = document.getElementById('enterBtn');
		
		if (enterBtn) {
			enterBtn.addEventListener('click', handleEnter);
		}
		
		// Initialize loading screen
		Loading.initLoadingScreen(loadElement);
	});
</script>

<style>
	#load{
		width:100%;
		height:100%;
		position:fixed;
		z-index:101;
		background:url(img/icons/preloader.svg) no-repeat center center rgba(0,0,0,1)
	}

	:global(#load.active) {
		opacity:0;
		transition: opacity 0.5s ease-in-out;
	}

	.startScreen {
		position:fixed;
		display : flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 100;
		width: 100%;
		height : 100%;
		background-color: var(--shade1);
		color : var(--shadeWhite);
		font-size: var(--fs1);
		font-family: var(--ff2);
		padding: 20%;
	}

	.startScreen h1 {
		font-size: var(--fs1);
		padding : auto;
		text-align: center;
	}

	.startScreen button {
		padding : 20px;
		border : 3px solid var(--shadeWhite);
		box-sizing: border-box; 
		color: var(--shadeWhite);
		background-color: transparent ; 
		border-radius: 5px;
		text-transform: uppercase;
		font-family: var(--ff3);
		font-weight: 600;
	}

	.startScreen button:hover {
		border : 3px solid var(--shadePop);
		background-color: var(--shadePop);
	}

	:global(.startScreen button.fakeHoverEvent) {
		border : 3px solid var(--shadePop);
		background-color: var(--shadePop);
	}
</style>

<div id="load"></div>

<div id="startScreen" class="startScreen">
	<h1>🙂</h1>
	<h1><span style="padding : 2px 10px; background-color : var(--shade2); border-radius : 5px ; font-variant:small-caps;">Guillaume Kuc <span style="font-variant : normal	;">.art</span></span> is all set.</h1>
	<button id="enterBtn">Enter</button>
</div><!--#startScreen-->
