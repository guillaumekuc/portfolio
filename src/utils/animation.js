// Animation utilities
export class Animation {
	// Creates a programmatic hover effect by temporarily adding a class
	static programmaticHover(target) {
		if (!target) return;

		target.style.transition = 'none';
		target.classList.add('programmaticHover');
		setTimeout(() => {
			target.classList.remove('programmaticHover');
		}, 100);
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

		// Links staggered animation - starts at 3s
		setTimeout(() => {
			window.dispatchEvent(new CustomEvent('linksAnimate'));
		}, 3000);
	}
}
