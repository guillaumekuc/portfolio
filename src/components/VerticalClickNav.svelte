<script>
	import { onMount } from 'svelte';
	import { currentScreen } from '../stores.js';
	import { DOM } from '../utils/dom.js';

	let topArrow;
	let bottomArrow;

	function clickTopArrow() {
		let currentScreenValue;
		currentScreen.subscribe(value => currentScreenValue = value)();
		
		if (currentScreenValue === 'rubrics') {
			document.querySelector('#splashscreen')?.scrollIntoView();
		} else {
			const currentElement = document.querySelector('#' + currentScreenValue);
			if (currentElement) {
				const prev = DOM.previousVisibleSibling(currentElement);
				if (prev) prev.scrollIntoView();
			}
		}
	}

	function clickBottomArrow() {
		let currentScreenValue;
		currentScreen.subscribe(value => currentScreenValue = value)();
		
		const currentElement = document.querySelector('#' + currentScreenValue);
		if (currentElement) {
			const next = DOM.nextVisibleSibling(currentElement);
			if (next) next.scrollIntoView();
		}
	}

	function displayBorderArrows(event) {
		let currentScreenValue;
		currentScreen.subscribe(value => currentScreenValue = value)();
		
		const topArea = 3.5 * 38.4;
		const bottomArea = window.innerHeight - 3.5 * 38.4;
		
		if (currentScreenValue !== 'splashscreen' && 
			currentScreenValue !== 'startScreen' &&
			event.clientY > bottomArea && 
			event.clientY < window.innerHeight - 1.5 * 38.4 &&
			event.clientX > 0.4 * window.innerWidth &&
			event.clientX < 0.6 * window.innerWidth) {
			if (bottomArrow) bottomArrow.classList.remove('hidden');
		} else if (currentScreenValue !== 'splashscreen' && 
			currentScreenValue !== 'startScreen' &&
			event.clientY < topArea && 
			event.clientY > 1.5 * 38.4 && 
			event.clientX > 0.4 * window.innerWidth &&
			event.clientX < 0.6 * window.innerWidth) {
			if (topArrow) topArrow.classList.remove('hidden');
		} else {
			if (topArrow) topArrow.classList.add('hidden');
			if (bottomArrow) bottomArrow.classList.add('hidden');
		}
	}

	onMount(() => {
		topArrow = document.querySelector('#topArrow');
		bottomArrow = document.querySelector('#bottomArrow');
		
		if (topArrow) {
			topArrow.addEventListener('click', clickTopArrow);
		}
		if (bottomArrow) {
			bottomArrow.addEventListener('click', clickBottomArrow);
		}
		
		window.addEventListener('mousemove', displayBorderArrows);
		
		return () => {
			if (topArrow) topArrow.removeEventListener('click', clickTopArrow);
			if (bottomArrow) bottomArrow.removeEventListener('click', clickBottomArrow);
			window.removeEventListener('mousemove', displayBorderArrows);
		};
	});
</script>

<style>
	.topArrow {
		position : fixed;
		top : calc(2 * var(--safeMargin) + 2px);
		left : calc((100% - 17px)/2);
		transform: translateX(-50%);
		z-index: 100;
		color:  var(--shadeWhite);
		background-color: var(--shade1);
		width : 4vh;
		min-width : 25px;
		height : 4vh;
		min-height: 25px;
		box-sizing: content-box;
		border : 7.5px solid var(--shade1);
		border-radius: 7.5px;
	}

	.bottomArrow {
		position : fixed;
		bottom : calc(2 * var(--safeMargin) + 2px);
		left : calc((100% - 17px) / 2);
		transform: translateX(-50%);
		z-index: 100;
		color:  var(--shadeWhite);
		background-color: var(--shade1);
		width : 4vh;
		min-width : 25px;
		height : 4vh;
		min-height: 25px;
		box-sizing: content-box;
		border : 7.5px solid var(--shade1);
		border-radius: 7.5px;
		margin-bottom: 2px;
	}

	.topArrow:hover {
		cursor: pointer;
		background-color: var(--shadePop);
		border : 7.5px solid var(--shadePop);
	}

	.bottomArrow:hover{  
		cursor: pointer;
		background-color: var(--shadePop);
		border : 7.5px solid var(--shadePop);
	}
</style>

<div id="topArrow" class="topArrow hidden"><img src="/img/icons/upArrow.png" alt="Up arrow" /></div>
<div id="bottomArrow" class="bottomArrow hidden"><img src="/img/icons/downArrow.png" alt="Down arrow" /></div>
