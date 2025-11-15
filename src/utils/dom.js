// DOM manipulation utilities
export class DOM {
	// Finds the next visible sibling element (skips hidden elements)
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

	// Finds the previous visible sibling element (skips hidden elements and non-fullPage elements like header)
	static previousVisibleSibling(element) {
		let previousElement = element.previousElementSibling;

		while (previousElement) {
			const style = window.getComputedStyle(previousElement);
			// Skip hidden elements and only return elements with fullPage class (skip header and other non-scrollable elements)
			if (style.display !== 'none' && style.visibility !== 'hidden' && previousElement.classList.contains('fullPage')) {
				return previousElement;
			}
			previousElement = previousElement.previousElementSibling;
		}

		return null;
	}

	// Scrolls by one pixel to force a resnap when window is resized (for CSS scroll-snap)
	static reSnap() {
		setTimeout(() => {
			document.body.scrollTop += 1;
			document.body.scrollTop -= 1;
		}, 500);
	}

	// Sets up an IntersectionObserver to watch splashscreen visibility
	// Returns cleanup function to disconnect observer
	// Component is visible when splashscreen is NOT visible (scrolled past)
	static setupSplashscreenVisibilityObserver(onVisibilityChange) {
		const splashscreen = document.querySelector('#splashscreen');
		if (!splashscreen) return null;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				// Component is visible when splashscreen is NOT visible (scrolled past)
				onVisibilityChange(!entry.isIntersecting);
			},
			{
				threshold: [0, 1],
				rootMargin: '-50px'
			}
		);

		observer.observe(splashscreen);

		// Return cleanup function
		return () => {
			observer.disconnect();
		};
	}
}
