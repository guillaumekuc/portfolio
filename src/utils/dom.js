/**
 * Utility class for DOM manipulation operations
 */
export class DOM {
	/**
	 * Finds the next visible sibling element (skips hidden elements)
	 * @param {HTMLElement} element - Starting element
	 * @returns {HTMLElement|null} Next visible sibling or null
	 */
	static nextVisibleSibling(element) {
		let nextVisibleElement = null;
		let nextElement = element.nextElementSibling;
		
		while (nextElement) {
			if (!nextElement.classList.contains('hidden')) {
				nextVisibleElement = nextElement;
				break;
			}
			nextElement = nextElement.nextElementSibling;
		}
		
		return nextVisibleElement;
	}

	/**
	 * Finds the previous visible sibling element (skips hidden elements)
	 * @param {HTMLElement} element - Starting element
	 * @returns {HTMLElement|null} Previous visible sibling or null
	 */
	static previousVisibleSibling(element) {
		let previousVisibleElement = null;
		let previousElement = element.previousElementSibling;
		
		while (previousElement) {
			if (!previousElement.classList.contains('hidden')) {
				previousVisibleElement = previousElement;
				break;
			}
			previousElement = previousElement.previousElementSibling;
		}
		
		return previousVisibleElement;
	}

	/**
	 * Scrolls by one pixel to force a resnap when the window is resized
	 * Used for CSS scroll-snap functionality
	 */
	static reSnap() {
		setTimeout(() => {
			document.body.scrollTop += 1;
			document.body.scrollTop -= 1;
		}, 500);
	}
}
