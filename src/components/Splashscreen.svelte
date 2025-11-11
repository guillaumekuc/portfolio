<div id="splashscreen" class="splashscreen fullPage snap">
	<div class="splashLinks">
		<SplashLinks />
	</div>
	<SplashSound />

	<SplashBranding />

	<div id="splashArtArea" class="splashArtArea">
		<div id="splashArt" class="splashArt zoomIn">
			<audio bind:this={bgMusicElement} id="bgMusic" src="/sound/bgmusic.wav" loop type="audio/mpeg"
			></audio>

			<div id="splashArtShader" class="splashArtShader"></div>
			<!--#splashArtShader-->
		</div>
		<!--#splashArt-->
	</div>
	<!--splashArtArea-->

	<div id="splashNavPositioner">
		<SplashNav />
	</div>
</div>

<!--#splashscreen-->

<script>
	import { onMount } from 'svelte';
	import { initAudio, initNavigation, initAPI } from '../scripts.js';
	import { stores } from '../stores.js';
	import { get } from 'svelte/store';
	import SplashLinks from './SplashLinks.svelte';
	import SplashSound from './SplashSound.svelte';
	import SplashNav from './SplashNav.svelte';
	import SplashBranding from './SplashBranding.svelte';

	let bgMusicElement;

	function startBackgroundMusic() {
		// Wait a bit for the animation to start before playing music
		setTimeout(() => {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.play();
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
		z-index: 90;
	}

	.splashArtArea {
		position: relative;
		height: 100vh;
		width: 100%;
	}

	.splashArt {
		margin: auto;
		position: relative;
		padding: auto;
		width: 100%;
		height: 100%;
		transform: scale(1.1);
		background: center no-repeat url('img/oldbg.jpg');
		background-size: cover;
		transition: 3s ease-out;
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

	:global(#splashscreen .splashLinks .mailTooltip .tooltipText) {
		top: 125%;
		left: 0;
	}
</style>
