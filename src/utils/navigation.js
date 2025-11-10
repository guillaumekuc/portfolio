/**
 * Utility class for navigation-related operations
 */
export class Navigation {
	/**
	 * Maps rubric focus index to folio class name
	 * @param {number} rubricFocused - Current rubric focus index (1-5)
	 * @returns {string} Folio class name
	 */
	static getRubricClass(rubricFocused) {
		const rubricClassMap = {
			1: "folio3D",
			2: "folio2D",
			3: "folioAll",
			4: "folioMusic",
			5: "folioWeb"
		};
		return rubricClassMap[rubricFocused] || "folioAll";
	}

	/**
	 * Scrolls to the next visible folio from the current screen
	 * @param {string} currentScreenId - ID of the current screen
	 */
	static goToFolios(currentScreenId) {
		const currentElement = document.querySelector('#' + currentScreenId);
		if (!currentElement) return;

		let nextVisibleFolio = null;
		let nextFolio = currentElement.nextElementSibling;
		
		while (nextFolio) {
			if (!nextFolio.classList.contains('hidden')) {
				nextVisibleFolio = nextFolio;
				break;
			}
			nextFolio = nextFolio.nextElementSibling;
		}
		
		if (nextVisibleFolio) {
			nextVisibleFolio.scrollIntoView();
		}
	}

	/**
	 * Hides all folios except those matching the rubric class
	 * @param {string} rubricClass - Class name of folios to show
	 */
	static hideIrrelevantFolios(rubricClass) {
		document.querySelectorAll('.folio').forEach(folio => {
			folio.classList.add('hidden');
		});
		document.querySelectorAll('.' + rubricClass).forEach(folio => {
			folio.classList.remove('hidden');
		});
	}

	/**
	 * Initializes scroll position to top
	 */
	static initializeScroll() {
		document.body.scroll(0, 0);
	}
}
