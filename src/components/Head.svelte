<div bind:this={loadElement} id="load"></div>

<div bind:this={startScreenElement} id="startScreen" class="startScreen">
	<h1>🙂</h1>

	<h1><span class="nameBadge">Guillaume Kuc <span class="suffix">.art</span></span> is all set.</h1>
	<button bind:this={enterBtn} id="enterBtn" on:click={handleEnter}>Enter</button>
</div>
<!--#startScreen-->

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { Animation } from '../utils/animation.js';
	import { Navigation } from '../utils/navigation.js';
	import { Loading } from '../utils/loading.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import { debugLog } from '../utils/debuglog.js';

	let loadElement;
	let startScreenElement;
	let enterBtn;

	function handleStartScreenAnimate() {
		if (startScreenElement) {
			startScreenElement.classList.add('fadeOut');
		}
	}

	function handleEnter() {
		debugLog('Enter pressed');
		// Mark that user has entered the site (enables deferred content loading)
		stores.navigation.hasEnteredSite.set(true);
		// Clear modal flag and remove shortcuts immediately when Enter is pressed
		stores.navigation.currentModal.set(null);
		shortcuts.removeModalShortcuts('startScreen');

		// Initialize scroll
		Navigation.initializeScroll();

		// Apply filtering based on current nav target (defaults to CTA target)
		const currentNavTarget = get(stores.navigation.currentNavTarget);
		if (currentNavTarget) {
			Navigation.filterPortfolioSectionsByNavTarget(currentNavTarget);
		}

		// Trigger opening animations via coordinator
		Animation.animateOpening();

		// Scrollbar is now always enabled via CSS

		// Update current screen
		stores.navigation.currentScreen.set('splashscreen');

		// Trigger music launch (will be handled by Splashscreen component)
		const event = new CustomEvent('enterPressed');
		window.dispatchEvent(event);
	}

	function triggerEnterButton() {
		if (enterBtn) {
			Animation.programmaticHover(enterBtn);
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

		// Listen for start screen animation trigger
		window.addEventListener('startScreenAnimate', handleStartScreenAnimate);
	});

	onDestroy(() => {
		// Clear modal and remove shortcuts
		stores.navigation.currentModal.set(null);
		shortcuts.removeModalShortcuts('startScreen');
		window.removeEventListener('startScreenAnimate', handleStartScreenAnimate);
	});
</script>

<style>
	#load {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 101;
		background: rgba(0, 0, 0, 1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#load::before {
		content: '';
		width: 40px;
		height: 40px;
		border: 4px solid var(--shade3);
		border-top-color: var(--shadeWhite);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	:global(#load.active) {
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}

	.startScreen {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 100;
		width: 100%;
		height: 100%;
		background-color: var(--shade1);
		color: var(--shadeWhite);
		font-size: var(--fs1);
		font-family: var(--ff2);
		padding: 20%;
	}

	.startScreen h1 {
		font-size: var(--fs1);
		padding: auto;
		text-align: center;
	}

	.startScreen button {
		padding: 20px;
		border: 3px solid var(--shadeWhite);
		box-sizing: border-box;
		color: var(--shadeWhite);
		background-color: transparent;
		border-radius: 5px;
		text-transform: uppercase;
		font-family: var(--ff3);
		font-weight: 600;
	}

	.startScreen button:hover {
		border: 3px solid var(--shadePop);
		background-color: var(--shadePop);
	}

	:global(.startScreen button.programmaticHover) {
		border: 3px solid var(--shadePop);
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
