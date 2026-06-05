<div bind:this={startScreenElement} id="startScreen" class="startScreen">
	<div class="monogramContainer">
		<MonogramSvg />
	</div>

	<h1><span class="nameBadge">{profile.siteName}</span> {allSetPhrase}</h1>
	
	<button 
		class="volumeGroup" 
		on:click={handleVolumeToggle} 
		title={volumeTitle}
		style="--icon-mask: url('{$isMuted ? '/img/audio-player/mute.svg' : '/img/audio-player/volume.svg'}')"
	>
		<div class="volumeToggle">
			<div class="volumeIcon"></div>
		</div>
		<span class="soundStatus">{soundStatusLabel}</span>
	</button>
	
	<button bind:this={enterBtn} id="enterBtn" on:click={handleEnter}>{enterLabel}</button>
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
	import MonogramSvg from './MonogramSvg.svelte';
	import profile from '../config/profile.json';
	import { t } from '../utils/i18n.js';

	let startScreenElement;
	let enterBtn;

	const localeStore = stores.i18n.locale;

	// Subscribe to mute state for reactive icon
	const isMuted = stores.music.isMuted;
	const volume = stores.music.volume;

	$: allSetPhrase = t($localeStore, 'start.allSet');
	$: volumeTitle = t($localeStore, $isMuted ? 'start.unmute' : 'start.mute');
	$: soundStatusLabel = t($localeStore, $isMuted ? 'start.soundOff' : 'start.soundOn');
	$: enterLabel = t($localeStore, 'start.enter');

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
		background-color: var(--color-background-primary);
		color: var(--startscreen-text-primary);
		font-size: var(--fs1);
		font-family: var(--startscreen-font-primary);
		padding: 20%;
	}

	.monogramContainer {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1em;
		--monogram-color: var(--startscreen-accent-color);
		--monogram-outline-color: var(--startscreen-text-primary);
	}

	.monogramContainer :global(svg) {
		width: 80px;
		height: auto;
	}

	.monogramContainer :global(svg path) {
		stroke: var(--monogram-outline-color) !important;
		stroke-width: 4px !important;
		fill: var(--monogram-color) !important;
	}

	.startScreen h1 {
		font-size: var(--fs1);
		padding: auto;
		text-align: center;
		margin: 0;
	}

	.startScreen h1:last-of-type {
		margin-bottom: 1.5em;
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
		margin-top: 1.5em;
		transition: border 0.2s ease, background-color 0.2s ease;
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
		text-transform: lowercase;
	}

	/* Volume group container - now a button */
	.volumeGroup {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin: 0;
		padding: 8px 16px;
		border: none;
		outline: none;
		background: none;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.2s ease;
	}

	.volumeGroup:hover {
		background-color: var(--startscreen-accent-color);
	}

	.volumeGroup:hover .soundStatus {
		color: var(--color-white);
	}

	.volumeGroup:hover .volumeIcon {
		background-color: var(--color-white);
	}

	/* Volume toggle icon container */
	.volumeToggle {
		--volume-icon-size: 32px;
		width: var(--volume-icon-size);
		height: var(--volume-icon-size);
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.soundStatus {
		font-family: var(--startscreen-font-rounded);
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--startscreen-text-primary);
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.startScreen {
			padding: 15%;
		}
		
		.monogramContainer {
			margin-bottom: 0.9em;
		}

		.monogramContainer :global(svg) {
			width: 70px;
		}

		.startScreen h1:last-of-type {
			margin-bottom: 1.3em;
		}

		#enterBtn {
			margin-top: 1.3em;
		}
		
		.volumeToggle {
			--volume-icon-size: 28px;
		}

		.soundStatus {
			font-size: 13px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.startScreen {
			padding: 10%;
		}
		
		.monogramContainer {
			margin-bottom: 0.8em;
		}

		.monogramContainer :global(svg) {
			width: 60px;
		}

		.startScreen h1:last-of-type {
			margin-bottom: 1.2em;
		}

		#enterBtn {
			margin-top: 1.2em;
		}
		
		.volumeToggle {
			--volume-icon-size: 24px;
		}

		.soundStatus {
			font-size: 12px;
		}

		.volumeGroup {
			gap: 10px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.startScreen {
			padding: 5%;
		}
		
		.monogramContainer {
			margin-bottom: 0.7em;
		}

		.monogramContainer :global(svg) {
			width: 50px;
		}

		.startScreen h1:last-of-type {
			margin-bottom: 1em;
		}

		#enterBtn {
			margin-top: 1em;
		}
		
		.volumeToggle {
			--volume-icon-size: 20px;
		}

		.soundStatus {
			font-size: 11px;
		}

		.volumeGroup {
			gap: 8px;
		}
	}

	.volumeGroup:focus {
		outline: 2px solid var(--startscreen-accent-color);
		outline-offset: 2px;
	}

	.volumeIcon {
		width: 100%;
		height: 100%;
		transition: background-color 0.2s ease;
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
</style>

