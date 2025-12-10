<button
	type="button"
	bind:this={topArrow}
	class="topArrow"
	class:hidden={!showTopArrow}
	on:click={clickTopArrow}
>
	<img src="/img/.old/icons/upArrow.png" alt="Up arrow" />
</button>

<button
	type="button"
	bind:this={bottomArrow}
	class="bottomArrow"
	class:hidden={!showBottomArrow}
	on:click={clickBottomArrow}
>
	<img src="/img/.old/icons/downArrow.png" alt="Down arrow" />
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

		if (currentScreenValue === 'splashscreen' || currentScreenValue === 'startScreen') {
			// Already at top, do nothing
			return;
		}

		const currentElement = document.querySelector(`#${currentScreenValue}`);
		if (currentElement) {
			const prev = DOM.previousVisibleSibling(currentElement);
			if (prev) {
				debugLog('Scroll to previous:', prev.id);
				prev.scrollIntoView({ behavior: 'smooth' });
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

	function getSafeMargin() {
		return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safeMargin'));
	}

	function displayBorderArrows(event) {
		const currentScreenValue = get(stores.navigation.currentScreen);
		const safeMargin = getSafeMargin();

		const topArea = 2.5 * safeMargin;
		const bottomArea = window.innerHeight - 2.5 * safeMargin;
		const topAreaMin = 1.5 * safeMargin;
		const bottomAreaMax = window.innerHeight - 1.5 * safeMargin;
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
	.topArrow,
	.bottomArrow {
		/* Local references to global variables */
		--arrow-safe-margin: var(--safeMargin);
		--arrow-color-text: var(--shadeWhite);
		--arrow-color-bg: transparent;
		--arrow-color-hover: var(--accentColor);

		/* Responsive values */
		--arrow-size: 48px;
		--arrow-border: 8px;
		--arrow-radius: 8px;
		--arrow-offset: calc(var(--arrow-safe-margin) + (var(--arrow-safe-margin) - var(--arrow-size)) / 2);

		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		color: var(--arrow-color-text);
		background-color: var(--arrow-color-bg);
		width: var(--arrow-size);
		height: var(--arrow-size);
		box-sizing: border-box;
		border: var(--arrow-border) solid var(--arrow-color-bg);
		border-radius: var(--arrow-radius);
		pointer-events: auto;
	}

	.topArrow {
		top: var(--arrow-offset);
	}

	.bottomArrow {
		bottom: var(--arrow-offset);
	}

	.topArrow:hover,
	.bottomArrow:hover {
		cursor: pointer;
		background-color: var(--arrow-color-hover);
		border-color: var(--arrow-color-hover);
	}

	.topArrow.hidden,
	.bottomArrow.hidden {
		display: none;
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.topArrow,
		.bottomArrow {
			--arrow-size: 40px;
			--arrow-border: 6px;
			--arrow-radius: 6px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.topArrow,
		.bottomArrow {
			--arrow-size: 34px;
			--arrow-border: 5px;
			--arrow-radius: 5px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.topArrow,
		.bottomArrow {
			--arrow-size: 28px;
			--arrow-border: 4px;
			--arrow-radius: 4px;
		}
	}
</style>
