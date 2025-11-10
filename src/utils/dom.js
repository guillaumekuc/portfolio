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
		let nextElement = element.nextElementSibling;
		
		while (nextElement) {
			const style = window.getComputedStyle(nextElement);
			if (style.display !== 'none' && style.visibility !== 'hidden') {
				return nextElement;
			}
			nextElement = nextElement.nextElementSibling;
		}
		
		return null;
	}

	/**
	 * Finds the previous visible sibling element (skips hidden elements)
	 * @param {HTMLElement} element - Starting element
	 * @returns {HTMLElement|null} Previous visible sibling or null
	 */
	static previousVisibleSibling(element) {
		let previousElement = element.previousElementSibling;
		
		while (previousElement) {
			const style = window.getComputedStyle(previousElement);
			if (style.display !== 'none' && style.visibility !== 'hidden') {
				return previousElement;
			}
			previousElement = previousElement.previousElementSibling;
		}
		
		return null;
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
