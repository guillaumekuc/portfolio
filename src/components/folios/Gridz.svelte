<script>
	import { onMount } from 'svelte';
	import { bgMusicIsPlaying, unpauseMusicWhenDone } from '../../stores.js';
	import { getMusicElements } from '../../stores.js';

	let videoElement;
	let playBtn;

	function handleVideoClick() {
		if (!videoElement) return;
		
		if (videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2) {
			videoElement.pause();
			if (playBtn) playBtn.classList.remove('hidden');
			
			const { bgMusicElement, footerPlayBtn } = getMusicElements();
			if (bgMusicElement && bgMusicElement.paused && unpauseMusicWhenDone) {
				bgMusicElement.play();
				bgMusicIsPlaying.set(true);
				if (footerPlayBtn) footerPlayBtn.classList.add('isPlaying');
			}
		} else {
			videoElement.play();
			if (playBtn) playBtn.classList.add('hidden');
			
			const { bgMusicElement, footerPlayBtn } = getMusicElements();
			if (bgMusicIsPlaying && !videoElement.muted && bgMusicElement) {
				bgMusicElement.pause();
				bgMusicIsPlaying.set(false);
				if (footerPlayBtn) footerPlayBtn.classList.remove('isPlaying');
				unpauseMusicWhenDone.set(true);
			} else {
				unpauseMusicWhenDone.set(false);
			}
		}
	}

	onMount(() => {
		videoElement = document.querySelector('#gridzFolio .largeVideo');
		playBtn = document.querySelector('#gridzFolio .videoPlayBtn');
		
		if (videoElement) {
			videoElement.addEventListener('click', handleVideoClick);
			
			// Video observer
			const videoObserver = new IntersectionObserver((entries) => {
				const entry = entries[0];
				if (entry.intersectionRatio !== 1 && !videoElement.paused) {
					videoElement.pause();
					if (playBtn) playBtn.classList.remove('hidden');
					
					const { bgMusicElement, footerPlayBtn } = getMusicElements();
					if (unpauseMusicWhenDone && bgMusicElement) {
						bgMusicElement.play();
						bgMusicIsPlaying.set(true);
						if (footerPlayBtn) footerPlayBtn.classList.add('isPlaying');
					}
				}
			}, { threshold: 1 });
			
			if (videoElement.parentElement) {
				videoObserver.observe(videoElement.parentElement);
			}
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
	<div class="wideRightThirds">
		<video class="largeVideo" preload="none" muted loop poster="/vid/gridzDemoCover.jpg">
			<source src="/vid/gridzDemo.mp4" type="video/mp4">
		</video>
	 	<a class="videoPlayBtn"></a>
	</div>
</div>
