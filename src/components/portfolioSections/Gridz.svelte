<div class="portfolioSectionWrapper gridzWrapper">
	<div class="shortLeftThirds scrollable">
		<span class="title gridzTitle">{title} — <small>{subtitle}</small></span>
		<ToolsDisplay {tools} />
		<div class="content">
			{@html parsedMarkdown}
		</div>
		<a class="focus extLinkBtn" href={linkUrl} target="_blank"
			><img loading="lazy" src="/img/nav/gotoURL.png" alt="Go to URL" /><span>{linkText}</span></a
		>
	</div>
		<div bind:this={videoContainer} class="wideRightThirds">
		<video
			bind:this={videoElement}
			class="largeVideo"
			preload="none"
			muted
			loop
			poster={resolvedCoverImage}
			on:click={handleVideoClick}
		>
			<source src={videoUrl} type="video/mp4" />
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
	import { marked } from 'marked';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';
	import ToolsDisplay from '../ToolsDisplay.svelte';

	export let sectionConfig = {};

	// Configure marked to allow HTML
	marked.setOptions({
		breaks: false,
		gfm: true
	});

	// Dynamically load all markdown files
	const contentModules = import.meta.glob('../../content/*.md', { 
		eager: true, 
		as: 'raw'
	});

	// Get content from config, fallback to defaults
	const title = sectionConfig?.title || '';
	const subtitle = sectionConfig?.subtitle || '';
	const linkUrl = sectionConfig?.linkUrl || '';
	const linkText = sectionConfig?.linkText || '';
	const coverImage = sectionConfig?.coverImage || '';
	const contentPath = sectionConfig?.contentPath || '';
	const tools = sectionConfig?.tools || [];
	const rawMarkdown = contentPath ? (contentModules[`../../content/${contentPath}`] || '').trim() : '';
	const parsedMarkdown = rawMarkdown ? marked.parse(rawMarkdown) : '';

	// Resolve asset URLs
	const resolvedCoverImage = coverImage ? getAssetUrl(coverImage) : '';
	const videoUrl = getAssetUrl('/vid/guillaumekuc_gridzDemo.mp4');

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

	.content {
		font-style: normal;
	}

	:global(.tools-display) {
		margin-top: 12px;
		margin-bottom: 16px;
	}
</style>
