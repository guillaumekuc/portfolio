<div class="musicFolioBackground" use:parallax></div>
<div class="musicList" bind:this={listElement}>
	<ul class="musicPlaylist" aria-label="Playlist">
		{#each collections as collection, collectionIndex}
			<li class="collectionSeparator" aria-hidden="true">
				{collection.name}
				{#if collection.subtitle}
					<span class="separatorSubtitle">{collection.subtitle}</span>
				{/if}
			</li>
			{#each collection.tracks as track, trackIndex}
				<li
					class:focus={currentCollectionIndex === collectionIndex && currentTrackIndex === trackIndex}
					data-global-track-index={globalTrackIndex(collectionIndex, trackIndex)}
				>
					<button type="button" class="musicPlaylistButton" on:click={() => handleTrackClick(collectionIndex, trackIndex)}>
						<span class="trackNumber">{globalTrackIndex(collectionIndex, trackIndex) + 1} · </span>
						<span class="trackTitle">{track.title}</span>
						<i class="playIcon"></i>
					</button>
				</li>
			{/each}
		{/each}
	</ul>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';
	import { collectionDisplayName, L } from '../../utils/localized.js';
	import { parallax } from '../../utils/parallax.js';

	export let sectionConfig;

	const localeStore = stores.i18n.locale;

	const currentCollectionIndexStore = stores.music.currentCollectionIndex;
	$: currentCollectionIndex = $currentCollectionIndexStore;

	const currentTrackIndexStore = stores.music.currentTrackIndex;
	$: currentTrackIndex = $currentTrackIndexStore;

	let musicPlayer;
	let bgMusicElement;
	let listElement;

	$: collections = sectionConfig.collections.map(collection => ({
		...collection,
		name: collectionDisplayName($localeStore, collection.name),
		subtitle: L(collection.subtitle, $localeStore),
		image: getAssetUrl(collection.image),
		tracks: collection.tracks.map(track => ({
			...track,
			sound: getAssetUrl(track.sound)
		}))
	}));

	$: stores.music.collections.set(collections);
	$: stores.music.tracks.set(collections.flatMap((col, idx) =>
		col.tracks.map(track => ({ ...track, image: col.image, collectionIndex: idx }))
	));
	$: stores.music.currentIndex.set(collections.reduce((acc, col, idx) =>
		idx < currentCollectionIndex ? acc + col.tracks.length :
		idx === currentCollectionIndex ? acc + currentTrackIndex : acc, 0
	));

	function globalTrackIndex(collectionIdx, trackIdx) {
		return collections.slice(0, collectionIdx).reduce((sum, c) => sum + c.tracks.length, 0) + trackIdx;
	}

	function playTrack(collectionIdx, trackIdx) {
		const track = collections[collectionIdx].tracks[trackIdx];
		stores.music.currentCollectionIndex.set(collectionIdx);
		stores.music.currentTrackIndex.set(trackIdx);
		stores.music.trackImage.set(collections[collectionIdx].image);

		bgMusicElement.pause();
		bgMusicElement.setAttribute('src', track.sound);
		bgMusicElement.load();

		const playWhenReady = () => {
			bgMusicElement.removeEventListener('canplay', playWhenReady);
			musicPlayer.play();
		};
		bgMusicElement.addEventListener('canplay', playWhenReady);
		if (bgMusicElement.readyState >= 3) {
			playWhenReady();
		}
	}

	function handleTrackClick(collectionIdx, trackIdx) {
		playTrack(collectionIdx, trackIdx);
	}

	function scrollToTrack(collectionIdx, trackIdx) {
		const globalIdx = globalTrackIndex(collectionIdx, trackIdx);
		const el = listElement?.querySelector(`[data-global-track-index="${globalIdx}"]`);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}

	function playNextTrack() {
		const currentCollection = collections[currentCollectionIndex];
		if (currentTrackIndex + 1 < currentCollection.tracks.length) {
			playTrack(currentCollectionIndex, currentTrackIndex + 1);
			scrollToTrack(currentCollectionIndex, currentTrackIndex + 1);
		} else if (currentCollectionIndex + 1 < collections.length) {
			playTrack(currentCollectionIndex + 1, 0);
			scrollToTrack(currentCollectionIndex + 1, 0);
		}
	}

	function playPreviousTrack() {
		if (currentTrackIndex > 0) {
			playTrack(currentCollectionIndex, currentTrackIndex - 1);
			scrollToTrack(currentCollectionIndex, currentTrackIndex - 1);
		} else if (currentCollectionIndex > 0) {
			const prevIdx = currentCollectionIndex - 1;
			playTrack(prevIdx, collections[prevIdx].tracks.length - 1);
			scrollToTrack(prevIdx, collections[prevIdx].tracks.length - 1);
		}
	}

	onMount(() => {
		musicPlayer = get(stores.music.musicPlayer);
		bgMusicElement = musicPlayer.bgMusicElement;

		stores.music.playlistLength.set(collections.reduce((sum, col) => sum + col.tracks.length, 0));
		stores.music.trackImage.set(collections[0].image);

		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowRight', playNextTrack, true);
		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowLeft', playPreviousTrack, true);

	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('musicPlaylistFolio');
	});
</script>

<style>
	.musicList {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 450px;
		margin: 0 auto;
		height: calc(100vh - 2 * (var(--header-footer-height) + var(--safeMargin)));
		padding: 0;
		box-sizing: border-box;
		background-color: oklch(18% 0 0 / 0.67);
		background-blend-mode: luminosity;
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		padding: 0 calc(var(--safeMargin) / 2);
		border-radius: var(--radius-large);
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: rgba(170, 170, 170, 0.3) transparent;
	}

	.musicList::-webkit-scrollbar { width: 6px; }
	.musicList::-webkit-scrollbar-track { background: transparent; }
	.musicList::-webkit-scrollbar-thumb {
		background-color: rgba(170, 170, 170, 0.3);
		border-radius: var(--radius-small);
		transition: background-color 0.2s ease;
	}
	.musicList::-webkit-scrollbar-thumb:hover { background-color: rgba(170, 170, 170, 0.5); }

	:global(#musicPlaylistFolio) {
		position: relative;
	}

	.musicFolioBackground {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-image: url('/img/portfolio/guillaumekuc_artTemple_M.jpg');
		background-size: cover;
		background-position: center;
	}

	.musicPlaylist {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.collectionSeparator {
		font-size: 130%;
		font-weight: bold;
		font-variant: small-caps;
		font-family: var(--ffRounded);
		padding: 1.2em 0 0.4em calc(var(--safeMargin) / 2);
		color: var(--color-white);
		pointer-events: none;
		user-select: none;
	}

	.separatorSubtitle {
		display: block;
		font-size: 65%;
		font-weight: normal;
		font-variant: normal;
		color: var(--color-gray-light);
		margin-top: 0.2em;
	}

	.musicPlaylist li {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}

	.playIcon {
		flex-shrink: 0;
		display: inline-block;
		background: url('/img/audio-player/play_alt.png') center center no-repeat;
		background-size: 80%;
		vertical-align: middle;
		width: 1em;
		height: 1em;
		margin-left: auto;
	}

	.musicPlaylistButton {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		text-align: left;
		line-height: 1;
		vertical-align: middle;
		border-radius: var(--radius-medium);
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		padding-left: calc(var(--safeMargin) / 2);
		padding-right: calc(var(--safeMargin) / 2);
		width: 100%;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		gap: 0.5em;
	}

	.trackNumber {
		flex-shrink: 0;
		color: var(--color-gray-light);
		font-size: 0.9em;
	}

	.trackTitle {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	.musicPlaylistButton:hover {
		background-color: var(--color-accent);
	}
	.musicPlaylistButton:hover .trackNumber {
		color: var(--color-white);
	}
	.musicPlaylist li.focus .musicPlaylistButton {
		background-color: var(--color-background-secondary);
	}
	.musicPlaylist li.focus .musicPlaylistButton:hover {
		background-color: var(--color-accent);
	}
	.musicPlaylist li.focus .musicPlaylistButton:hover .trackNumber {
		color: var(--color-white);
	}
	.musicPlaylist li.focus .playIcon {
		background: none;
		background-color: var(--color-white);
		-webkit-mask-image: url('/img/audio-player/pause2.svg');
		mask-image: url('/img/audio-player/pause2.svg');
		-webkit-mask-size: 100%;
		mask-size: 100%;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}
</style>
