<div id="footer" class="footer" class:visible={isVisible}>
	<div id="stickyFooter" class="stickyFooter">
		<button
			id="footerPreviousBtn"
			class="footerPreviousBtn"
			class:firstTrack={isFirstTrack}
			on:click={handlePreviousClick}
		></button>
		<button id="footerPlayBtn" class="footerPlayBtn" class:isPlaying on:click={handlePlayClick}
		></button>
		<button
			id="footerNextBtn"
			class="footerNextBtn"
			class:lastTrack={isLastTrack}
			on:click={handleNextClick}
		></button>
		<button
			id="footerLoopBtn"
			class="footerLoopBtn"
			class:isLooping
			on:click={handleLoopClick}
		></button>
		<div class="volumeGroup">
			<button id="footerMuteBtn" class="muteBgMusic" class:isMuted on:click={handleMuteClick}></button>
			<input
				bind:this={footerVolumeSlider}
				id="footerVolumeSlider"
				class="footerVolumeSlider"
				type="range"
				value={displayVolume}
				on:input={handleVolumeInput}
			/>
		</div>
	</div>
</div>
<!--#footer-->

<script>
	import { onMount, onDestroy } from 'svelte';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';
	import { get } from 'svelte/store';

	// Visibility state for footer
	let isVisible = false;

	const isPlayingStore = stores.music.isPlaying;
	$: isPlaying = $isPlayingStore;

	const isLoopingStore = stores.music.isLooping;
	$: isLooping = $isLoopingStore;

	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;

	const volumeStore = stores.music.volume;
	$: volume = $volumeStore;

	$: displayVolume = isMuted ? 0 : volume;

	const currentIndexStore = stores.music.currentIndex;
	$: currentIndex = $currentIndexStore;

	const playlistLengthStore = stores.music.playlistLength;
	$: playlistLength = $playlistLengthStore;

	// Only grey out previous button if we're at the first track AND playlist is initialized
	$: isFirstTrack = playlistLength > 0 && currentIndex === 0;
	// Only grey out next button if we're at the last track AND playlist is initialized
	$: isLastTrack = playlistLength > 0 && currentIndex + 1 >= playlistLength;

	let footerVolumeSlider;

	// Get music player from store
	const musicPlayerStore = stores.music.musicPlayer;
	$: musicPlayer = $musicPlayerStore;

	// Update volume slider when display volume changes
	$: {
		if (footerVolumeSlider) {
			footerVolumeSlider.value = displayVolume;
		}
	}

	function handlePlayClick() {
		if (musicPlayer) {
			musicPlayer.playHandler();
		}
	}

	function handleMuteClick() {
		if (musicPlayer) {
			musicPlayer.muteHandler();
		}
	}

	function handleLoopClick() {
		if (musicPlayer) {
			musicPlayer.loopHandler();
		}
	}

	function handleNextClick() {
		if (musicPlayer) {
			musicPlayer.nextTrackHandler();
		}
	}

	function handlePreviousClick() {
		if (musicPlayer) {
			musicPlayer.previousTrackHandler();
		}
	}

	function handleVolumeInput(e) {
		if (musicPlayer) {
			musicPlayer.volumeHandler(e.target);
		}
	}

	onMount(() => {
		// Sync volume slider with store
		if (footerVolumeSlider) {
			footerVolumeSlider.value = displayVolume;
		}

		const cleanupSplashscreenObserver = DOM.setupSplashscreenVisibilityObserver((visible) => {
			isVisible = visible;
		});

		return () => {
			if (cleanupSplashscreenObserver) {
				cleanupSplashscreenObserver();
			}
		};
	});

	onDestroy(() => {
		// Cleanup handled in onMount return
	});
</script>

<style>
	.footer {
		/* Interface variables - map global variables to local scope */
		--bp-small-desktop: var(--breakpoint-small-desktop);
		--bp-tablet: var(--breakpoint-tablet);
		--bp-mobile: var(--breakpoint-mobile);

		/* Color interface variables */
		--footer-background-color: var(--color-background-tertiary);
		--footer-border-color: var(--color-gray-dark);
		--footer-accent-color: var(--color-accent);

		/* Responsive values (height inherits from global --header-footer-height) */
		--footer-height: var(--header-footer-height);
		--footer-button-size: 24px;
		--footer-play-button-size: 48px;
		--footer-gap: 50px;

		display: block;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--footer-height);
		width: 100%;
		color: white;
		background-color: var(--footer-background-color);
		z-index: 2;
		transform: translateY(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
		border-top: 1px solid var(--footer-border-color);
	}

	.footer.visible {
		transform: translateY(0);
		pointer-events: auto;
	}

	.stickyFooter {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--footer-gap);
		height: 100%;
	}

	.footer button {
		vertical-align: middle;
		width: var(--footer-button-size);
		height: var(--footer-button-size);
		margin-top: auto;
		margin-bottom: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		background-color: white;
		-webkit-mask-size: 100%;
		mask-size: 100%;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}

	.footer button:hover {
		background-color: var(--footer-accent-color) !important;
	}

	.volumeGroup {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.footerVolumeSlider {
		width: 180px;
		height: 10px;
	}

	.footerPreviousBtn {
		-webkit-mask-image: url('/img/audio-player/previous-track.svg');
		mask-image: url('/img/audio-player/previous-track.svg');
	}

	button.footerPlayBtn {
		width: var(--footer-play-button-size) !important;
		height: var(--footer-play-button-size) !important;
		-webkit-mask-image: url('/img/audio-player/play-arrow.svg');
		mask-image: url('/img/audio-player/play-arrow.svg');
	}

	button.footerPlayBtn.isPlaying {
		-webkit-mask-image: url('/img/audio-player/pause.svg');
		mask-image: url('/img/audio-player/pause.svg');
		animation: playingScale 2s ease-in-out infinite;
	}

	button.footerPlayBtn.isPlaying:hover {
		animation: none;
		transform: scale(1);
	}

	.footerNextBtn {
		-webkit-mask-image: url('/img/audio-player/next-track.svg');
		mask-image: url('/img/audio-player/next-track.svg');
	}

	@keyframes playingScale {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.footerLoopBtn {
		-webkit-mask-image: url('/img/audio-player/repeat.svg');
		mask-image: url('/img/audio-player/repeat.svg');
	}

	.footerLoopBtn.isLooping {
		background-color: var(--footer-accent-color);
	}

	.muteBgMusic {
		-webkit-mask-image: url('/img/audio-player/volume.svg');
		mask-image: url('/img/audio-player/volume.svg');
		/* Override global .muteBgMusic styles - remove background-image but keep background-color */
		background-image: none !important;
		background-size: unset !important;
		background-position: unset !important;
		/* Ensure white background for mask to show through */
		background-color: white !important;
	}

	.muteBgMusic.isMuted {
		-webkit-mask-image: url('/img/audio-player/mute.svg');
		mask-image: url('/img/audio-player/mute.svg');
		/* Override global .muteBgMusic.isMuted styles - remove background-image but keep background-color */
		background-image: none !important;
		background-size: unset !important;
		background-position: unset !important;
		/* Ensure white background for mask to show through */
		background-color: white !important;
	}

	/* Ensure hover state follows footer button pattern */
	.muteBgMusic:hover,
	.muteBgMusic.isMuted:hover {
		background-color: var(--footer-accent-color) !important;
		background-image: none !important;
	}

	.footerNextBtn.lastTrack {
		opacity: 20%;
		pointer-events: none;
	}

	.footerPreviousBtn.firstTrack {
		opacity: 20%;
		pointer-events: none;
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.footer {
			--footer-button-size: 20px;
			--footer-play-button-size: 40px;
			--footer-gap: 40px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.footer {
			--footer-button-size: 18px;
			--footer-play-button-size: 36px;
			--footer-gap: 30px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.footer {
			--footer-button-size: 16px;
			--footer-play-button-size: 32px;
			--footer-gap: 20px;
		}
	}
</style>
