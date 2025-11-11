<button
	type="button"
	bind:this={topArrow}
	class="topArrow"
	class:hidden={!showTopArrow}
	on:click={clickTopArrow}
>
	<img src="/img/icons/upArrow.png" alt="Up arrow" />
</button>
<button
	type="button"
	bind:this={bottomArrow}
	class="bottomArrow"
	class:hidden={!showBottomArrow}
	on:click={clickBottomArrow}
>
	<img src="/img/icons/downArrow.png" alt="Down arrow" />
</button>

<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';
	import { debugLog } from '../utils/debuglog.js';

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
		debugLog('Top arrow clicked');
		const currentScreenValue = get(stores.navigation.currentScreen);

		if (currentScreenValue === 'categories') {
			scrollToElement('splashscreen');
		} else {
			const currentElement = document.querySelector(`#${currentScreenValue}`);
			if (currentElement) {
				const prev = DOM.previousVisibleSibling(currentElement);
				if (prev) {
					debugLog('Scroll to previous:', prev.id);
					prev.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}
	}

	function clickBottomArrow() {
		debugLog('Bottom arrow clicked');
		const currentScreenValue = get(stores.navigation.currentScreen);

		const currentElement = document.querySelector(`#${currentScreenValue}`);
		if (currentElement) {
			const next = DOM.nextVisibleSibling(currentElement);
			if (next) {
				debugLog('Scroll to next:', next.id);
				next.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}

	function displayBorderArrows(event) {
		const currentScreenValue = get(stores.navigation.currentScreen);

		const topArea = 3.5 * 38.4;
		const bottomArea = window.innerHeight - 3.5 * 38.4;
		const topAreaMin = 1.5 * 38.4;
		const bottomAreaMax = window.innerHeight - 1.5 * 38.4;
		const xMin = 0.4 * window.innerWidth;
		const xMax = 0.6 * window.innerWidth;

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

		if (isBottomArea) {
			if (!showBottomArrow) {
				debugLog('[VerticalClickNav] Showing bottom arrow', {
					currentScreen: currentScreenValue,
					mouseX: event.clientX,
					mouseY: event.clientY
				});
				showBottomArrow = true;
				showTopArrow = false;
			}
		} else if (isTopArea) {
			if (!showTopArrow) {
				debugLog('[VerticalClickNav] Showing top arrow', {
					currentScreen: currentScreenValue,
					mouseX: event.clientX,
					mouseY: event.clientY
				});
				showTopArrow = true;
				showBottomArrow = false;
			}
		} else {
			if (showTopArrow || showBottomArrow) {
				debugLog('[VerticalClickNav] Hiding arrows', {
					currentScreen: currentScreenValue
				});
				showTopArrow = false;
				showBottomArrow = false;
			}
		}
	}

	onMount(() => {
		debugLog('[VerticalClickNav] Component mounted, adding mousemove listener');

		window.addEventListener('mousemove', displayBorderArrows);

		return () => {
			debugLog('[VerticalClickNav] Component unmounting, removing mousemove listener');
			window.removeEventListener('mousemove', displayBorderArrows);
		};
	});
</script>

<style>
	.topArrow {
		position: fixed;
		top: calc(2 * var(--safeMargin) + 2px);
		left: calc((100% - 17px) / 2);
		transform: translateX(-50%);
		z-index: 100;
		color: var(--shadeWhite);
		background-color: var(--shade1);
		width: 4vh;
		min-width: 25px;
		height: 4vh;
		min-height: 25px;
		box-sizing: content-box;
		border: 7.5px solid var(--shade1);
		border-radius: 7.5px;
		pointer-events: auto;
	}

	.bottomArrow {
		position: fixed;
		bottom: calc(2 * var(--safeMargin) + 2px);
		left: calc((100% - 17px) / 2);
		transform: translateX(-50%);
		z-index: 100;
		color: var(--shadeWhite);
		background-color: var(--shade1);
		width: 4vh;
		min-width: 25px;
		height: 4vh;
		min-height: 25px;
		box-sizing: content-box;
		border: 7.5px solid var(--shade1);
		border-radius: 7.5px;
		margin-bottom: 2px;
		pointer-events: auto;
	}

	.topArrow:hover {
		cursor: pointer;
		background-color: var(--shadePop);
		border: 7.5px solid var(--shadePop);
	}

	.bottomArrow:hover {
		cursor: pointer;
		background-color: var(--shadePop);
		border: 7.5px solid var(--shadePop);
	}

	.topArrow.hidden,
	.bottomArrow.hidden {
		display: none;
	}
</style>
