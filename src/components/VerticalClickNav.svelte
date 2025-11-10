<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';

	let topArrow;
	let bottomArrow;
	let showTopArrow = false;
	let showBottomArrow = false;

	function scrollToElement(id) {
		const element = document.querySelector(`#${id}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function clickTopArrow() {
		console.log('[VerticalClickNav] Top arrow clicked');
		const currentScreenValue = get(stores.navigation.currentScreen);
		console.log('[VerticalClickNav] Current screen:', currentScreenValue);
		
		if (currentScreenValue === 'rubrics') {
			console.log('[VerticalClickNav] Scrolling to splashscreen');
			scrollToElement('splashscreen');
		} else {
			const currentElement = document.querySelector(`#${currentScreenValue}`);
			if (currentElement) {
				const prev = DOM.previousVisibleSibling(currentElement);
				if (prev) {
					console.log('[VerticalClickNav] Scrolling to previous element:', prev.id);
					prev.scrollIntoView({ behavior: 'smooth' });
				} else {
					console.log('[VerticalClickNav] No previous element found');
				}
			}
		}
	}

	function clickBottomArrow() {
		console.log('[VerticalClickNav] Bottom arrow clicked');
		const currentScreenValue = get(stores.navigation.currentScreen);
		console.log('[VerticalClickNav] Current screen:', currentScreenValue);
		
		const currentElement = document.querySelector(`#${currentScreenValue}`);
		if (currentElement) {
			const next = DOM.nextVisibleSibling(currentElement);
			if (next) {
				console.log('[VerticalClickNav] Scrolling to next element:', next.id);
				next.scrollIntoView({ behavior: 'smooth' });
			} else {
				console.log('[VerticalClickNav] No next element found');
			}
		}
	}

	let lastLogTime = 0;
	const LOG_THROTTLE = 500; // Log every 500ms to reduce spam

	function displayBorderArrows(event) {
		// Always log first call to confirm function is being called
		if (lastLogTime === 0) {
			console.log('[VerticalClickNav] displayBorderArrows called for first time');
		}
		
		const now = Date.now();
		const shouldLog = now - lastLogTime > LOG_THROTTLE;
		
		const currentScreenValue = get(stores.navigation.currentScreen);
		
		const topArea = 3.5 * 38.4;
		const bottomArea = window.innerHeight - 3.5 * 38.4;
		const topAreaMin = 1.5 * 38.4;
		const bottomAreaMax = window.innerHeight - 1.5 * 38.4;
		const xMin = 0.4 * window.innerWidth;
		const xMax = 0.6 * window.innerWidth;
		
		// Log first call and periodically to confirm function is running
		if (shouldLog) {
			console.log('[VerticalClickNav] mousemove event', {
				mouseX: event.clientX,
				mouseY: event.clientY,
				currentScreen: currentScreenValue,
				topArea,
				bottomArea,
				topAreaMin,
				bottomAreaMax,
				xMin,
				xMax,
				windowHeight: window.innerHeight,
				windowWidth: window.innerWidth
			});
			lastLogTime = now;
		}
		
		// Check individual conditions for debugging
		const screenCheck = currentScreenValue !== 'splashscreen' && currentScreenValue !== 'startScreen';
		const bottomYCheck = event.clientY > bottomArea && event.clientY < bottomAreaMax;
		const bottomXCheck = event.clientX > xMin && event.clientX < xMax;
		const topYCheck = event.clientY < topArea && event.clientY > topAreaMin;
		const topXCheck = event.clientX > xMin && event.clientX < xMax;
		
		// Check bottom arrow conditions
		const isBottomArea = screenCheck && bottomYCheck && bottomXCheck;
		
		// Check top arrow conditions
		const isTopArea = screenCheck && topYCheck && topXCheck;
		
		// Log condition checks when in potential areas
		if (shouldLog && (event.clientY < topArea + 100 || event.clientY > bottomArea - 100)) {
			console.log('[VerticalClickNav] Condition checks', {
				screenCheck,
				currentScreen: `${currentScreenValue}`,
				bottomYCheck: `${event.clientY} > ${bottomArea} && ${event.clientY} < ${bottomAreaMax}`,
				bottomXCheck: `${event.clientX} > ${xMin} && ${event.clientX} < ${xMax}`,
				topYCheck: `${event.clientY} < ${topArea} && ${event.clientY} > ${topAreaMin}`,
				topXCheck: `${event.clientX} > ${xMin} && ${event.clientX} < ${xMax}`,
				isBottomArea,
				isTopArea
			});
		}
		
		if (isBottomArea) {
			console.log('bottomArea');
			if (!showBottomArrow) {
				console.log('[VerticalClickNav] Showing bottom arrow', {
					currentScreen: currentScreenValue,
					mouseX: event.clientX,
					mouseY: event.clientY,
					bottomArea,
					bottomAreaMax,
					xMin,
					xMax,
					windowHeight: window.innerHeight,
					windowWidth: window.innerWidth
				});
				showBottomArrow = true;
				showTopArrow = false;
			}
		} else if (isTopArea) {
			console.log('topArea');
			if (!showTopArrow) {
				console.log('[VerticalClickNav] Showing top arrow', {
					currentScreen: currentScreenValue,
					mouseX: event.clientX,
					mouseY: event.clientY,
					topArea,
					topAreaMin,
					xMin,
					xMax,
					windowHeight: window.innerHeight,
					windowWidth: window.innerWidth
				});
				showTopArrow = true;
				showBottomArrow = false;
			}
		} else {
			if (showTopArrow || showBottomArrow) {
				console.log('[VerticalClickNav] Hiding arrows', {
					currentScreen: currentScreenValue,
					mouseX: event.clientX,
					mouseY: event.clientY,
					wasShowingTop: showTopArrow,
					wasShowingBottom: showBottomArrow,
					isBottomArea,
					isTopArea
				});
				showTopArrow = false;
				showBottomArrow = false;
			}
		}
	}

	onMount(() => {
		console.log('[VerticalClickNav] Component mounted, adding mousemove listener');
		console.log('[VerticalClickNav] Initial state:', {
			showTopArrow,
			showBottomArrow,
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth
		});
		
		window.addEventListener('mousemove', displayBorderArrows);
		
		return () => {
			console.log('[VerticalClickNav] Component unmounting, removing mousemove listener');
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
		pointer-events: auto;
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
		pointer-events: auto;
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

	.topArrow.hidden,
	.bottomArrow.hidden {
		display: none;
	}
</style>

<button type="button" bind:this={topArrow} class="topArrow" class:hidden={!showTopArrow} on:click={clickTopArrow}>
	<img src="/img/icons/upArrow.png" alt="Up arrow" />
</button>
<button type="button" bind:this={bottomArrow} class="bottomArrow" class:hidden={!showBottomArrow} on:click={clickBottomArrow}>
	<img src="/img/icons/downArrow.png" alt="Down arrow" />
</button>
