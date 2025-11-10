/**
 * Utility class for loading screen operations
 */
export class Loading {
	/**
	 * Initializes the loading screen animation
	 * @param {HTMLElement} loadElement - The loading screen element
	 */
	static initLoadingScreen(loadElement) {
		if (!loadElement) return;

		document.onreadystatechange = function() {
			const state = document.readyState;
			if (state === 'complete') {
				loadElement.classList.toggle('active');
				loadElement.style.opacity = 0;
				setTimeout(() => {
					loadElement.style.visibility = "hidden";
				}, 1000);
			}
		};
	}
}
