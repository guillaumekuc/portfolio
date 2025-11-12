
// Utility class for animation-related operations

export class Animation {
	
	// Creates a programmatic hover event effect by temporarily adding a class
	// @param {HTMLElement} target - Element to apply programmatic hover to
	
	static programmaticHover(target) {
		if (!target) return;

		target.style.transition = 'none';
		target.classList.add('programmaticHover');
		setTimeout(() => {
			target.classList.remove('programmaticHover');
		}, 100);
	}


	// Coordinates the opening sequence animations by dispatching events to components
	// Each component handles its own animation logic internally

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

		// Links staggered animation - starts at 3s
		setTimeout(() => {
			window.dispatchEvent(new CustomEvent('linksAnimate'));
		}, 3000);
	}
}
