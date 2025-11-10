<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../../stores.js';
	import { getMusicElements } from '../../stores.js';

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
	});
</script>

<div class="folioWrapper">
	<div class="shortLeftThirds scrollThis">
			<span class="title">Gridz — <small>Perspective plugin for Photoshop</small></span>
			<blockquote>
				Drawing objects in perspective in any orientations is not an easy task. Static grids feel restrictive. Objects typically aren't neatly aligned with an imaginary set of guide-lines. Instead they face all sorts of directions all the time. This plugin will create a perspective grid. But more importantly, it will then allow the user to rotate the grid as needed so that he or she can draw all the objects they need in their proper orientations. There is no guess-work involved. There is no need for a cumbersome 3D software either. Yet, the rotations will be as mathematically accurate as can be. 
			</blockquote>
			<a class="focus extLinkBtn" href=""><img src="/img/icons/gotoURL.png" alt="Go to URL" /><span>Check on gumroad</span></a>
	</div>
	<div bind:this={videoContainer} class="wideRightThirds">
		<video bind:this={videoElement} class="largeVideo" preload="none" muted loop poster="/vid/gridzDemoCover.jpg" on:click={handleVideoClick}>
			<source src="/vid/gridzDemo.mp4" type="video/mp4">
		</video>
		<a bind:this={playBtn} class="videoPlayBtn" class:hidden={!showPlayBtn}></a>
	</div>
</div>
