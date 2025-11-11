<div id="footer" class="footer">
	<div id="stickyFooter" class="stickyFooter">
		<button
			id="footerPreviousBtn"
			class="footerPreviousBtn"
			class:firstTrack={isFirstTrack}
			on:click={handlePreviousClick}><img src="/img/.old/icons/previous2.png" alt="Previous" /></button
		>
		<button id="footerPlayBtn" class="footerPlayBtn" class:isPlaying on:click={handlePlayClick}
		></button>
		<button
			id="footerNextBtn"
			class="footerNextBtn rSpacer"
			class:lastTrack={isLastTrack}
			on:click={handleNextClick}><img src="/img/.old/icons/next2.png" alt="Next" /></button
		>
		<input
			bind:this={footerSleekSlider}
			bind:value={sliderValue}
			id="footerSleekSlider"
			class="footerSleekSlider rSpacer"
			type="range"
			min="0"
			max="100"
			step="0.1"
			on:mousedown={handleSeekStart}
			on:mouseup={handleSeekEnd}
			on:touchstart={handleSeekStart}
			on:touchend={handleSeekEnd}
			on:input={handleSeekInput}
		/>
		<span class="footerTime rSpacer"
			><span id="currentTime">{currentTimeFormatted}</span> /
			<span id="duration">{durationFormatted}</span>
		</span>
		<button
			id="footerLoopBtn"
			class="footerLoopBtn rSpacer"
			class:isLooping
			on:click={handleLoopClick}
		></button>
		<button id="footerMuteBtn" class="muteBgMusic" class:isMuted on:click={handleMuteClick}></button>
		<input
			bind:this={footerVolumeSlider}
			id="footerVolumeSlider"
			class="footerVolumeSlider"
			type="range"
			value={displayVolume}
			on:input={handleVolumeInput}
		/>
	</div>
</div>
<!--#footer-->

<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
	import { Time } from '../utils/time.js';
	import { get } from 'svelte/store';

	const isPlayingStore = stores.music.isPlaying;
	$: isPlaying = $isPlayingStore;

	const isLoopingStore = stores.music.isLooping;
	$: isLooping = $isLoopingStore;

	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;

	const volumeStore = stores.music.volume;
	$: volume = $volumeStore;

	$: displayVolume = isMuted ? 0 : volume;

	const currentTimeStore = stores.music.currentTime;
	$: currentTime = $currentTimeStore;

	const durationStore = stores.music.duration;
	$: duration = $durationStore;

	const currentIndexStore = stores.music.currentIndex;
	$: currentIndex = $currentIndexStore;

	const playlistLengthStore = stores.music.playlistLength;
	$: playlistLength = $playlistLengthStore;

	// Only grey out previous button if we're at the first track AND playlist is initialized
	$: isFirstTrack = playlistLength > 0 && currentIndex === 0;
	// Only grey out next button if we're at the last track AND playlist is initialized
	$: isLastTrack = playlistLength > 0 && currentIndex + 1 >= playlistLength;

	$: currentTimeFormatted = Time.formatTime(currentTime);
	$: durationFormatted = Time.formatTime(duration);

	$: seekValue = duration > 0 ? (currentTime / duration) * 100 : 0;

	let footerVolumeSlider;
	let footerSleekSlider;
	let bgMusicElement;
	let isSeeking = false;
	let sliderValue = 0;

	// Get music player from store
	const musicPlayerStore = stores.music.musicPlayer;
	$: musicPlayer = $musicPlayerStore;

	// Update slider value only when not being dragged by user
	$: {
		if (!isSeeking) {
			sliderValue = seekValue;
		}
	}

	// Update volume slider when display volume changes
	$: {
		if (footerVolumeSlider) {
			footerVolumeSlider.value = displayVolume;
		}
	}

	function handlePlayClick() {
		if (musicPlayer) {
			musicPlayer.playHandler();
		}
	}

	function handleMuteClick() {
		if (musicPlayer) {
			musicPlayer.muteHandler();
		}
	}

	function handleLoopClick() {
		if (musicPlayer) {
			musicPlayer.loopHandler();
		}
	}

	function handleNextClick() {
		if (musicPlayer) {
			musicPlayer.nextTrackHandler();
		}
	}

	function handlePreviousClick() {
		if (musicPlayer) {
			musicPlayer.previousTrackHandler();
		}
	}

	function handleVolumeInput(e) {
		if (musicPlayer) {
			musicPlayer.volumeHandler(e.target);
		}
	}

	function handleSeekStart() {
		isSeeking = true;
	}

	function handleSeekInput(e) {
		if (footerSleekSlider) {
			sliderValue = parseFloat(footerSleekSlider.value);
		}
	}

	function handleSeekEnd() {
		isSeeking = false;
		if (musicPlayer && bgMusicElement && footerSleekSlider) {
			const newTime = (sliderValue / 100) * bgMusicElement.duration;
			bgMusicElement.currentTime = newTime;
			stores.music.currentTime.set(newTime);
		}
	}

	onMount(() => {
		// Get music player and audio element from store
		const player = get(stores.music.musicPlayer);
		if (player) {
			bgMusicElement = player.bgMusicElement;
		}

		// Sync volume slider with store
		if (footerVolumeSlider) {
			footerVolumeSlider.value = displayVolume;
		}

		// Update time display reactively
		const updateTime = () => {
			if (bgMusicElement) {
				stores.music.currentTime.set(bgMusicElement.currentTime);
				if (bgMusicElement.duration) {
					stores.music.duration.set(bgMusicElement.duration);
				}
			}
		};

		if (bgMusicElement) {
			bgMusicElement.addEventListener('timeupdate', updateTime);
		}

		return () => {
			if (bgMusicElement) {
				bgMusicElement.removeEventListener('timeupdate', updateTime);
			}
		};
	});
</script>

<style>
	.footer {
		display: block;
		position: sticky;
		bottom: 0;
		height: calc(2 * var(--safeMargin));
		width: 100%;
		color: white;
		background-color: var(--shade1);
		z-index: 2;
	}

	.stickyFooter {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.footer button {
		vertical-align: middle;
		padding: calc(var(--safeMargin) / 5);
		width: var(--safeMargin);
		height: var(--safeMargin);
		margin-top: auto;
		margin-bottom: auto;
		background-size: 80% !important;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.footer button img {
		height: 100%;
		width: 100%;
	}

	.footer button:hover {
		background-color: var(--shadePop);
		border-radius: 5px;
	}

	.footerSleekSlider {
		width: calc(var(--safeMargin) * 10);
		height: calc(var(--safeMargin) / 2);
	}
	.footerVolumeSlider {
		width: calc(var(--safeMargin) * 2);
	}

	.footerTime {
		font-family: var(--ff3);
		font-size: 75%;
	}

	.footerPlayBtn {
		background: no-repeat center url('img/.old/icons/play_alt.png');
		background-size: 80%;
	}

	.footerPlayBtn.isPlaying {
		background: no-repeat center url('img/.old/icons/pause.svg') !important;
		background-size: 80% !important;
	}

	.footerPlayBtn.isPlaying:hover {
		background-color: var(--shadePop) !important  ;
	}

	.footerLoopBtn {
		background: no-repeat center url('img/.old/icons/loop.png');
		background-size: 80%;
		opacity: 1;
	}

	.footerLoopBtn:hover {
		opacity: 1;
	}

	.footerLoopBtn.isLooping {
		opacity: 1;
		border-radius: 5px;
		background-color: var(--shade2);
	}

	.rSpacer {
		margin-right: calc(var(--safeMargin) / 2);
	}

	.footerNextBtn.lastTrack {
		opacity: 20%;
		pointer-events: none;
	}

	.footerPreviousBtn.firstTrack {
		opacity: 20%;
		pointer-events: none;
	}
</style>
