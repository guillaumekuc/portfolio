/**
 * Utility class for animation-related operations
 */
export class Animation {
	/**
	 * Creates a programmatic hover event effect by temporarily adding a class
	 * @param {HTMLElement} target - Element to apply programmatic hover to
	 */
	static programmaticHover(target) {
		if (!target) return;

		target.style.transition = 'none';
		target.classList.add('programmaticHover');
		setTimeout(() => {
			target.classList.remove('programmaticHover');
		}, 100);
	}

	/**
	 * Animates the opening sequence when entering the site
	 * @param {Object} elements - Object containing DOM elements to animate
	 * @param {HTMLElement} elements.startScreen - Start screen element
	 * @param {HTMLElement} elements.art - Art element
	 * @param {HTMLElement} elements.title - Title element
	 * @param {HTMLElement} elements.subtitle - Subtitle element
	 * @param {HTMLElement} elements.tagline - Description element
	 * @param {HTMLElement} elements.domains - Domains element
	 * @param {HTMLElement} elements.splashNav - Navigation element
	 * @param {NodeList} elements.splashLinks - Splash link elements
	 * @param {NodeList} elements.splashNavLinks - Navigation link elements
	 */
	static animateOpening(elements) {
		const {
			startScreen,
			art,
			title,
			subtitle,
			tagline,
			domains,
			splashNav,
			splashLinks,
			splashNavLinks
		} = elements;

		// Fade out start screen
		if (startScreen) {
			startScreen.classList.add('fadeOut');
		}

		// Animate splash art
		if (art) art.style.transform = 'scale(1)';

		// Fade in text elements
		if (title) title.style.opacity = '100%';
		if (subtitle) subtitle.style.opacity = '100%';
		if (tagline) tagline.style.opacity = '100%';
		if (domains) domains.style.opacity = '100%';
		if (splashNav) splashNav.style.opacity = '100%';

		// Animate splash links with staggered timing
		let animStartTime = 3;
		if (splashLinks) {
			splashLinks.forEach((link) => {
				link.style.transition = `opacity 1s ease-out ${animStartTime}s`;
				link.style.opacity = '1';
				animStartTime += 0.25;
			});
		}

		// Animate navigation links
		if (splashNavLinks) {
			splashNavLinks.forEach((link) => {
				link.style.opacity = '100%';
				setTimeout(() => {
					link.style.pointerEvents = 'auto';
				}, 4000);
			});
		}
	}
}
