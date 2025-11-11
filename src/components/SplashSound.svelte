<div id="splashSound" class="splashSound">
	<input
		bind:this={splashscreenVolumeSlider}
		id="bgVolume"
		type="range"
		value={volume}
		on:input={handleVolumeInput}
	/>
	<button id="muteBgMusic" class="muteBgMusic" class:isMuted on:click={handleMuteClick}></button>
</div>

<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
	import { get } from 'svelte/store';

	const volumeStore = stores.music.volume;
	$: volume = $volumeStore;

	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;

	let splashscreenVolumeSlider;

	// Get music player from store
	const musicPlayerStore = stores.music.musicPlayer;
	$: musicPlayer = $musicPlayerStore;

	// Sync volume slider when musicPlayer becomes available
	$: {
		if (musicPlayer && splashscreenVolumeSlider) {
			splashscreenVolumeSlider.value = volume;
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
		// Sync volume slider with store
		if (splashscreenVolumeSlider) {
			splashscreenVolumeSlider.value = volume;
		}
	});
</script>

<style>
	.splashSound {
		z-index: 95;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: right;
		padding-right: var(--safeMargin);
		height: var(--safeMargin);
		right: 0;
	}

	.splashSound input[type='range'] {
		width: calc(1920px / 6 - 2 * var(--safeMargin));
		max-width: calc(100vw / 4 - 2 * var(--safeMargin));
		height: 2px;
		background: rgba(255, 255, 255, 0.5);
	}

	.splashSound button {
		width: calc(4 / 5 * var(--safeMargin));
		height: calc(4 / 5 * var(--safeMargin));
		padding: calc(0.1 * var(--safeMargin));
		border-radius: 5px;
		border: 0px;
		background-color: transparent;
	}

	.splashSound button:hover {
		background-color: var(--shadePop);
	}
</style>
