<div class="splashscreen-sound">
	<input
		bind:this={splashscreenVolumeSlider}
		class="volume-slider"
		type="range"
		value={displayVolume}
		on:input={handleVolumeInput}
	/>
	<button class="mute-button" class:isMuted on:click={handleMuteClick}></button>
</div>

<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';

	const volumeStore = stores.music.volume;
	$: volume = $volumeStore;

	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;

	$: displayVolume = isMuted ? 0 : volume;

	let splashscreenVolumeSlider;

	const musicPlayerStore = stores.music.musicPlayer;
	$: musicPlayer = $musicPlayerStore;

	$: {
		if (musicPlayer && splashscreenVolumeSlider) {
			splashscreenVolumeSlider.value = displayVolume;
		}
	}

	function handleVolumeInput(e) {
		if (musicPlayer) {
			musicPlayer.volumeHandler(e.target);
		}
	}

	function handleMuteClick() {
		if (musicPlayer) {
			musicPlayer.muteHandler();
		}
	}

	onMount(() => {

		if (splashscreenVolumeSlider) {
			splashscreenVolumeSlider.value = displayVolume;
		}
	});
</script>

<style>
	.splashscreen-sound {
		--splashscreen-sound-background-color: hsla(0, 0%, 7%, 0.67);
		--splashscreen-sound-slider-width: 200px;
		--splashscreen-sound-icon-size: 32px;
		--splashscreen-sound-margins: 16px;
		--splashscreen-sound-padding: 6px;
		--splashscreen-sound-blur: 4px;
		--splashscreen-sound-size: 44px;

		z-index: 1;
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

	.splashscreen-sound .volume-slider {
		width: 0;
		max-width: var(--splashscreen-sound-slider-width);
		height: calc(var(--splashscreen-sound-size) / 2);
		background: rgba(255, 255, 255, 0.5);
		overflow: hidden;
		transition: width 0.3s ease, margin-right 0.3s ease;
		margin-right: 0;
	}

	.splashscreen-sound:hover .volume-slider {
		width: var(--splashscreen-sound-slider-width);
		margin-right: calc(var(--splashscreen-sound-margins) / 2);
		margin-left: calc(var(--splashscreen-sound-margins) / 2);
	}

	.splashscreen-sound .mute-button {
		width: var(--splashscreen-sound-icon-size);
		height: var(--splashscreen-sound-icon-size);
		background-image: url('/img/icons/volume.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: var(--splashscreen-sound-icon-size);
	}

	.splashscreen-sound .mute-button.isMuted {	
		background-image: url('/img/icons/mute.svg');
	}
</style>
