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
		videoElement = document.querySelector('#musicVidFolio .largeVideo');
		playBtn = document.querySelector('#musicVidFolio .videoPlayBtn');
		
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

<div style="display : flex; align-items : center; justify-content : center; width : 100%; height : 100%; margin : 0; padding : 0;">
	<div style="max-width : 140vh; height : 100%; position: relative;  overflow:hidden;">
	<video class="largeVideo" preload="none" poster="/vid/Demoguitar.png" style="border-radius : 15px;">
			<source src="/vid/Demoguitar.mp4" type="video/mp4">
	</video>
	<a class="videoPlayBtn"></a>
</div>
	</div>
