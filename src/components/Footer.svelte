<script>
	import { onMount } from 'svelte';
	import { stores } from '../stores.js';
	import { Time } from '../utils/time.js';
	
	const isPlayingStore = stores.music.isPlaying;
	$: isPlaying = $isPlayingStore;
	
	const isLoopingStore = stores.music.isLooping;
	$: isLooping = $isLoopingStore;
	
	const isMutedStore = stores.music.isMuted;
	$: isMuted = $isMutedStore;
	
	const volumeStore = stores.music.volume;
	$: volume = $volumeStore;
	
	const currentTimeStore = stores.music.currentTime;
	$: currentTime = $currentTimeStore;
	
	const durationStore = stores.music.duration;
	$: duration = $durationStore;
	
	const currentIndexStore = stores.music.currentIndex;
	$: currentIndex = $currentIndexStore;
	
	const playlistLengthStore = stores.music.playlistLength;
	$: playlistLength = $playlistLengthStore;
	
	$: isFirstTrack = currentIndex === 0;
	$: isLastTrack = currentIndex + 1 >= playlistLength;
	
	$: currentTimeFormatted = Time.formatTime(currentTime);
	$: durationFormatted = Time.formatTime(duration);
	
	$: seekValue = duration > 0 ? (currentTime / duration) * 100 : 0;
	
	let footerVolumeSlider;
	let footerSleekSlider;
	let bgMusicElement;
	let musicPlayer;
	
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
	
	function handleSeekInput(e) {
		if (musicPlayer && bgMusicElement && footerSleekSlider) {
			bgMusicElement.currentTime = (footerSleekSlider.value / 100) * bgMusicElement.duration;
		}
	}
	
	onMount(() => {
		bgMusicElement = document.querySelector('#bgMusic');
		musicPlayer = window.musicPlayer;
		
		// Sync volume slider with store
		if (footerVolumeSlider) {
			footerVolumeSlider.value = volume;
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
		display : block;
		position : sticky;
		bottom :0;
		height : calc(2 * var(--safeMargin));
		width : 100%;
		color : white;
		background-color: var(--shade1);
		z-index: 2;
	}

	.stickyFooter {
		display: flex;
		align-items: center;
		justify-content: center;
		height : 100%;
	}

	.footer button {
		vertical-align: middle;
		padding : calc(var(--safeMargin) / 5);
		width : var(--safeMargin);
		height : var(--safeMargin);
		margin-top : auto;
		margin-bottom: auto;
		background-size : 80% !important;
		display : flex;
		align-items: center;
		justify-content: center;
	}

	.footer button img {
		height : 100%;
		width : 100%;
	}

	.footer button:hover {
		background-color: var(--shadePop);
		border-radius: 5px;
	}

	.footerSleekSlider {
		width : calc(var(--safeMargin) * 10);
		height : calc(var(--safeMargin) / 2);
	}
	.footerVolumeSlider {
		width : calc(var(--safeMargin) * 2);
	}

	.footerTime{
		font-family: var(--ff3);
		font-size: 75%;
	}

	.footerPlayBtn {
		background : no-repeat center url("img/icons/play_alt.png");
		background-size: 80%;
	}

	.footerPlayBtn.isPlaying {
		background : no-repeat center url("img/icons/pause.svg")!important;
		background-size: 80% !important;
	}

	.footerPlayBtn.isPlaying:hover {
		background-color : var(--shadePop)!important  ; 
	}

	.footerLoopBtn {
		background : no-repeat center url("img/icons/loop.png");
		background-size : 80%;
		opacity: 1;
	}

	.footerLoopBtn:hover{
		opacity : 1;
	}

	.footerLoopBtn.isLooping {
		opacity: 1 ;
		border-radius: 5px;
		background-color: var(--shade2);
	}

	.rSpacer {
		margin-right: calc(var(--safeMargin)/2);
	}

	.footerNextBtn.lastTrack {
		opacity : 20%;
		pointer-events: none;
	}

	.footerPreviousBtn.firstTrack {
		opacity : 20%;
		pointer-events: none;
	}
</style>

<div id="footer" class="footer">
		<div id="stickyFooter" class="stickyFooter">
			<button id="footerPreviousBtn" class="footerPreviousBtn" class:firstTrack={isFirstTrack} on:click={handlePreviousClick}><img src="/img/icons/previous2.png" alt="Previous" /></button>
			<button id="footerPlayBtn" class="footerPlayBtn" class:isPlaying={isPlaying} on:click={handlePlayClick}></button>
			<button id="footerNextBtn" class="footerNextBtn rSpacer" class:lastTrack={isLastTrack} on:click={handleNextClick}><img src="/img/icons/next2.png" alt="Next" /></button>
			<input bind:this={footerSleekSlider} id="footerSleekSlider" class="footerSleekSlider rSpacer" type="range" value={seekValue} on:input={handleSeekInput} />
			<span class="footerTime rSpacer"><span id="currentTime">{currentTimeFormatted}</span> / <span id="duration">{durationFormatted}</span> </span>
			<button id="footerLoopBtn" class="footerLoopBtn rSpacer" class:isLooping={isLooping} on:click={handleLoopClick}></button>
			<button id="footerMuteBtn" class="muteBgMusic" class:isMuted={isMuted} on:click={handleMuteClick}></button>
			<input bind:this={footerVolumeSlider} id="footerVolumeSlider" class="footerVolumeSlider" type="range" value={volume} on:input={handleVolumeInput} />
	</div>
</div><!--#footer-->
