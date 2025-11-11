<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
	
	const volumeStore = stores.music.volume;
	$: volume = $volumeStore;
	
	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;
	
	let splashscreenVolumeSlider;
	let musicPlayer;
	
	// Reactively wait for musicPlayer to be available
	$: {
		if (window.musicPlayer && !musicPlayer) {
			musicPlayer = window.musicPlayer;
			// Sync volume slider with store once musicPlayer is available
			if (splashscreenVolumeSlider) {
				splashscreenVolumeSlider.value = volume;
			}
		}
	}
	
	function handleVolumeInput(e) {
		const player = musicPlayer || window.musicPlayer;
		if (player) {
			player.volumeHandler(e.target);
		}
	}
	
	function handleMuteClick() {
		const player = musicPlayer || window.musicPlayer;
		if (player) {
			player.muteHandler();
		}
	}
	
	onMount(() => {
		// Try to get musicPlayer immediately
		if (window.musicPlayer) {
			musicPlayer = window.musicPlayer;
		}
		
		// Sync volume slider with store
		if (splashscreenVolumeSlider) {
			splashscreenVolumeSlider.value = volume;
		}
	});
</script>

<style>
	.splashSound {
		z-index: 95;
		position : absolute;
		display : flex;
		align-items: center;
		justify-content: right;
		padding-right: var(--safeMargin);
		height : var(--safeMargin);
		right : 0 ;
	}

	.splashSound input[type="range"] {
		width : calc(1920px / 6 - 2 * var(--safeMargin));
		max-width : calc(100vw / 4 - 2 * var(--safeMargin));
		height : 2px;
		background: rgba(255, 255, 255, 0.5);
	}

	.splashSound button {
		width : calc(4 / 5 * var(--safeMargin));
		height : calc(4 / 5 * var(--safeMargin));
		padding : calc(0.1 * var(--safeMargin));
		border-radius : 5px;
		border : 0px ;
		background-color: transparent;
	}

	.splashSound button:hover {
		background-color: var(--shadePop);
	}
</style>

<div id="splashSound" class="splashSound">
	<input bind:this={splashscreenVolumeSlider} id="bgVolume" type="range" value={volume} on:input={handleVolumeInput} />
	<button id="muteBgMusic" class="muteBgMusic" class:isMuted={isMuted} on:click={handleMuteClick}></button>
</div>

