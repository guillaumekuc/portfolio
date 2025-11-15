<div
	style="display : flex; align-items : center; justify-content : center; width : 100%; height : 100%; margin : 0; padding : 0;"
>
	<div
		bind:this={videoContainer}
		style="max-width : 140vh; height : 100%; position: relative;  overflow:hidden;"
	>
		<video
			bind:this={videoElement}
			class="largeVideo"
			preload="none"
			poster="/vid/guillaumekuc_Demoguitar.png"
			style="border-radius : 15px;"
			on:click={handleVideoClick}
		>
			<source src="/vid/guillaumekuc_Demoguitar.mp4" type="video/mp4" />
			<track kind="captions" />
		</video>
		<button bind:this={playBtn} class="videoPlayBtn" class:hidden={!showPlayBtn}></button>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';

	let videoElement;
	let playBtn;
	let videoContainer;
	let showPlayBtn = true;

	function handleVideoClick() {
		if (!videoElement) return;

		if (
			videoElement.currentTime > 0 &&
			!videoElement.paused &&
			!videoElement.ended &&
			videoElement.readyState > 2
		) {
			videoElement.pause();
			showPlayBtn = true;

			const musicPlayer = get(stores.music.musicPlayer);
			const bgMusicElement = musicPlayer?.bgMusicElement;
			const unpauseWhenDone = get(stores.music.unpauseWhenDone);
			if (bgMusicElement && bgMusicElement.paused && unpauseWhenDone) {
				bgMusicElement.play();
				stores.music.isPlaying.set(true);
			}
		} else {
			videoElement.play();
			showPlayBtn = false;

			const musicPlayer = get(stores.music.musicPlayer);
			const bgMusicElement = musicPlayer?.bgMusicElement;
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
			const videoObserver = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry.intersectionRatio !== 1 && !videoElement.paused) {
						videoElement.pause();
						showPlayBtn = true;

						const musicPlayer = get(stores.music.musicPlayer);
						const bgMusicElement = musicPlayer?.bgMusicElement;
						const unpauseWhenDone = get(stores.music.unpauseWhenDone);
						if (unpauseWhenDone && bgMusicElement) {
							bgMusicElement.play();
							stores.music.isPlaying.set(true);
						}
					}
				},
				{ threshold: 1 }
			);

			videoObserver.observe(videoContainer);
		}

		shortcuts.addScreenShortcut('musicVidFolio', 'Enter', toggleVideoPlayPause);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('musicVidFolio');
	});
</script>
