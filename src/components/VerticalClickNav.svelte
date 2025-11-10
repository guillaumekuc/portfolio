<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';

	let topArrow;
	let bottomArrow;
	let showTopArrow = false;
	let showBottomArrow = false;

	function clickTopArrow() {
		const currentScreenValue = get(stores.navigation.currentScreen);
		
		if (currentScreenValue === 'rubrics') {
			const splashscreen = document.querySelector('#splashscreen');
			if (splashscreen) splashscreen.scrollIntoView();
		} else {
			const currentElement = document.querySelector('#' + currentScreenValue);
			if (currentElement) {
				const prev = DOM.previousVisibleSibling(currentElement);
				if (prev) prev.scrollIntoView();
			}
		}
	}

	function clickBottomArrow() {
		const currentScreenValue = get(stores.navigation.currentScreen);
		
		const currentElement = document.querySelector('#' + currentScreenValue);
		if (currentElement) {
			const next = DOM.nextVisibleSibling(currentElement);
			if (next) next.scrollIntoView();
		}
	}

	function displayBorderArrows(event) {
		const currentScreenValue = get(stores.navigation.currentScreen);
		
		const topArea = 3.5 * 38.4;
		const bottomArea = window.innerHeight - 3.5 * 38.4;
		
		if (currentScreenValue !== 'splashscreen' && 
			currentScreenValue !== 'startScreen' &&
			event.clientY > bottomArea && 
			event.clientY < window.innerHeight - 1.5 * 38.4 &&
			event.clientX > 0.4 * window.innerWidth &&
			event.clientX < 0.6 * window.innerWidth) {
			showBottomArrow = true;
			showTopArrow = false;
		} else if (currentScreenValue !== 'splashscreen' && 
			currentScreenValue !== 'startScreen' &&
			event.clientY < topArea && 
			event.clientY > 1.5 * 38.4 && 
			event.clientX > 0.4 * window.innerWidth &&
			event.clientX < 0.6 * window.innerWidth) {
			showTopArrow = true;
			showBottomArrow = false;
		} else {
			showTopArrow = false;
			showBottomArrow = false;
		}
	}

	onMount(() => {
		window.addEventListener('mousemove', displayBorderArrows);
		
		return () => {
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

<div bind:this={topArrow} class="topArrow" class:hidden={!showTopArrow} on:click={clickTopArrow}>
	<img src="/img/icons/upArrow.png" alt="Up arrow" />
</div>
<div bind:this={bottomArrow} class="bottomArrow" class:hidden={!showBottomArrow} on:click={clickBottomArrow}>
	<img src="/img/icons/downArrow.png" alt="Down arrow" />
</div>
