<script>
	import { onMount, onDestroy } from 'svelte';
	import { stores } from '../stores.js';
	import { Animation } from '../utils/animation.js';
	import { Navigation } from '../utils/navigation.js';
	import { Loading } from '../utils/loading.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import { debugLog } from '../utils/debuglog.js';

	let loadElement;
	let startScreenElement;
	let enterBtn;

	function handleEnter() {
		debugLog('Enter pressed');
		// Clear modal flag and remove shortcuts immediately when Enter is pressed
		stores.navigation.currentModal.set(null);
		shortcuts.removeModalShortcuts('startScreen');
		
		// Initialize scroll
		Navigation.initializeScroll();
		
		// Hide all folios (cross-component, so querySelector is acceptable)
		const folios = document.querySelectorAll('.folio');
		folios.forEach(folio => folio.classList.add('hidden'));
		
		// Get animation elements (cross-component access - acceptable for sibling components)
		// Using querySelector is fine here since Head and Splashscreen are siblings
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

	function triggerEnterButton() {
		if (enterBtn) {
			Animation.fakeHoverEvent(enterBtn);
			enterBtn.click();
		}
	}

	onMount(() => {
		// Initialize loading screen
		if (loadElement) {
			Loading.initLoadingScreen(loadElement);
		}

		// Set startScreen as the current modal
		stores.navigation.currentModal.set('startScreen');

		// Register Enter as modal shortcut
		shortcuts.addModalShortcut('startScreen', 'Enter', triggerEnterButton);
	});

	onDestroy(() => {
		// Clear modal and remove shortcuts
		stores.navigation.currentModal.set(null);
		shortcuts.removeModalShortcuts('startScreen');
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

	.nameBadge {
		padding: 2px 10px;
		background-color: var(--shade2);
		border-radius: 5px;
		font-variant: small-caps;
	}

	.suffix {
		font-variant: normal;
	}
</style>

<div bind:this={loadElement} id="load"></div>

	<div bind:this={startScreenElement} id="startScreen" class="startScreen">
	<h1>🙂</h1>
	
	<h1><span class="nameBadge">Guillaume Kuc <span class="suffix">.art</span></span> is all set.</h1>
	<button bind:this={enterBtn} id="enterBtn" on:click={handleEnter}>Enter</button>
</div><!--#startScreen-->
