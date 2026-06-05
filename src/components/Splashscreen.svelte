<div id="splashscreen" class="splashscreen fullPage snap">
	<SplashscreenSound />

	<SplashscreenHero />

	<div id="splashArtArea" class="splashArtArea">
		<div bind:this={artElement} use:parallax id="splashArt" class="splashArt" class:initialScale={isInitialScale} class:introComplete={isIntroComplete} class:idleZoom={isIdleZoom} style="background-image: url('{backgroundImageUrl}')">
			<audio bind:this={bgMusicElement} id="bgMusic" src={bgMusicUrl} loop type="audio/mpeg" preload="none"
			></audio>

			<div bind:this={noiseOverlay} class="noiseOverlay"></div>
			<div id="splashArtShader" class="splashArtShader"></div>
		</div>
	</div>


	<SplashNav />

</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { initAudio, initNavigation, initAPI } from '../scripts.js';
	import { stores } from '../stores.js';
	import { get } from 'svelte/store';
	import { getAssetUrl } from '../utils/assets.js';
	import { parallax } from '../utils/parallax.js';
	import SplashscreenSound from './SplashscreenSound.svelte';
	import SplashNav from './SplashNav.svelte';
	import SplashscreenHero from './SplashscreenHero.svelte';
	import siteConfig from '../config/site.json';

	const bgMusicUrl = getAssetUrl('/sound/bgmusic.mp3');
	const backgroundImageUrl = getAssetUrl(siteConfig.splashBackgroundImage);

	// Animation timing constants
	const INTRO_ANIMATION_DURATION_MS = 3000;
	const MUSIC_START_DELAY_MS = 1000;

	let bgMusicElement;
	let artElement;
	let noiseOverlay;
	let grainRafId = null;
	let isAudioInitialized = false;
	
	// Animation state
	let isInitialScale = true;
	let isIntroComplete = false;
	let isIdleZoom = false;

	// Initialize audio when bgMusicElement becomes available
	$: if (bgMusicElement && !isAudioInitialized) {
		const musicPlayer = initAudio(bgMusicElement);
		if (musicPlayer) {
			initNavigation();
			initAPI();
			isAudioInitialized = true;
		}
	}

	function handleArtAnimate() {
		// Start intro animation: transition from scale(1.1) to scale(1)
		isIntroComplete = true;
		
		// After intro completes, transition to idle animation
		setTimeout(() => {
			isInitialScale = false;
			isIntroComplete = false;
			isIdleZoom = true;
		}, INTRO_ANIMATION_DURATION_MS);
	}

	function animateFilmicGrain() {
		if (noiseOverlay) {
			// Random position each frame for flickering grain effect
			const x = Math.random() * 200;
			const y = Math.random() * 200;
			noiseOverlay.style.backgroundPosition = `${x}px ${y}px`;
		}
		grainRafId = requestAnimationFrame(animateFilmicGrain);
	}

	function startBackgroundMusic() {
		setTimeout(() => {
			const musicPlayer = get(stores.music.musicPlayer);
			const isMuted = get(stores.music.isMuted);
			
			if (musicPlayer) {
				if (!isMuted) {
					musicPlayer.play().catch((error) => {
						console.warn('Failed to play background music:', error);
					});
				}
			} else {
				// Music player not ready yet, retry after a short delay
				console.warn('Music player not initialized, retrying...');
				setTimeout(() => {
					const retryPlayer = get(stores.music.musicPlayer);
					const retryMuted = get(stores.music.isMuted);
					if (retryPlayer && !retryMuted) {
						retryPlayer.play().catch((error) => {
							console.warn('Failed to play background music on retry:', error);
						});
					}
				}, 500);
			}
			// Mark that we've attempted to start music
			stores.music.hasEnteredWithMusic.set(true);
		}, MUSIC_START_DELAY_MS);
	}

	onMount(() => {
		window.addEventListener('enterPressed', startBackgroundMusic);
		window.addEventListener('artAnimate', handleArtAnimate);
		animateFilmicGrain(); // Start random grain flickering
	});

	onDestroy(() => {
		window.removeEventListener('artAnimate', handleArtAnimate);
		if (grainRafId) {
			cancelAnimationFrame(grainRafId);
		}
	});
</script>

<style>
	#splashscreen {
		font-size: var(--fs1);
	}
	@media (max-height: 648px) {
		#splashscreen {
			font-size: var(--fs4o5);
		}
	}

	.splashscreen {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.splashArtArea {
		position: relative;
		height: 100vh;
		width: 100%;
		overflow: hidden;
	}

	.splashArt {
		margin: auto;
		position: relative;
		padding: auto;
		width: 100%;
		height: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		transform-origin: 34% 37%; /* Image-dependent focal point. Update if background image changes */
		transition: transform 3s ease-out;
	}

	.noiseOverlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: url('/img/noise2.png');
		background-repeat: repeat;
		opacity: 1;
		mix-blend-mode: overlay;
		z-index: 1;
	}

	/* Intro animation states */
	.splashArt.initialScale {
		transform: scale(1.1);
	}

	.splashArt.introComplete {
		transform: scale(1);
	}

	/* Idle animation - starts after intro completes */
	.splashArt.idleZoom {
		transition: none;
		animation: idleZoom 24s ease-in-out infinite;
	}

	@keyframes idleZoom {
		0%, 10% {
			transform: scale(1);
		}
		70%, 80% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}


	.splashArtShader {
		position: absolute;
		background: rgba(0, 0, 0, 0)
			linear-gradient(
				to bottom,
				rgba(0, 0, 0, 0) 10%,
				rgba(0, 0, 0, 0.05) 40%,
				rgba(0, 0, 0, 0.25) 75%,
				rgba(0, 0, 0, 0.5) 100%
			)
			repeat scroll 0 0;
		bottom: 0;
		height: 200px;
		width: 100%;
		opacity: 0;
	}

</style>
