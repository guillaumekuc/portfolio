/**
 * Svelte action: shifts node's backgroundPosition on scroll to create a parallax effect.
 * Uses getBoundingClientRect so it works for elements at any scroll position.
 */
export function parallax(node, factor = 0.3) {
	let rafId = null;

	function onScroll() {
		if (rafId) cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => {
			const offset = window.scrollY * factor;
			node.style.backgroundPosition = `center calc(50% + ${offset}px)`;
			rafId = null;
		});
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	return {
		destroy() {
			window.removeEventListener('scroll', onScroll);
			if (rafId) cancelAnimationFrame(rafId);
		},
		update(newFactor) {
			factor = newFactor;
		}
	};
}
