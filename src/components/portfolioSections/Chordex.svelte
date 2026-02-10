<ProjectLayout layout="left" bind:mediaContainer={mediaContainer}>
		<div slot="media">
			{#if videoUrl}
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
			{:else}
				<img
					class="largeImage"
					src={resolvedCoverImage}
					alt={title}
					loading="lazy"
				/>
			{/if}
		</div>
		<div slot="content">
			{#if tools && tools.length > 0}
				<ToolsDisplay {tools} align="right" iconsOnly={true} />
			{/if}
			<span class="chordexTitle">{title} — <small>{subtitle}</small></span>
			<div class="content">
				{@html parsedMarkdown}
			</div>
			{#if linkUrl}
				<a class="focus extLinkBtn" href={linkUrl} target="_blank"
					><img loading="lazy" src="/img/nav/gotoURL.png" alt="Go to URL" /><span>{linkText}</span></a
				>
			{/if}
		</div>
	</ProjectLayout>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { marked } from 'marked';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';
	import ToolsDisplay from '../ToolsDisplay.svelte';
	import ProjectLayout from './ProjectLayout.svelte';

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
	const linkUrl = sectionConfig?.linkUrl || sectionConfig?.link || '';
	const linkText = sectionConfig?.linkText || sectionConfig?.cta || '';
	const coverImage = sectionConfig?.coverImage || '';
	const contentPath = sectionConfig?.contentPath || '';
	const tools = sectionConfig?.tools || [];
	const videoPath = sectionConfig?.videoPath || '';
	const rawMarkdown = contentPath ? (contentModules[`../../content/${contentPath}`] || '').trim() : '';
	const parsedMarkdown = rawMarkdown ? marked.parse(rawMarkdown) : '';

	// Resolve asset URLs
	const resolvedCoverImage = coverImage ? getAssetUrl(coverImage) : '';
	const videoUrl = videoPath ? getAssetUrl(videoPath) : '';

	let videoElement;
	let playBtn;
	let mediaContainer;
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
		if (videoElement) {
			handleVideoClick();
		}
	}

	onMount(() => {
		if (videoElement && mediaContainer) {
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

			videoObserver.observe(mediaContainer);
		}

		if (videoUrl) {
			shortcuts.addScreenShortcut('chordex', 'Enter', toggleVideoPlayPause);
		}
	});

	onDestroy(() => {
		if (videoUrl) {
			shortcuts.removeScreenShortcuts('chordex');
		}
	});
</script>

<style>
	.chordexTitle {
		display: block;
		margin-bottom: calc(var(--safeMargin) / 2);
		font-size: 125%;
		font-variant: small-caps;
		font-family: var(--project-font-rounded);
	}

	.chordexTitle :global(small) {
		font-size: 0.7em;
	}

	.content {
		font-style: normal;
		text-align: justify;
	}

	:global(.tools-display) {
		margin-bottom: 6px;
	}
</style>

