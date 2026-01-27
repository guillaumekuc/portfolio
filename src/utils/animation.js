// Animation utilities
export class Animation {
	// Creates a programmatic hover effect by temporarily adding a class
	static programmaticHover(target) {
		if (!target) return;

		// Store original transition to restore it later
		const originalTransition = target.style.transition;
		
		// Add the hover class with transition enabled for visual effect
		target.classList.add('programmaticHover');
		
		// Keep the class visible long enough to see the transition
		setTimeout(() => {
			target.classList.remove('programmaticHover');
			// Restore original transition if it was set
			if (originalTransition) {
				target.style.transition = originalTransition;
			} else {
				target.style.transition = '';
			}
		}, 300);
	}

	// Coordinates opening sequence animations by dispatching events to components
	static animateOpening() {
		// Start screen fade out - immediate
		window.dispatchEvent(new CustomEvent('startScreenAnimate'));

		// Art scale animation - immediate
		window.dispatchEvent(new CustomEvent('artAnimate'));

		// Navigation animation - immediate (CSS transitions handle link delays)
		window.dispatchEvent(new CustomEvent('navAnimate'));

		// Hero animation - offset by 2.75s to match overall timing
		setTimeout(() => {
			window.dispatchEvent(new CustomEvent('heroAnimate'));
		}, 2750);
	}
}
