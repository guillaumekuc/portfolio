<div bind:this={startScreenElement} id="startScreen" class="startScreen">
	<h1>🙂</h1>

	<h1><span class="nameBadge">Guillaume Kuc <span class="suffix">.art</span></span> is all set.</h1>
	<button bind:this={enterBtn} id="enterBtn" on:click={handleEnter}>Enter</button>
	
	<button 
		class="volumeToggle" 
		on:click={handleVolumeToggle} 
		title={$isMuted ? 'Unmute' : 'Mute'}
		style="--icon-mask: url('{$isMuted ? '/img/audio-player/mute.svg' : '/img/audio-player/volume.svg'}')"
	>
		<div class="volumeIcon"></div>
	</button>
</div>
<!--#startScreen-->

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { Animation } from '../utils/animation.js';
	import { Navigation } from '../utils/navigation.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import { debugLog } from '../utils/debuglog.js';
	import { Storage, STORAGE_KEYS } from '../utils/storage.js';

	let startScreenElement;
	let enterBtn;

	// Subscribe to mute state for reactive icon
	const isMuted = stores.music.isMuted;
	const volume = stores.music.volume;

	function handleStartScreenAnimate() {
		if (startScreenElement) {
			startScreenElement.classList.add('fadeOut');
		}
	}

	function handleVolumeToggle() {
		const currentMuted = get(isMuted);
		const currentVolume = get(volume);
		const hasEnteredWithMusic = get(stores.music.hasEnteredWithMusic);
		const musicPlayer = get(stores.music.musicPlayer);
		
		if (currentMuted) {
			// Unmute
			stores.music.isMuted.set(false);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, false);
			// If volume is 0, set to a default volume
			if (currentVolume === 0) {
				stores.music.volume.set(100);
				Storage.set(STORAGE_KEYS.MUSIC_VOLUME, 100);
			}
			
			// If user already entered the site but music never started, start it now
			if (hasEnteredWithMusic && musicPlayer && !get(stores.music.isPlaying)) {
				// Set volume on the audio element before playing
				if (musicPlayer.bgMusicElement) {
					musicPlayer.bgMusicElement.volume = (currentVolume === 0 ? 100 : currentVolume) / 100;
				}
				musicPlayer.play();
			}
		} else {
			// Mute
			stores.music.isMuted.set(true);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, true);
		}
		debugLog('Volume toggled from StartScreen:', get(isMuted) ? 'muted' : 'unmuted');
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
	.startScreen {
		/* Font interface variables - map global variables to local scope */
		--startscreen-font-primary: var(--ffCrimson);
		--startscreen-font-rounded: var(--ffRounded);
	}
	:global(body) {
		--head-accent-color: var(--color-accent);
	}

	.startScreen {
		/* Color interface variables */
		--startscreen-accent-color: var(--head-accent-color);
		--startscreen-background-primary: var(--color-background-primary);
		--startscreen-background-secondary: var(--color-background-secondary);
		--startscreen-text-primary: var(--color-white);
		
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 100;
		width: 100%;
		height: 100%;
		background-color: var(--startscreen-background-primary);
		color: var(--startscreen-text-primary);
		font-size: var(--fs1);
		font-family: var(--startscreen-font-primary);
		padding: 20%;
	}

	.startScreen h1 {
		font-size: var(--fs1);
		padding: auto;
		text-align: center;
	}

	#enterBtn {
		padding: 20px;
		border: 3px solid var(--startscreen-text-primary);
		box-sizing: border-box;
		color: var(--startscreen-text-primary);
		background-color: transparent;
		border-radius: 5px;
		text-transform: uppercase;
		font-family: var(--startscreen-font-rounded);
		font-weight: 600;
	}

	#enterBtn:hover {
		border: 3px solid var(--startscreen-accent-color);
		background-color: var(--startscreen-accent-color);
	}

	:global(#enterBtn.programmaticHover) {
		border: 3px solid var(--startscreen-accent-color);
		background-color: var(--startscreen-accent-color);
	}

	.nameBadge {
		padding: 2px 10px;
		background-color: var(--startscreen-background-secondary);
		border-radius: 5px;
		font-variant: small-caps;
	}

	.suffix {
		font-variant: normal;
	}

	/* Volume toggle button */
	.volumeToggle {
		--volume-icon-size: 32px;
		margin-top: 20px;
		width: var(--volume-icon-size);
		height: var(--volume-icon-size);
		padding: 0 !important;
		border: none !important;
		outline: none !important;
		background: none !important;
		box-shadow: none !important;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		text-transform: none !important;
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.volumeToggle {
			--volume-icon-size: 28px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.volumeToggle {
			--volume-icon-size: 24px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.volumeToggle {
			--volume-icon-size: 20px;
		}
	}

	.volumeToggle:focus {
		outline: none !important;
		border: none !important;
		box-shadow: none !important;
	}

	.volumeToggle:hover {
		border: none !important;
		background: none !important;
		box-shadow: none !important;
	}

	.volumeIcon {
		width: 100%;
		height: 100%;
		transition: background-color 0.3s ease;
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		background-color: var(--startscreen-text-primary);
		-webkit-mask-image: var(--icon-mask);
		mask-image: var(--icon-mask);
	}

	.volumeToggle:hover .volumeIcon {
		background-color: var(--startscreen-accent-color);
	}
</style>

