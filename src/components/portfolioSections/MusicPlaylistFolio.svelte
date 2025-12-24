<div class="musicPlaylistWrapper">
	<div id="musicPlaylistCover" class="musicPlaylistCover" style={coverStyle}>
		<div
			style="position : absolute; top : auto; left : var(--safeMargin); bottom : var(--safeMargin);"
		>
			<div><i class="musicIcon">SPACE</i> : play/pause</div>
			<div><i class="musicIcon">Q</i>, <i class="musicIcon">D</i> : previous/next track</div>
			<div><i class="musicIcon">S</i>, <i class="musicIcon">Z</i> : volume down/up</div>
			<div><i class="musicIcon">M</i> : mute, <i class="musicIcon">L</i> : loop</div>
		</div>
	</div>
	<div class="musicPlaylistRPanel">
		<div class="musicPlaylistTitle">Playlist</div>
		<!--title-->
		<ul id="musicPlaylist" class="musicPlaylist" aria-label="Fragments">
			{#each tracks as track, index}
				<li class:focus={currentIndex === index}>
					<button type="button" class="musicPlaylistButton" on:click={() => handleTrackClick(index)}>
						<i class="playIcon"></i><span>{track.title}</span>
					</button>
				</li>
			{/each}
		</ul>
		<!--list-->
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../../stores.js';
	import { shortcuts } from '../../utils/shortcuts.js';

	const currentIndexStore = stores.music.currentIndex;
	$: currentIndex = $currentIndexStore;

	const trackImageStore = stores.music.trackImage;
	$: trackImage = $trackImageStore;

	const isPlayingStore = stores.music.isPlaying;
	$: isPlaying = $isPlayingStore;

	let musicPlayer;
	let bgMusicElement;

	const tracks = [
		{ sound: '/sound/bgmusic.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Background music #1' },
		{ sound: '/sound/bgmusic2.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Background music #2' },
		{ sound: '/sound/MallowHazard.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Mallow Hazard' },
		{ sound: "/sound/Chris'Journey.mp3", image: '/img/.old/guillaumekuc_bgMusic.jpg', title: "Chris' Journey" },
		{ sound: '/sound/ChillingVastitude.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Chilling Vastitude' },
		{ sound: '/sound/ChaoticIntruders.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Chaotic Intruders' },
		{ sound: '/sound/DistractingScent.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Distracting Scent' },
		{ sound: '/sound/FerventHorizon.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Fervent Horizon' },
		{ sound: '/sound/GalvanizingQuest.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Galvanizing Quest' },
		{ sound: '/sound/InvigoratingFarm.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Invigorating Farm' },
		{
			sound: '/sound/RecalcitrantWaterflow.mp3',
			image: '/img/.old/guillaumekuc_bgMusic.jpg',
			title: 'Recalcitrant Waterflow'
		},
		{ sound: '/sound/SpicyGallant.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Spicy Gallant' },
		{ sound: '/sound/UntroubledMorning.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Untroubled Morning' },
		{ sound: "/sound/Chris'Journey.mp3", image: '/img/.old/guillaumekuc_bgMusic.jpg', title: "Chris' Journey" },
		{ sound: '/sound/StunnedChickens.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Stunned Chickens' },
		{ sound: '/sound/Meanwhile.mp3', image: '/img/.old/guillaumekuc_bgMusic.jpg', title: 'Meanwhile' }
	];

	// Store tracks in store for music.js to access
	stores.music.tracks.set(tracks);

	function handleTrackClick(index) {
		const player = get(stores.music.musicPlayer);
		const bgMusic = player?.bgMusicElement;
		if (player && bgMusic) {
			const track = tracks[index];
			bgMusic.setAttribute('src', track.sound);
			stores.music.currentIndex.set(index);
			stores.music.trackImage.set(track.image);
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

	onMount(() => {
		const player = get(stores.music.musicPlayer);
		if (player) {
			bgMusicElement = player.bgMusicElement;
			musicPlayer = player;
		}
		stores.music.playlistLength.set(tracks.length);

		// Initialize track image
		if (tracks[currentIndex]) {
			stores.music.trackImage.set(tracks[currentIndex].image);
		}

		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowRight', playNextTrack);
		shortcuts.addScreenShortcut('musicPlaylistFolio', 'ArrowLeft', playPreviousTrack);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('musicPlaylistFolio');
	});

	$: coverStyle = `background: no-repeat center / cover url(${trackImage})`;
</script>

<!--musicPlaylistWrapper-->

<style>
	.musicPlaylistWrapper {
		/* Font interface variables - map global variables to local scope */
		--music-playlist-font-rounded: var(--ffRounded);
		/* Border radius interface variable - map global variable to local scope */
		--music-playlist-radius: var(--radius-large);
	}
	i.musicIcon {
		font-style: normal;
		display: inline-block;
		height: 1.5em;
		font-size: 1em;
		box-sizing: border-box;
		padding-left: 0.4em;
		padding-right: 0.4em;
		border: 1px solid var(--music-playlist-text-primary);
		border-radius: var(--radius-medium);
		font-family: var(--music-playlist-font-rounded);
		text-transform: uppercase;
		vertical-align: middle;
		-webkit-filter: drop-shadow(1px 1px 0 var(--music-playlist-overlay))
			drop-shadow(-1px 1px 0 var(--music-playlist-overlay)) drop-shadow(1px -1px 0 var(--music-playlist-overlay))
			drop-shadow(-1px -1px 0 var(--music-playlist-overlay));
		filter: drop-shadow(1px 1px 0 var(--music-playlist-overlay))
			drop-shadow(-1px 1px 0 var(--music-playlist-overlay)) drop-shadow(1px -1px 0 var(--music-playlist-overlay))
			drop-shadow(-1px -1px 0 var(--music-playlist-overlay));
	}

	.musicPlaylistWrapper {
		/* Color interface variables */
		--music-playlist-accent-color: var(--color-accent);
		--music-playlist-text-primary: var(--color-white);
		--music-playlist-background-secondary: var(--color-background-secondary);
		--music-playlist-overlay: var(--color-overlay);
		
		font-size: var(--fs2o3);
	}
	@media (max-height: 648px) {
		.musicPlaylistWrapper {
			font-size: var(--fs1o2);
		}
	}

	.musicPlaylistWrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		width: 100%;
		padding: 0;
		margin: 0;
	}

	.musicPlaylistCover {
		flex-shrink: 0;
		display: inline-block;
		width: calc(2 * 100vw / 3);
		height: 66.66vh;
		max-height: calc(100vh - 4 * var(--safeMargin));
		background-color: var(--music-playlist-background-secondary);
		border-radius: 0 var(--music-playlist-radius) var(--music-playlist-radius) 0;
		position: relative;
	}

	.musicPlaylistRPanel {
		display: flex;
		flex-direction: column;
		flex-shrink: 1;
		width: 100%;
		height: 66.66vh;
		max-height: calc(100vh - 4 * var(--safeMargin));
		margin-left: var(--safeMargin);
		margin-right: var(--safeMargin);
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
		.musicPlaylist {
			margin-top: 12px;
		}
		.musicPlaylistTitle {
			font-size: 135%;
		}
		.musicPlaylist li {
			margin-top: 0.2em;
			margin-bottom: 0.2em;
		}
		.musicPlaylistButton {
			padding-top: 0.4em;
			padding-bottom: 0.4em;
		}
	}

	@media (max-height: 750px) {
		.musicPlaylist {
			margin-top: 10px;
		}
		.musicPlaylistTitle {
			font-size: 120%;
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
		.playIcon {
			width: 0.9em;
			height: 0.9em;
		}
	}

	@media (max-height: 500px) {
		.musicPlaylist {
			margin-top: 5px;
			font-size: 85%;
		}
		.musicPlaylistTitle {
			font-size: 100%;
			margin-bottom: 3px;
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
		.playIcon {
			width: 0.7em;
			height: 0.7em;
			margin-right: calc(var(--safeMargin) / 4);
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

	.musicPlaylistTitle {
		display: block;
		font-size: 150%;
		font-weight: bold;
		font-variant: small-caps;
		height: max-content;
		font-family: var(--music-playlist-font-rounded);
	}

	.playIcon {
		display: inline-block;
		background: url('img/.old/icons/play_alt.png') center center no-repeat;
		background-size: 80%;
		vertical-align: middle;
		width: 1em;
		height: 1em;
		margin-right: calc(var(--safeMargin) / 2);
	}

	.musicPlaylist li {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}

	.musicPlaylistButton {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		cursor: pointer;
		text-align: left;
		line-height: 1;
		vertical-align: middle;
		border-radius: var(--radius-medium);
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		padding-left: calc(var(--safeMargin) / 2);
		width: 100%;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
	}

	.musicPlaylist li span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.musicPlaylistButton:hover {
		background-color: var(--music-playlist-accent-color);
	}

	.musicPlaylist li.focus .musicPlaylistButton {
		background-color: var(--music-playlist-background-secondary);
	}

	.musicPlaylist li.focus .musicPlaylistButton:hover {
		background-color: var(--music-playlist-accent-color);
	}

	.musicPlaylist li.focus .playIcon {
		background: url('img/.old/icons/pause.svg') center center no-repeat;
	}
</style>
