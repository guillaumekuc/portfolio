<script>
	import { onMount } from 'svelte';
	import { currentScreen } from '../stores.js';

	let loadElement;
	let startScreenElement;
	let enterBtn;

	function handleEnter() {
		// Initialize scroll
		document.body.scroll(0, 0);
		
		// Hide all folios
		document.querySelectorAll('.folio').forEach(function(folio) { 
			folio.classList.add('hidden');
		});
		
		// Animate opening
		startScreenElement.classList.add('fadeOut');
		const art = document.querySelector('#splashArt');
		const title = document.querySelector('#splashTitle');
		const subtitle = document.querySelector('#splashSubTitle');
		const oneLiner = document.querySelector('#splashDescription');
		const domains = document.querySelector('#splashDomains');
		const splashNav = document.querySelector('#splashNav');
		const splashLinks = document.querySelectorAll('.splashLinks a');
		const splashNavLinks = document.querySelectorAll('.splashNav a');
		
		if (art) art.style.transform = "scale(1)";
		if (title) title.style.opacity = "100%";
		if (subtitle) subtitle.style.opacity = "100%";
		if (oneLiner) oneLiner.style.opacity = "100%";
		if (domains) domains.style.opacity = "100%";
		if (splashNav) splashNav.style.opacity = "100%";
		
		let animStartTime = 3;
		splashLinks.forEach((link, n) => {
				link.style.transition = `opacity 1s ease-out ${animStartTime}s`;
				link.style.opacity = "1";
				animStartTime += 0.25;
		});
		
		splashNavLinks.forEach(link => {
			link.style.opacity = "100%";
			setTimeout(() => { link.style.pointerEvents = "auto"; }, 4000);
		});
		
		// Display scrollbar
		document.body.style.overflow = 'auto';
		
		// Update current screen
		currentScreen.set('splashscreen');
		
		// Trigger music launch (will be handled by Splashscreen component)
		const event = new CustomEvent('enterPressed');
		window.dispatchEvent(event);
	}

	onMount(() => {
		loadElement = document.getElementById('load');
		startScreenElement = document.getElementById('startScreen');
		enterBtn = document.getElementById('enterBtn');
		
		if (enterBtn) {
			enterBtn.addEventListener('click', handleEnter);
		}
		
		// Loading screen
		document.onreadystatechange = function() {
			const state = document.readyState;
			if (state === 'complete' && loadElement) {
				loadElement.classList.toggle('active');
				loadElement.style.opacity = 0;
				setTimeout(() => {
					loadElement.style.visibility = "hidden";
				}, 1000);
			}
		};
	});
</script>

<style>
	#load{
		width:100%;
		height:100%;
		position:fixed;
		z-index:101;
		background:url(img/icons/preloader.svg) no-repeat center center rgba(0,0,0,1)
	}

	#load.active {
		opacity:0;
		transition: opacity 0.5s ease-in-out;
	}

	.startScreen {
		position:fixed;
		display : flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 100;
		width: 100%;
		height : 100%;
		background-color: var(--shade1);
		color : var(--shadeWhite);
		font-size: var(--fs1);
		font-family: var(--ff2);
		padding: 20%;
	}

	.startScreen h1 {
		font-size: var(--fs1);
		padding : auto;
		text-align: center;
	}

	.startScreen button {
		padding : 20px;
		border : 3px solid var(--shadeWhite);
		box-sizing: border-box; 
		color: var(--shadeWhite);
		background-color: transparent ; 
		border-radius: 5px;
		text-transform: uppercase;
		font-family: var(--ff3);
		font-weight: 600;
	}

	.startScreen button:hover {
		border : 3px solid var(--shadePop);
		background-color: var(--shadePop);
	}

	.startScreen button.fakeHoverEvent {
		border : 3px solid var(--shadePop);
		background-color: var(--shadePop);
	}
</style>

<div id="load"></div>

<div id="startScreen" class="startScreen">
	<h1>🙂</h1>
	<h1><span style="padding : 2px 10px; background-color : var(--shade2); border-radius : 5px ; font-variant:small-caps;">Guillaume Kuc <span style="font-variant : normal	;">.art</span></span> is all set.</h1>
	<button id="enterBtn">Enter</button>
</div><!--#startScreen-->
