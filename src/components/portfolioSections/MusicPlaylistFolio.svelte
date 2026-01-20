<div class="musicCollectionsGallery">
	{#each collections as collection, collectionIndex}
		<div class="musicPlaylistPanel" data-collection-index={collectionIndex}>
			<div class="musicPlaylistHeader">
				{#if collection.image}
					<img src={collection.image} alt="Vinyl disc" class="vinylDisc" bind:this={vinylDiscElements[collectionIndex]} style="transform: rotate({collectionRotations[collectionIndex] || 0}deg);" />
				{/if}
				<div class="musicPlaylistTitle">{collection.name}</div>
				{#if collection.subtitle}
					<div class="musicPlaylistSubtitle">{collection.subtitle}</div>
				{/if}
			</div>
			<ul class="musicPlaylist" aria-label="Fragments" data-collection-index={collectionIndex}>
				{#each collection.tracks as track, trackIndex}
					<li class:focus={currentCollectionIndex === collectionIndex && currentTrackIndex === trackIndex}>
						<button type="button" class="musicPlaylistButton" on:click={() => handleTrackClick(collectionIndex, trackIndex)}>
							<span class="trackNumber">{trackIndex + 1} · </span>
							<span class="trackTitle">{track.title}</span>
							<i class="playIcon"></i>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';

	export let sectionConfig;

	const currentCollectionIndexStore = stores.music.currentCollectionIndex;
	$: currentCollectionIndex = $currentCollectionIndexStore;

	const currentTrackIndexStore = stores.music.currentTrackIndex;
	$: currentTrackIndex = $currentTrackIndexStore;

	const isPlayingStore = stores.music.isPlaying;
	$: isPlaying = $isPlayingStore;

	let musicPlayer;
	let bgMusicElement;
	let galleryElement = null;
	let vinylDiscElements = [];
	let collectionRotations = [];
	let animationFrameIds = [];
	let lastTimestamps = [];
	let slickInitialized = false;
	let isUpdatingFromSlick = false;
	
	const ROTATION_SPEED = 360 / 3;

	$: collections = sectionConfig.collections.map(collection => ({
		...collection,
		image: getAssetUrl(collection.image),
		tracks: collection.tracks.map(track => ({
			...track,
			sound: getAssetUrl(track.sound)
		}))
	}));

	$: if (collections.length > 0) {
		collectionRotations = Array(collections.length).fill(0);
		lastTimestamps = Array(collections.length).fill(null);
		animationFrameIds = Array(collections.length).fill(null);
		vinylDiscElements = Array(collections.length).fill(null);
	}

	$: stores.music.collections.set(collections);
	$: stores.music.tracks.set(collections.flatMap((col, idx) => 
		col.tracks.map(track => ({ ...track, image: col.image, collectionIndex: idx }))
	));
	$: stores.music.currentIndex.set(collections.reduce((acc, col, idx) => 
		idx < currentCollectionIndex ? acc + col.tracks.length : 
		idx === currentCollectionIndex ? acc + currentTrackIndex : acc, 0
	));

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

	function syncSlick(collectionIdx) {
		if (isUpdatingFromSlick) return;
		const $gallery = window.$(galleryElement);
		if ($gallery.slick('slickCurrentSlide') !== collectionIdx) {
			$gallery.slick('slickGoTo', collectionIdx, true);
		}
	}

	function handleTrackClick(collectionIdx, trackIdx) {
		playTrack(collectionIdx, trackIdx);
		syncSlick(collectionIdx);
	}

	function scrollToTrack(collectionIdx, trackIdx) {
		const playlist = document.querySelector(`.musicPlaylist[data-collection-index="${collectionIdx}"]`);
		playlist.querySelectorAll('li')[trackIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

	function animateRotation(collectionIdx, timestamp) {
		if (!lastTimestamps[collectionIdx]) {
			lastTimestamps[collectionIdx] = timestamp;
		}
		
		const deltaTime = (timestamp - lastTimestamps[collectionIdx]) / 1000;
		lastTimestamps[collectionIdx] = timestamp;
		
		const playing = get(stores.music.isPlaying);
		const currentIdx = get(stores.music.currentCollectionIndex);
		
		if (playing && currentIdx === collectionIdx) {
			collectionRotations[collectionIdx] += ROTATION_SPEED * deltaTime;
			if (collectionRotations[collectionIdx] >= 360) {
				collectionRotations[collectionIdx] -= 360;
			}
			collectionRotations = collectionRotations;
			animationFrameIds[collectionIdx] = requestAnimationFrame((ts) => animateRotation(collectionIdx, ts));
		} else if (animationFrameIds[collectionIdx]) {
			cancelAnimationFrame(animationFrameIds[collectionIdx]);
			animationFrameIds[collectionIdx] = null;
			lastTimestamps[collectionIdx] = null;
		}
	}

	$: if (isPlaying && currentCollectionIndex >= 0 && vinylDiscElements[currentCollectionIndex] && !animationFrameIds[currentCollectionIndex]) {
		lastTimestamps[currentCollectionIndex] = null;
		animationFrameIds[currentCollectionIndex] = requestAnimationFrame((ts) => animateRotation(currentCollectionIndex, ts));
	}
	
	$: if (!isPlaying || currentCollectionIndex < 0) {
		animationFrameIds.forEach((id, idx) => {
			if (id) {
				cancelAnimationFrame(id);
				animationFrameIds[idx] = null;
				lastTimestamps[idx] = null;
			}
		});
	}
	
	$: animationFrameIds.forEach((id, idx) => {
		if (idx !== currentCollectionIndex && id) {
			cancelAnimationFrame(id);
			animationFrameIds[idx] = null;
			lastTimestamps[idx] = null;
		}
	});

	$: if (galleryElement && !isUpdatingFromSlick && slickInitialized) {
		syncSlick(currentCollectionIndex);
	}

	onMount(() => {
		musicPlayer = get(stores.music.musicPlayer);
		bgMusicElement = musicPlayer.bgMusicElement;

		setTimeout(() => {
			galleryElement = document.querySelector('.musicCollectionsGallery');
			window.$(galleryElement).slick({
				dots: false,
				infinite: false,
				speed: 300,
				slidesToShow: 1,
				centerMode: true,
				variableWidth: true,
				arrows: false,
				centerPadding: '60px',
				draggable: true,
				swipe: true,
				accessibility: false,
				cssEase: 'ease',
				useCSS: true
			});
			slickInitialized = true;

			window.$(galleryElement).on('afterChange', (event, slick, currentSlide) => {
				if (currentSlide !== currentCollectionIndex) {
					isUpdatingFromSlick = true;
					stores.music.currentCollectionIndex.set(currentSlide);
					stores.music.currentTrackIndex.set(0);
					if (isPlaying) {
						const newCollection = collections[currentSlide];
						bgMusicElement.pause();
						bgMusicElement.setAttribute('src', newCollection.tracks[0].sound);
						stores.music.trackImage.set(newCollection.image);
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
					setTimeout(() => { isUpdatingFromSlick = false; }, 100);
				}
			});
		}, 300);

		stores.music.playlistLength.set(collections.reduce((sum, col) => sum + col.tracks.length, 0));
		stores.music.trackImage.set(collections[0].image);

		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowRight', playNextTrack, true);
		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowLeft', playPreviousTrack, true);
	});

	onDestroy(() => {
		animationFrameIds.forEach(id => cancelAnimationFrame(id));
		window.$(galleryElement).slick('unslick');
		shortcuts.removeScreenShortcuts('musicPlaylistFolio');
	});
</script>

<style>
	.musicCollectionsGallery {
		width: 100%;
	}

	.musicPlaylistPanel {
		--music-playlist-font-rounded: var(--ffRounded);
		--music-playlist-radius: var(--radius-large);
		--music-playlist-accent-color: var(--color-accent);
		--music-playlist-text-primary: var(--color-white);
		--music-playlist-background-secondary: var(--color-background-secondary);
		--music-playlist-overlay: var(--color-overlay);
		--music-playlist-margin: calc(var(--header-footer-height) + var(--safeMargin));
		
		display: flex !important;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 0 var(--safeMargin);
		box-sizing: border-box;
		overflow: hidden;
		margin: 0 auto;
	}

	.musicPlaylistHeader {
		flex-shrink: 0;
	}

	.musicPlaylist {
		font-size: 100%;
		list-style-type: none;
		margin-top: 15px;
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: rgba(170, 170, 170, 0.3) transparent;
	}

	@media (max-height: 950px) {
		.vinylDisc { width: 100px; height: 100px; }
		.musicPlaylist { margin-top: 12px; }
		.musicPlaylistTitle { font-size: 135%; }
		.musicPlaylistSubtitle { font-size: 85%; }
		.musicPlaylist li { margin-top: 0.2em; margin-bottom: 0.2em; }
		.musicPlaylistButton { padding-top: 0.4em; padding-bottom: 0.4em; }
		.trackNumber { font-size: 0.88em; }
	}

	@media (max-height: 750px) {
		.vinylDisc { width: 80px; height: 80px; }
		.musicPlaylist { margin-top: 10px; }
		.musicPlaylistTitle { font-size: 120%; }
		.musicPlaylistSubtitle { font-size: 80%; }
		.musicPlaylist li { margin-top: 0.15em; margin-bottom: 0.15em; }
		.musicPlaylistButton { padding-top: 0.35em; padding-bottom: 0.35em; padding-left: calc(var(--safeMargin) / 3); }
		.trackNumber { font-size: 0.86em; }
		.playIcon { width: 0.9em; height: 0.9em; }
	}

	@media (max-height: 500px) {
		.vinylDisc { width: 60px; height: 60px; margin-bottom: 0.5em; }
		.musicPlaylist { margin-top: 5px; font-size: 85%; }
		.musicPlaylistTitle { font-size: 100%; margin-bottom: 3px; }
		.musicPlaylistSubtitle { font-size: 75%; margin-top: 0.2em; margin-bottom: 0.3em; }
		.musicPlaylist li { margin-top: 0.05em; margin-bottom: 0.05em; }
		.musicPlaylistButton { padding-top: 0.2em; padding-bottom: 0.2em; padding-left: calc(var(--safeMargin) / 5); line-height: 1.1; }
		.trackNumber { font-size: 0.84em; }
		.playIcon { width: 0.7em; height: 0.7em; }
	}

	.musicPlaylist::-webkit-scrollbar { width: 6px; }
	.musicPlaylist::-webkit-scrollbar-track { background: transparent; }
	.musicPlaylist::-webkit-scrollbar-thumb {
		background-color: rgba(170, 170, 170, 0.3);
		border-radius: var(--radius-small);
		transition: background-color 0.2s ease;
	}
	.musicPlaylist::-webkit-scrollbar-thumb:hover { background-color: rgba(170, 170, 170, 0.5); }

	.vinylDisc {
		width: 120px;
		height: 120px;
		margin: 0 auto 1em auto;
		display: block;
		transition: none;
	}

	.musicPlaylistTitle {
		display: block;
		font-size: 150%;
		font-weight: bold;
		font-variant: small-caps;
		height: max-content;
		font-family: var(--music-playlist-font-rounded);
	}

	.musicPlaylistSubtitle {
		display: block;
		font-size: 90%;
		font-weight: normal;
		color: var(--color-gray-light);
		margin-top: 0.3em;
		margin-bottom: 0.5em;
		font-family: var(--music-playlist-font-rounded);
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

	.musicPlaylist li {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
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
		background-color: var(--music-playlist-accent-color);
	}
	.musicPlaylistButton:hover .trackNumber {
		color: var(--music-playlist-text-primary);
	}
	.musicPlaylist li.focus .musicPlaylistButton {
		background-color: var(--music-playlist-background-secondary);
	}
	.musicPlaylist li.focus .musicPlaylistButton:hover {
		background-color: var(--music-playlist-accent-color);
	}
	.musicPlaylist li.focus .musicPlaylistButton:hover .trackNumber {
		color: var(--music-playlist-text-primary);
	}
	.musicPlaylist li.focus .playIcon {
		background: none;
		background-color: var(--music-playlist-text-primary);
		-webkit-mask-image: url('/img/audio-player/pause2.svg');
		mask-image: url('/img/audio-player/pause2.svg');
		-webkit-mask-size: 100%;
		mask-size: 100%;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}

	:global(.musicCollectionsGallery .slick-slide) {
		display: flex !important;
		align-items: center;
		justify-content: center;
		height: calc(100vh - 2 * var(--header-footer-height) - 2 * var(--safeMargin)) !important;
	}
	
	:global(.musicCollectionsGallery .slick-slide > div) {
		display: flex !important;
		width: 100%;
		height: 100%;
	}
	
	:global(.musicCollectionsGallery .slick-center) {
		z-index: 1;
	}
</style>
