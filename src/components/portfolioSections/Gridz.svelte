<div class="portfolioSectionWrapper gridzWrapper">
	<div class="shortLeftThirds scrollable">
		<span class="title gridzTitle">Gridz — <small>Perspective plugin for Photoshop</small></span>
		<blockquote>
			Drawing objects in perspective in any orientations is not an easy task. Static grids feel
			restrictive. Objects typically aren't neatly aligned with an imaginary set of guide-lines.
			Instead they face all sorts of directions all the time. This plugin will create a perspective
			grid. But more importantly, it will then allow the user to rotate the grid as needed so that he
			or she can draw all the objects they need in their proper orientations. There is no guess-work
			involved. There is no need for a cumbersome 3D software either. Yet, the rotations will be as
			mathematically accurate as can be.
		</blockquote>
		<a class="focus extLinkBtn" href="https://app.gumroad.com/guillaumekuc" target="_blank"
			><img loading="lazy" src="/img/nav/gotoURL.png" alt="Go to URL" /><span>Check on gumroad</span></a
		>
	</div>
	<div bind:this={videoContainer} class="wideRightThirds">
		<video
			bind:this={videoElement}
			class="largeVideo"
			preload="none"
			muted
			loop
			poster="/vid/guillaumekuc_gridzDemoCover.jpg"
			on:click={handleVideoClick}
		>
			<source src="/vid/guillaumekuc_gridzDemo.mp4" type="video/mp4" />
		</video>
		<button
			type="button"
			bind:this={playBtn}
			class="videoPlayBtn"
			class:hidden={!showPlayBtn}
			aria-label="Play video"
		></button>
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

		shortcuts.addScreenShortcut('gridzFolio', 'Enter', toggleVideoPlayPause);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('gridzFolio');
	});
</script>

<style>
	.gridzWrapper {
		/* Font interface variables - map global variables to local scope */
		--gridz-font-rounded: var(--ffRounded);
	}

	.gridzTitle {
		font-family: var(--gridz-font-rounded);
	}
</style>
