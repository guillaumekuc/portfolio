<div class="splashscreen-sound">
	<VolumeSlider className="volume-slider" />
	<button class="mute-button" class:isMuted on:click={handleMuteClick}></button>
</div>

<audio bind:this={ambientEl} src={ambientUrl} loop preload="auto"></audio>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { getAssetUrl } from '../utils/assets.js';
	import siteConfig from '../config/site.json';
	import VolumeSlider from './VolumeSlider.svelte';

	// --- Existing music controls ---

	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;

	const musicPlayerStore = stores.music.musicPlayer;
	$: musicPlayer = $musicPlayerStore;

	function handleMuteClick() {
		if (musicPlayer) {
			musicPlayer.muteHandler();
		}
	}

	// --- Ambient sound ---

	const ambientUrl = getAssetUrl(siteConfig.splashAmbientSound);
	const AMBIENT_VOLUME = 1;   // proportion of master volume
	const FADE_IN_MS = 1200;
	const FADE_OUT_MS = 400;
	const FADE_VOLUME_MS = 150;   // quick response to mute/volume changes

	let ambientEl;
	let ambientActive = false;    // true while splashscreen is the current screen
	let rafId = null;
	let fadeStartTime = null;
	let fadeStartVolume = 0;
	let fadeTarget = 0;
	let fadeDuration = FADE_OUT_MS;

	function effectiveVolume() {
		if (get(stores.music.isMuted)) return 0;
		return AMBIENT_VOLUME * (get(stores.music.volume) / 100);
	}

	function cancelFade() {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	}

	function animateFade(timestamp) {
		if (!fadeStartTime) fadeStartTime = timestamp;
		const progress = Math.min((timestamp - fadeStartTime) / fadeDuration, 1);
		ambientEl.volume = fadeStartVolume + (fadeTarget - fadeStartVolume) * progress;
		if (progress < 1) {
			rafId = requestAnimationFrame(animateFade);
		} else {
			rafId = null;
			if (fadeTarget === 0) ambientEl.pause();
		}
	}

	function startFade(target, duration) {
		if (!ambientEl) return;
		cancelFade();
		fadeStartTime = null;
		fadeStartVolume = ambientEl.volume;
		fadeTarget = target;
		fadeDuration = duration;
		if (target > 0 && ambientEl.paused) {
			ambientEl.play().catch(() => {});
		}
		rafId = requestAnimationFrame(animateFade);
	}

	// Responds to screen/enter changes — controls whether ambient is active
	function updateAmbientActivity() {
		if (!get(stores.navigation.hasEnteredSite)) return;
		const shouldBeActive = get(stores.navigation.currentScreen) === 'splashscreen';
		if (shouldBeActive === ambientActive) return;
		ambientActive = shouldBeActive;
		startFade(shouldBeActive ? effectiveVolume() : 0, shouldBeActive ? FADE_IN_MS : FADE_OUT_MS);
	}

	// Responds to mute/volume changes — only acts when ambient is already running
	function updateAmbientVolume() {
		if (!ambientActive) return;
		startFade(effectiveVolume(), FADE_VOLUME_MS);
	}

	let unsubScreen;
	let unsubEntered;
	let unsubMuted;
	let unsubVolume;

	onMount(() => {
		const volumeImg = new Image();
		volumeImg.src = '/img/audio-player/volume.svg';
		const muteImg = new Image();
		muteImg.src = '/img/audio-player/mute.svg';

		ambientEl.volume = 0;
		unsubScreen = stores.navigation.currentScreen.subscribe(updateAmbientActivity);
		unsubEntered = stores.navigation.hasEnteredSite.subscribe(updateAmbientActivity);
		unsubMuted = stores.music.isMuted.subscribe(updateAmbientVolume);
		unsubVolume = stores.music.volume.subscribe(updateAmbientVolume);
	});

	onDestroy(() => {
		cancelFade();
		if (unsubScreen) unsubScreen();
		if (unsubEntered) unsubEntered();
		if (unsubMuted) unsubMuted();
		if (unsubVolume) unsubVolume();
		if (ambientEl) ambientEl.pause();
	});
</script>

<style>
	.splashscreen-sound {
		/* Static values */
		--splashscreen-sound-background-color: hsla(0, 0%, 7%, 0.67);

		/* Responsive values */
		--splashscreen-sound-slider-width: 200px;
		--splashscreen-sound-icon-size: 32px;
		--splashscreen-sound-margins: 16px;
		--splashscreen-sound-padding: 6px;
		--splashscreen-sound-blur: 4px;
		--splashscreen-sound-size: 44px;

		z-index: 2;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		top: var(--splashscreen-sound-margins);
		right: var(--splashscreen-sound-margins);
		background: var(--splashscreen-sound-background-color);
		backdrop-filter: blur(var(--splashscreen-sound-blur));
		border-radius: calc(var(--splashscreen-sound-size) / 2);
		padding: var(--splashscreen-sound-padding);
		height: var(--splashscreen-sound-size);
		min-width: var(--splashscreen-sound-size);
	}

	.splashscreen-sound :global(.volume-slider) {
		width: 0;
		max-width: var(--splashscreen-sound-slider-width);
		height: calc(var(--splashscreen-sound-size) / 2);
		background: transparent;
		overflow: hidden;
		transition: width 0.3s ease, margin-right 0.3s ease;
		margin-right: 0;
	}

	.splashscreen-sound:hover :global(.volume-slider) {
		width: var(--splashscreen-sound-slider-width);
		margin-right: calc(var(--splashscreen-sound-margins) / 2);
		margin-left: calc(var(--splashscreen-sound-margins) / 2);
	}

	.splashscreen-sound .mute-button {
		width: var(--splashscreen-sound-icon-size);
		height: var(--splashscreen-sound-icon-size);
		background-image: url('/img/audio-player/volume.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: var(--splashscreen-sound-icon-size);
	}

	.splashscreen-sound .mute-button.isMuted {
		background-image: url('/img/audio-player/mute.svg');
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.splashscreen-sound {
			--splashscreen-sound-slider-width: 160px;
			--splashscreen-sound-icon-size: 28px;
			--splashscreen-sound-margins: 14px;
			--splashscreen-sound-padding: 5px;
			--splashscreen-sound-size: 38px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.splashscreen-sound {
			--splashscreen-sound-slider-width: 120px;
			--splashscreen-sound-icon-size: 24px;
			--splashscreen-sound-margins: 12px;
			--splashscreen-sound-padding: 4px;
			--splashscreen-sound-size: 32px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.splashscreen-sound {
			--splashscreen-sound-slider-width: 80px;
			--splashscreen-sound-icon-size: 20px;
			--splashscreen-sound-margins: 8px;
			--splashscreen-sound-padding: 3px;
			--splashscreen-sound-size: 26px;
		}
	}
</style>
