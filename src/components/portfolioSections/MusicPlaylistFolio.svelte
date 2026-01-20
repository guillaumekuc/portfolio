<div class="musicPlaylistPanel">
	{#if collectionImage}
		<img src={collectionImage} alt="Vinyl disc" class="vinylDisc" bind:this={vinylDiscElement} style="transform: rotate({currentRotation}deg);" />
	{/if}
	<div class="musicPlaylistTitle">{collectionName}</div>
	{#if collectionSubtitle}
		<div class="musicPlaylistSubtitle">{collectionSubtitle}</div>
	{/if}
	<!--title-->
		<ul id="musicPlaylist" class="musicPlaylist" aria-label="Fragments">
			{#each tracks as track, index}
				<li class:focus={currentIndex === index}>
					<button type="button" class="musicPlaylistButton" on:click={() => handleTrackClick(index)}>
						<span class="trackNumber">{index + 1} · </span>
						<span class="trackTitle">{track.title}</span>
						<i class="playIcon"></i>
					</button>
				</li>
			{/each}
		</ul>
	<!--list-->
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';

	export let sectionConfig;

	const currentIndexStore = stores.music.currentIndex;
	$: currentIndex = $currentIndexStore;

	const trackImageStore = stores.music.trackImage;
	$: trackImage = $trackImageStore;

	const isPlayingStore = stores.music.isPlaying;
	$: isPlaying = $isPlayingStore;

	let musicPlayer;
	let bgMusicElement;
	let vinylDiscElement;
	let currentRotation = 0;
	let animationFrameId = null;
	let lastTimestamp = null;
	const ROTATION_SPEED = 360 / 3; // degrees per second (3 seconds per full rotation)

	// Get the first collection (for now we only have one)
	$: currentCollection = sectionConfig?.collections?.[0] || null;
	$: collectionName = currentCollection?.name || 'Unnamed Collection';
	$: collectionSubtitle = currentCollection?.subtitle || null;
	$: collectionImage = currentCollection?.image ? getAssetUrl(currentCollection.image) : null;

	// Get tracks from current collection and process asset URLs
	$: tracks = (currentCollection?.tracks || []).map(track => ({
		...track,
		sound: getAssetUrl(track.sound)
	}));

	// Store tracks in store for music.js to access (reactive)
	$: stores.music.tracks.set(tracks);

	function handleTrackClick(index) {
		const player = get(stores.music.musicPlayer);
		const bgMusic = player?.bgMusicElement;
		if (player && bgMusic) {
			const track = tracks[index];
			bgMusic.setAttribute('src', track.sound);
			stores.music.currentIndex.set(index);
			// Use collection image instead of track image
			if (collectionImage) {
				stores.music.trackImage.set(collectionImage);
			}
			player.play();
		}
	}

	function scrollToTrack(element) {
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'start'
		});
	}

	function playNextTrack() {
		const player = get(stores.music.musicPlayer);
		if (player) {
			player.nextTrackHandler();
			setTimeout(() => {
				const currentIndex = get(stores.music.currentIndex);
				const track = document.querySelectorAll('.musicPlaylist li')[currentIndex];
				if (track) scrollToTrack(track);
			}, 10);
		}
	}

	function playPreviousTrack() {
		const player = get(stores.music.musicPlayer);
		if (player) {
			player.previousTrackHandler();
			setTimeout(() => {
				const currentIndex = get(stores.music.currentIndex);
				const track = document.querySelectorAll('.musicPlaylist li')[currentIndex];
				if (track) scrollToTrack(track);
			}, 10);
		}
	}

	function animateRotation(timestamp) {
		if (!lastTimestamp) {
			lastTimestamp = timestamp;
		}
		
		const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
		lastTimestamp = timestamp;
		
		if (isPlaying) {
			currentRotation += ROTATION_SPEED * deltaTime;
			// Keep rotation in 0-360 range for cleaner values
			if (currentRotation >= 360) {
				currentRotation -= 360;
			}
			animationFrameId = requestAnimationFrame(animateRotation);
		}
	}

	// Watch isPlaying to start/stop animation
	$: if (isPlaying && vinylDiscElement) {
		if (!animationFrameId) {
			lastTimestamp = null;
			animationFrameId = requestAnimationFrame(animateRotation);
		}
	} else {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
			lastTimestamp = null;
		}
	}

	onMount(() => {
		const player = get(stores.music.musicPlayer);
		if (player) {
			bgMusicElement = player.bgMusicElement;
			musicPlayer = player;
		}
		stores.music.playlistLength.set(tracks.length);

		// Initialize track image from collection
		if (collectionImage) {
			stores.music.trackImage.set(collectionImage);
		}

		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowRight', playNextTrack);
		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowLeft', playPreviousTrack);
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		shortcuts.removeScreenShortcuts('musicPlaylistFolio');
	});
</script>

<!--musicPlaylistWrapper-->

<style>
	.musicPlaylistPanel {
		/* Font interface variables - map global variables to local scope */
		--music-playlist-font-rounded: var(--ffRounded);
		/* Border radius interface variable - map global variable to local scope */
		--music-playlist-radius: var(--radius-large);
		
		/* Color interface variables */
		--music-playlist-accent-color: var(--color-accent);
		--music-playlist-text-primary: var(--color-white);
		--music-playlist-background-secondary: var(--color-background-secondary);
		--music-playlist-overlay: var(--color-overlay);
		
		/* Margin calculation - same as About page */
		--music-playlist-margin: calc(var(--header-footer-height) + var(--safeMargin));
		
		/* Layout - parent .portfolioSection already centers with flexbox */
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 600px;
		max-height: calc(100vh - 2 * var(--music-playlist-margin));
		padding-left: var(--safeMargin);
		padding-right: var(--safeMargin);
		box-sizing: border-box;
		overflow: hidden;
	}

	.musicPlaylist {
		font-size: 100%;
		display: block;
		list-style-type: none;
		margin-top: 15px;
		overflow: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(170, 170, 170, 0.3) transparent;
	}

	/* Responsive breakpoints for smaller screens */
	@media (max-height: 950px) {
		.vinylDisc {
			width: 100px;
			height: 100px;
		}
		.musicPlaylist {
			margin-top: 12px;
		}
		.musicPlaylistTitle {
			font-size: 135%;
		}
		.musicPlaylistSubtitle {
			font-size: 85%;
		}
		.musicPlaylist li {
			margin-top: 0.2em;
			margin-bottom: 0.2em;
		}
		.musicPlaylistButton {
			padding-top: 0.4em;
			padding-bottom: 0.4em;
		}
		.trackNumber {
			font-size: 0.88em;
		}
	}

	@media (max-height: 750px) {
		.vinylDisc {
			width: 80px;
			height: 80px;
		}
		.musicPlaylist {
			margin-top: 10px;
		}
		.musicPlaylistTitle {
			font-size: 120%;
		}
		.musicPlaylistSubtitle {
			font-size: 80%;
		}
		.musicPlaylist li {
			margin-top: 0.15em;
			margin-bottom: 0.15em;
		}
		.musicPlaylistButton {
			padding-top: 0.35em;
			padding-bottom: 0.35em;
			padding-left: calc(var(--safeMargin) / 3);
		}
		.trackNumber {
			font-size: 0.86em;
		}
		.playIcon {
			width: 0.9em;
			height: 0.9em;
		}
	}

	@media (max-height: 500px) {
		.vinylDisc {
			width: 60px;
			height: 60px;
			margin-bottom: 0.5em;
		}
		.musicPlaylist {
			margin-top: 5px;
			font-size: 85%;
		}
		.musicPlaylistTitle {
			font-size: 100%;
			margin-bottom: 3px;
		}
		.musicPlaylistSubtitle {
			font-size: 75%;
			margin-top: 0.2em;
			margin-bottom: 0.3em;
		}
		.musicPlaylist li {
			margin-top: 0.05em;
			margin-bottom: 0.05em;
		}
		.musicPlaylistButton {
			padding-top: 0.2em;
			padding-bottom: 0.2em;
			padding-left: calc(var(--safeMargin) / 5);
			line-height: 1.1;
		}
		.trackNumber {
			font-size: 0.84em;
		}
		.playIcon {
			width: 0.7em;
			height: 0.7em;
		}
	}

	.musicPlaylist::-webkit-scrollbar {
		width: 6px;
	}

	.musicPlaylist::-webkit-scrollbar-track {
		background: transparent;
	}

	.musicPlaylist::-webkit-scrollbar-thumb {
		background-color: rgba(170, 170, 170, 0.3);
		border-radius: var(--radius-small);
		transition: background-color 0.2s ease;
	}

	.musicPlaylist::-webkit-scrollbar-thumb:hover {
		background-color: rgba(170, 170, 170, 0.5);
	}

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
</style>
