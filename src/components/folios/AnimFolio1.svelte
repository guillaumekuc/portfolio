<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../../stores.js';
	import { getMusicElements } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';

	let videoElement;
	let playBtn;
	let videoContainer;
	let showPlayBtn = true;

	function handleVideoClick() {
		if (!videoElement) return;
		
		if (videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2) {
			videoElement.pause();
			showPlayBtn = true;
			
			const { bgMusicElement } = getMusicElements();
			const unpauseWhenDone = get(stores.music.unpauseWhenDone);
			if (bgMusicElement && bgMusicElement.paused && unpauseWhenDone) {
				bgMusicElement.play();
				stores.music.isPlaying.set(true);
			}
		} else {
			videoElement.play();
			showPlayBtn = false;
			
			const { bgMusicElement } = getMusicElements();
			const isPlaying = get(stores.music.isPlaying);
			if (isPlaying && !videoElement.muted && bgMusicElement) {
				bgMusicElement.pause();
				stores.music.isPlaying.set(false);
				stores.music.unpauseWhenDone.set(true);
			} else {
				stores.music.unpauseWhenDone.set(false);
			}
		}
	}

	function toggleVideoPlayPause() {
		handleVideoClick();
	}

	onMount(() => {
		if (videoElement && videoContainer) {
			// Video observer for intersection
			const videoObserver = new IntersectionObserver((entries) => {
				const entry = entries[0];
				if (entry.intersectionRatio !== 1 && !videoElement.paused) {
					videoElement.pause();
					showPlayBtn = true;
					
					const { bgMusicElement } = getMusicElements();
					const unpauseWhenDone = get(stores.music.unpauseWhenDone);
					if (unpauseWhenDone && bgMusicElement) {
						bgMusicElement.play();
						stores.music.isPlaying.set(true);
					}
				}
			}, { threshold: 1 });
			
			videoObserver.observe(videoContainer);
		}

		shortcuts.addScreenShortcut('animFolio1', 'Enter', toggleVideoPlayPause);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('animFolio1');
	});
</script>

<div class="folioWrapper">
	<div bind:this={videoContainer} class="wideLeftThirds" style="position : relative;background-color : #5a5d5a; overflow:hidden; ">
		<video bind:this={videoElement} class="largeVideo" preload="none" loop poster="/vid/anim/animReelPoster.png" on:click={handleVideoClick}>
			<source src="/vid/anim/animReel.mp4" type="video/mp4">
		</video>
		<a bind:this={playBtn} class="videoPlayBtn" class:hidden={!showPlayBtn}></a>
	</div>
	<div class="shortRightThirds">
		<span class="title">Animation Demoreel<small></small></span>
			<blockquote>
				RIGS "Jin & Joe" courtesy of OnOne Animation School.<br>
				RIGS "Body mechanics Rigs" courtesy of Joe Daniels.
			</blockquote>
	</div>
</div>
