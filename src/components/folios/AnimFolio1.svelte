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
		videoElement = document.querySelector('#animFolio1 .largeVideo');
		playBtn = document.querySelector('#animFolio1 .videoPlayBtn');
		
		if (videoElement) {
			videoElement.addEventListener('click', handleVideoClick);
			
			// Video observer for intersection
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
	<div class="wideLeftThirds" style="position : relative;background-color : #5a5d5a; overflow:hidden; ">
			    <video class="largeVideo" preload="none" loop poster="/vid/anim/animReelPoster.png">
			      <source src="/vid/anim/animReel.mp4" type="video/mp4">
			    </video>
			    <a class="videoPlayBtn"></a>
	</div>
	<div class="shortRightThirds">
		<span class="title">Animation Demoreel<small></small></span>
			<blockquote>
				RIGS "Jin & Joe" courtesy of OnOne Animation School.<br>
				RIGS "Body mechanics Rigs" courtesy of Joe Daniels.
			</blockquote>
	</div>
</div>
