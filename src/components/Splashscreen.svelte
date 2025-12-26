<div id="splashscreen" class="splashscreen fullPage snap">
	<SplashscreenSound />

	<SplashscreenHero />

	<div id="splashArtArea" class="splashArtArea">
		<div bind:this={artElement} id="splashArt" class="splashArt zoomIn">
			<audio bind:this={bgMusicElement} id="bgMusic" src="/sound/bgmusic.mp3" loop type="audio/mpeg" preload="none"
			></audio>

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
	import SplashscreenSound from './SplashscreenSound.svelte';
	import SplashNav from './SplashNav.svelte';
	import SplashscreenHero from './SplashscreenHero.svelte';

	let bgMusicElement;
	let artElement;
	let rafId = null;

	function handleArtAnimate() {
		if (artElement) {
			artElement.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
		}
	}

	function handleParallax() {
		if (rafId) {
			cancelAnimationFrame(rafId);
		}
		rafId = requestAnimationFrame(() => {
			if (artElement) {
				const scrollY = window.scrollY || window.pageYOffset;
				// Subtle parallax effect: background moves at 30% of scroll speed
				const parallaxOffset = scrollY * 0.3;
				artElement.style.backgroundPosition = `center calc(50% + ${parallaxOffset}px)`;
			}
			rafId = null;
		});
	}

	function startBackgroundMusic() {
		// Wait a bit for the animation to start before playing music
		setTimeout(() => {
			const musicPlayer = get(stores.music.musicPlayer);
			const isMuted = get(stores.music.isMuted);
			
			if (musicPlayer) {
				// Only play if not muted
				if (!isMuted) {
					musicPlayer.play();
				}
				// Mark that we've attempted to start music (user has entered the site with music enabled)
				stores.music.hasEnteredWithMusic.set(true);
			}
		}, 1000);
	}

	onMount(() => {
		// Initialize scripts with audio element once it's available
		if (bgMusicElement) {
			const musicPlayer = initAudio(bgMusicElement);
			if (musicPlayer) {
				initNavigation();
				initAPI();
			}
		}

		// Listen for enter button press to start music
		window.addEventListener('enterPressed', startBackgroundMusic);

		// Listen for art animation trigger
		window.addEventListener('artAnimate', handleArtAnimate);

		// Set up parallax effect
		handleParallax(); // Initial position
		window.addEventListener('scroll', handleParallax, { passive: true });
	});

	onDestroy(() => {
		window.removeEventListener('artAnimate', handleArtAnimate);
		window.removeEventListener('scroll', handleParallax);
		if (rafId) {
			cancelAnimationFrame(rafId);
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
		background: center no-repeat url('img/guillaumekuc_oldbg.jpg');
		background-size: cover;
		transform: scale(1.1);
		transition: transform 3s ease-out;
		will-change: background-position;
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
