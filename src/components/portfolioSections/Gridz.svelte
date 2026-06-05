<ProjectLayout layout="right" bind:mediaContainer={videoContainer}>
		<div slot="content">
			<ToolsDisplay {tools} align="left" iconsOnly={true} />
			<span class="title gridzTitle">{title} — <small>{subtitle}</small></span>
			<div class="content">
				{@html parsedMarkdown}
			</div>
			<a class="focus extLinkBtn" href={linkUrl} target="_blank"
				><img loading="lazy" src="/img/nav/gotoURL.png" alt="Go to URL" /><span>{linkText}</span></a
			>
		</div>
		<div slot="media">
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
	</ProjectLayout>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { marked } from 'marked';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';
	import { L, resolveLocalizedMarkdownPath } from '../../utils/localized.js';
	import ToolsDisplay from '../ToolsDisplay.svelte';
	import ProjectLayout from './ProjectLayout.svelte';

	export let sectionConfig = {};

	const localeStore = stores.i18n.locale;

	// Configure marked to allow HTML
	marked.setOptions({
		breaks: false,
		gfm: true
	});

	const contentModules = import.meta.glob('../../content/*.md', {
		eager: true,
		as: 'raw'
	});

	function loadMarkdown(path, loc) {
		if (!path) return '';
		const localized = resolveLocalizedMarkdownPath(path, loc);
		let raw = contentModules[`../../content/${localized}`] || '';
		if (!String(raw).trim() && loc !== 'en') {
			raw = contentModules[`../../content/${path}`] || '';
		}
		return String(raw).trim();
	}

	$: title = L(sectionConfig?.title, $localeStore);
	$: subtitle = L(sectionConfig?.subtitle, $localeStore);
	$: linkUrl = sectionConfig?.linkUrl || '';
	$: linkText = L(sectionConfig?.linkText, $localeStore);
	$: coverImage = sectionConfig?.coverImage || '';
	$: contentPath = sectionConfig?.contentPath || '';
	$: tools = sectionConfig?.tools || [];

	$: rawMarkdown = loadMarkdown(contentPath, $localeStore);
	$: parsedMarkdown = rawMarkdown ? marked.parse(rawMarkdown) : '';

	$: resolvedCoverImage = coverImage ? getAssetUrl(coverImage) : '';
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
	.gridzTitle {
		display: block;
		margin-bottom: calc(var(--safeMargin) / 2);
		font-size: 125%;
		font-variant: small-caps;
		font-family: var(--project-font-rounded);
	}

	.gridzTitle :global(small) {
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
