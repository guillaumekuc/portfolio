import { DOM } from './dom.js';
import { Animation } from './animation.js';
import { stores } from '../stores.js';
import { get } from 'svelte/store';
import { shortcuts } from './shortcuts.js';
import { debugLog } from './debuglog.js';

/**
 * Navigation controller class
 * Handles keyboard navigation, mouse navigation, and scroll tracking
 * Also provides static utility methods for navigation operations
 */
export class Navigation {
	/**
	 * Static utility methods
	 */

	/**
	 * Maps category focus index to portfolio section class name
	 * @param {number} categoryFocused - Current category focus index (1-5)
	 * @returns {string} Portfolio section class name
	 */
	static getCategoryClass(categoryFocused) {
		const categoryClassMap = {
			1: 'portfolio-3d',
			2: 'portfolio-2d',
			3: 'portfolio-all',
			4: 'portfolio-music',
			5: 'portfolio-web'
		};
		return categoryClassMap[categoryFocused] || 'portfolio-all';
	}

	/**
	 * Scrolls to the next visible portfolio section from the current screen
	 * @param {string} currentScreenId - ID of the current screen
	 */
	static goToPortfolioSections(currentScreenId) {
		const currentElement = document.querySelector('#' + currentScreenId);
		if (!currentElement) return;

		// Find the first visible .portfolioSection element (not just any next sibling)
		const allPortfolioSections = document.querySelectorAll('.portfolioSection');
		let nextVisiblePortfolioSection = null;

		for (const portfolioSection of allPortfolioSections) {
			// Check if this portfolio section comes after the current screen in the DOM
			if (currentElement.compareDocumentPosition(portfolioSection) & Node.DOCUMENT_POSITION_FOLLOWING) {
				// Verify it's actually visible using computed style
				const style = window.getComputedStyle(portfolioSection);
				if (style.display !== 'none' && style.visibility !== 'hidden') {
					nextVisiblePortfolioSection = portfolioSection;
					break;
				}
			}
		}

		if (nextVisiblePortfolioSection) {
			debugLog('Navigating to portfolio section:', nextVisiblePortfolioSection.id);
			nextVisiblePortfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	/**
	 * Updates portfolio section visibility store based on category class
	 * Components react to this store to show/hide portfolio sections
	 * @param {string} categoryClass - Class name of portfolio sections to show
	 */
	static hideIrrelevantPortfolioSections(categoryClass) {
		const visibilityMap = new Map();

		// Get all portfolio sections and determine visibility based on category class
		document.querySelectorAll('.portfolioSection').forEach((portfolioSection) => {
			const portfolioSectionId = portfolioSection.id;
			// Check if portfolio section has the matching category class
			const isVisible = portfolioSection.classList.contains(categoryClass);
			visibilityMap.set(portfolioSectionId, isVisible);
		});

		stores.navigation.portfolioSectionVisibility.set(visibilityMap);
		debugLog(
			'Filtered portfolio sections - showing:',
			categoryClass,
			'visible count:',
			Array.from(visibilityMap.values()).filter((v) => v).length
		);
	}

	/**
	 * Initializes scroll position to top
	 */
	static initializeScroll() {
		document.body.scroll(0, 0);
	}

	/**
	 * Instance methods for navigation controller
	 */
	constructor() {
		// State - only keep non-store properties
		this.allCategories = [];

		// Initialize stores
		stores.navigation.currentScreen.set('startScreen');
		stores.navigation.categoryFocused.set(3);
		stores.navigation.selectedMenuItem.set(1);
	}

	/**
	 * Initialize navigation controller
	 */
	init() {
		this.allCategories = document.querySelectorAll('.category');
		debugLog('Navigation initialized');
		this.setupScrollTracking();
		this.setupKeyboardNavigation();
		this.setupMouseNavigation();
		window.addEventListener('resize', DOM.reSnap);
		this.registerGlobalShortcuts();
	}

	/**
	 * Setup scroll tracking with IntersectionObserver
	 */
	setupScrollTracking() {
		const allFullPages = document.querySelectorAll('.fullPage');
		const self = this;

		function updateHashWhenVisible(element) {
			const elementObserver = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry.isIntersecting === true && entry.intersectionRatio >= 0.5) {
						// Check computed style - the most reliable way to detect if element is actually visible
						// This catches elements hidden via CSS class, inline styles, or any other method
						const style = window.getComputedStyle(element);
						if (style.display === 'none' || style.visibility === 'hidden') {
							return;
						}

						// Update the store - single source of truth
						stores.navigation.currentScreen.set(element.id);
						debugLog('Screen changed:', element.id);

						// Refresh slick position when screen becomes visible
						if (typeof window.$ !== 'undefined' && window.$.fn.slick) {
							window.$('.gallery').slick('setPosition');
						}

						const currentScreen = element.id;
						const gallery = document.querySelector('#' + currentScreen + ' .gallery');
						if (gallery) {
							gallery.firstChild.focus();
							const video = document.querySelector('.slick-current video');
							if (video) video.play();
						}

						if (currentScreen === 'splashscreen' || currentScreen === 'startScreen') {
							const topArrow = document.querySelector('#topArrow');
							const bottomArrow = document.querySelector('#bottomArrow');
							if (topArrow) topArrow.classList.add('hidden');
							if (bottomArrow) bottomArrow.classList.add('hidden');
						}

						if (currentScreen === 'about') {
							const bottomArrow = document.querySelector('#bottomArrow');
							if (bottomArrow) bottomArrow.classList.add('hidden');
						}

						// Websites component handles focus reactively via local state
						// No need to manipulate DOM here
					}
				},
				{ threshold: [0.5] }
			);

			elementObserver.observe(element);
		}

		function videoObserver(video) {
			const observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry.intersectionRatio !== 1 && !video.paused) {
						video.pause();
						const playBtn = video.parentElement.querySelector('.videoPlayBtn');
						if (playBtn) playBtn.classList.remove('hidden');

						const unpauseWhenDone = get(stores.music.unpauseWhenDone);
						const musicPlayer = get(stores.music.musicPlayer);
						if (musicPlayer && unpauseWhenDone === true) {
							musicPlayer.play();
						}
					}
				},
				{ threshold: 1 }
			);
			observer.observe(video.parentElement);
		}

		function revealPortfolioSectionsWhenCategoriesVisible() {
			const elementObserver = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting === true) {
						const categoryFocused = get(stores.navigation.categoryFocused);
						const categoryClass = Navigation.getCategoryClass(categoryFocused);
						setTimeout(() => {
							document.querySelectorAll('.' + categoryClass).forEach((portfolioSection) => {
								portfolioSection.classList.remove('hidden');
							});
						}, 500);
					}
				},
				{ threshold: [0.5] }
			);
			elementObserver.observe(document.querySelector('#categories'));
		}

		function hidePortfolioSectionsWhenSplashscreenVisible() {
			const elementObserver = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting === true) {
						setTimeout(() => {
							document.querySelectorAll('.portfolioSection').forEach((portfolioSection) => {
								portfolioSection.classList.add('hidden');
							});
						}, 500);
					}
				},
				{ threshold: [0.5] }
			);
			elementObserver.observe(document.querySelector('#splashscreen'));
		}

		revealPortfolioSectionsWhenCategoriesVisible();
		hidePortfolioSectionsWhenSplashscreenVisible();
		allFullPages.forEach((page) => updateHashWhenVisible(page));
		document.querySelectorAll('.largeVideo').forEach((video) => videoObserver(video));
	}

	/**
	 * Setup keyboard navigation event listener
	 * Note: Most shortcuts are now handled by components via shortcuts system
	 */
	setupKeyboardNavigation() {
		// Keyboard navigation is now handled by the shortcuts system
		// This method is kept for backward compatibility
	}

	/**
	 * Register global shortcuts (music controls and general navigation)
	 */
	registerGlobalShortcuts() {
		function handleMusicPrev() {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.handleKeyboardShortcut('q');
			}
		}

		function handleMusicNext() {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.handleKeyboardShortcut('d');
			}
		}

		function handleMusicVolUp() {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.handleKeyboardShortcut('z');
			}
		}

		function handleMusicVolDown() {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.handleKeyboardShortcut('s');
			}
		}

		function handleMusicPlayPause() {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.handleKeyboardShortcut(' ');
			}
		}

		function handleMusicMute() {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.handleKeyboardShortcut('m');
			}
		}

		function handleMusicLoop() {
			const musicPlayer = get(stores.music.musicPlayer);
			if (musicPlayer) {
				musicPlayer.handleKeyboardShortcut('l');
			}
		}

		function handleNavUp() {
			const currentScreen = get(stores.navigation.currentScreen);
			// Skip if screen has its own ArrowUp handler
			if (['categories', 'splashscreen', 'startScreen'].includes(currentScreen)) {
				return;
			}
			const prevSibling = DOM.previousVisibleSibling(document.querySelector('#' + currentScreen));
			if (prevSibling) {
				debugLog('Navigate up');
				prevSibling.scrollIntoView();
			}
		}

		function handleNavDown() {
			const currentScreen = get(stores.navigation.currentScreen);
			// Skip if screen has its own ArrowDown handler
			if (['splashscreen', 'categories'].includes(currentScreen)) {
				return;
			}
			const nextSibling = DOM.nextVisibleSibling(document.querySelector('#' + currentScreen));
			if (nextSibling) {
				debugLog('Navigate down');
				nextSibling.scrollIntoView();
			}
		}

		// Music shortcuts (always active)
		// Music player is accessed from stores when needed in handlers
		shortcuts.addGlobalShortcut('q', handleMusicPrev, 'music-prev');
		shortcuts.addGlobalShortcut('d', handleMusicNext, 'music-next');
		shortcuts.addGlobalShortcut('z', handleMusicVolUp, 'music-vol-up');
		shortcuts.addGlobalShortcut('s', handleMusicVolDown, 'music-vol-down');
		shortcuts.addGlobalShortcut(' ', handleMusicPlayPause, 'music-play-pause');
		shortcuts.addGlobalShortcut('m', handleMusicMute, 'music-mute');
		shortcuts.addGlobalShortcut('l', handleMusicLoop, 'music-loop');

		// General page navigation (ArrowUp/Down for most screens)
		shortcuts.addGlobalShortcut('ArrowUp', handleNavUp, 'nav-up');
		shortcuts.addGlobalShortcut('ArrowDown', handleNavDown, 'nav-down');
	}

	/**
	 * Setup mouse navigation
	 */
	setupMouseNavigation() {
		// Mobile/tablet detection
		window.mobileAndTabletCheck = function () {
			let check = false;
			(function (a) {
				if (
					/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
						a
					) ||
					/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
						a.substr(0, 4)
					)
				)
					check = true;
			})(navigator.userAgent || navigator.vendor || window.opera);
			return check;
		};

		// Splashscreen nav hover handler
		function splashscreenNavHoverHandler() {
			document.querySelectorAll('.splashNav a').forEach((link) => {
				link.classList.remove('focus');
			});
		}

		document.querySelectorAll('.splashNav a').forEach((link) => {
			link.addEventListener('mousemove', splashscreenNavHoverHandler);
		});
	}

	// Getters
	get currentScreenId() {
		return get(stores.navigation.currentScreen);
	}
}
