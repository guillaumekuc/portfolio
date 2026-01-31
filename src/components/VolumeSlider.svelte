<input
	bind:this={sliderElement}
	class={className}
	id={id}
	type="range"
	min="0"
	max="100"
	value={displayVolume}
	on:input={handleVolumeInput}
/>

<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';

	export let className = '';
	export let id = '';

	let sliderElement;

	const volumeStore = stores.music.volume;
	$: volume = $volumeStore;

	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;

	$: displayVolume = isMuted ? 0 : volume;

	const musicPlayerStore = stores.music.musicPlayer;
	$: musicPlayer = $musicPlayerStore;

	function updateSliderGradient(slider) {
		if (slider) {
			const value = slider.value;
			const min = slider.min || 0;
			const max = slider.max || 100;
			const percentage = ((value - min) / (max - min)) * 100;
			slider.style.setProperty('--value', `${percentage}%`);
		}
	}

	$: {
		if (sliderElement) {
			sliderElement.value = displayVolume;
			updateSliderGradient(sliderElement);
		}
	}

	function handleVolumeInput(e) {
		updateSliderGradient(e.target);
		if (musicPlayer) {
			musicPlayer.volumeHandler(e.target);
		}
	}

	onMount(() => {
		if (sliderElement) {
			sliderElement.value = displayVolume;
			updateSliderGradient(sliderElement);
		}
	});
</script>

