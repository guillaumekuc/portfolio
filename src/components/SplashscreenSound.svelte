<div class="splashscreen-sound">
	<VolumeSlider className="volume-slider" />
	<button class="mute-button" class:isMuted on:click={handleMuteClick}></button>
</div>

<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
	import VolumeSlider from './VolumeSlider.svelte';

	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;

	const musicPlayerStore = stores.music.musicPlayer;
	$: musicPlayer = $musicPlayerStore;

	function handleMuteClick() {
		if (musicPlayer) {
			musicPlayer.muteHandler();
		}
	}

	onMount(() => {
		// Preload both mute/volume images to prevent flicker on toggle
		const volumeImg = new Image();
		volumeImg.src = '/img/audio-player/volume.svg';
		
		const muteImg = new Image();
		muteImg.src = '/img/audio-player/mute.svg';
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




