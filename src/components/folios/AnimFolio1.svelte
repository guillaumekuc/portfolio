<script>
	import { onMount } from 'svelte';
	import { stores } from '../../stores.js';
	import { getMusicElements } from '../../stores.js';

	let videoElement;
	let playBtn;

	function handleVideoClick() {
		if (!videoElement) return;
		
		if (videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2) {
			videoElement.pause();
			if (playBtn) playBtn.classList.remove('hidden');
			
			const { bgMusicElement, footerPlayBtn } = getMusicElements();
			let unpauseWhenDone;
			stores.music.unpauseWhenDone.subscribe(value => unpauseWhenDone = value)();
			if (bgMusicElement && bgMusicElement.paused && unpauseWhenDone) {
				bgMusicElement.play();
				stores.music.isPlaying.set(true);
				if (footerPlayBtn) footerPlayBtn.classList.add('isPlaying');
			}
		} else {
			videoElement.play();
			if (playBtn) playBtn.classList.add('hidden');
			
			const { bgMusicElement, footerPlayBtn } = getMusicElements();
			let isPlaying;
			stores.music.isPlaying.subscribe(value => isPlaying = value)();
			if (isPlaying && !videoElement.muted && bgMusicElement) {
				bgMusicElement.pause();
				stores.music.isPlaying.set(false);
				if (footerPlayBtn) footerPlayBtn.classList.remove('isPlaying');
				stores.music.unpauseWhenDone.set(true);
			} else {
				stores.music.unpauseWhenDone.set(false);
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
					let unpauseWhenDone;
					stores.music.unpauseWhenDone.subscribe(value => unpauseWhenDone = value)();
					if (unpauseWhenDone && bgMusicElement) {
						bgMusicElement.play();
						stores.music.isPlaying.set(true);
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
