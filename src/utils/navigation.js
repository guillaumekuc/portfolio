import { DOM } from './dom.js';
import { Animation } from './animation.js';
import { stores } from '../stores.js';
import { get } from 'svelte/store';
import { shortcuts } from './shortcuts.js';
import { debugLog } from './debuglog.js';

/**
 * Navigation controller class
 * Handles keyboard navigation, mouse navigation, and scroll tracking (cartography)
 * Also provides static utility methods for navigation operations
 */
export class Navigation {
	/**
	 * Static utility methods
	 */
	
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

	/**
	 * Instance methods for navigation controller
	 */
	constructor(musicPlayer, websitesArray) {
		// Dependencies
		this.musicPlayer = musicPlayer;
		this.websitesArray = websitesArray;
		
		// State - only keep non-store properties
		this.allRubrics = [];
		
		// Initialize stores
		stores.navigation.currentScreen.set('startScreen');
		stores.navigation.rubricFocused.set(3);
		stores.navigation.menuSelected.set(1);
		stores.navigation.websitesCurrentIndex.set(0);
	}

	/**
	 * Initialize navigation controller
	 */
	init() {
		this.allRubrics = document.querySelectorAll('.rubric');
		debugLog('Navigation initialized');
		this.setupCartography();
		this.setupKeyboardNavigation();
		this.setupMouseNavigation();
		window.addEventListener('resize', DOM.reSnap);
		this.registerGlobalShortcuts();
	}

	/**
	 * Setup scroll tracking (cartography) with IntersectionObserver
	 */
	setupCartography() {
		const allFullPages = document.querySelectorAll('.fullPage');
		const self = this;

			function updateHashWhenVisible(element) {
			const elementObserver = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting === true) {
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

					if (currentScreen === 'websitesFolio') {
						document.querySelectorAll('.websiteLink').forEach((link) => {
							link.classList.remove('focus');
						});
						const websitesCurrentIndex = get(stores.navigation.websitesCurrentIndex);
						if (self.websitesArray[websitesCurrentIndex]) {
							self.websitesArray[websitesCurrentIndex].classList.add('focus');
						}
					}
				}
			}, { threshold: [0.5] });

			elementObserver.observe(element);
		}

		function videoObserver(video) {
			const observer = new IntersectionObserver((entries) => {
				const entry = entries[0];
				if (entry.intersectionRatio != 1 && !video.paused) {
					video.pause();
					const playBtn = video.parentElement.querySelector('.videoPlayBtn');
					if (playBtn) playBtn.classList.remove('hidden');
					
				const unpauseWhenDone = get(stores.music.unpauseWhenDone);
				if (self.musicPlayer && unpauseWhenDone === true) {
					self.musicPlayer.play();
				}
				}
			}, { threshold: 1 });
			observer.observe(video.parentElement);
		}

		function revealFoliosWhenRubricsVisible() {
			const elementObserver = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting === true) {
					const rubricFocused = get(stores.navigation.rubricFocused);
					const rubricClass = Navigation.getRubricClass(rubricFocused);
					setTimeout(() => {
						document.querySelectorAll('.' + rubricClass).forEach((folio) => {
							folio.classList.remove('hidden');
						});
					}, 500);
				}
			}, { threshold: [0.5] });
			elementObserver.observe(document.querySelector('#rubrics'));
		}

		function hideFoliosWhenSplashscreenVisible() {
			const elementObserver = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting === true) {
					setTimeout(() => {
						document.querySelectorAll('.folio').forEach((folio) => {
							folio.classList.add('hidden');
						});
					}, 500);
				}
			}, { threshold: [0.5] });
			elementObserver.observe(document.querySelector('#splashscreen'));
		}

		revealFoliosWhenRubricsVisible();
		hideFoliosWhenSplashscreenVisible();
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
		const self = this;

		function handleMusicPrev() {
			if (self.musicPlayer) {
				self.musicPlayer.handleKeyboardShortcut('q');
			}
		}

		function handleMusicNext() {
			if (self.musicPlayer) {
				self.musicPlayer.handleKeyboardShortcut('d');
			}
		}

		function handleMusicVolUp() {
			if (self.musicPlayer) {
				self.musicPlayer.handleKeyboardShortcut('z');
			}
		}

		function handleMusicVolDown() {
			if (self.musicPlayer) {
				self.musicPlayer.handleKeyboardShortcut('s');
			}
		}

		function handleMusicPlayPause() {
			if (self.musicPlayer) {
				self.musicPlayer.handleKeyboardShortcut(' ');
			}
		}

		function handleMusicMute() {
			if (self.musicPlayer) {
				self.musicPlayer.handleKeyboardShortcut('m');
			}
		}

		function handleMusicLoop() {
			if (self.musicPlayer) {
				self.musicPlayer.handleKeyboardShortcut('l');
			}
		}

		function handleNavUp() {
			const currentScreen = get(stores.navigation.currentScreen);
			// Skip if screen has its own ArrowUp handler
			if (['rubrics', 'splashscreen', 'startScreen'].includes(currentScreen)) {
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
			if (['splashscreen', 'rubrics'].includes(currentScreen)) {
				return;
			}
			const nextSibling = DOM.nextVisibleSibling(document.querySelector('#' + currentScreen));
			if (nextSibling) {
				debugLog('Navigate down');
				nextSibling.scrollIntoView();
			}
		}

		// Music shortcuts (always active)
		if (this.musicPlayer) {
			shortcuts.addGlobalShortcut('q', handleMusicPrev, 'music-prev');
			shortcuts.addGlobalShortcut('d', handleMusicNext, 'music-next');
			shortcuts.addGlobalShortcut('z', handleMusicVolUp, 'music-vol-up');
			shortcuts.addGlobalShortcut('s', handleMusicVolDown, 'music-vol-down');
			shortcuts.addGlobalShortcut(' ', handleMusicPlayPause, 'music-play-pause');
			shortcuts.addGlobalShortcut('m', handleMusicMute, 'music-mute');
			shortcuts.addGlobalShortcut('l', handleMusicLoop, 'music-loop');
		}

		// General page navigation (ArrowUp/Down for most screens)
		shortcuts.addGlobalShortcut('ArrowUp', handleNavUp, 'nav-up');
		shortcuts.addGlobalShortcut('ArrowDown', handleNavDown, 'nav-down');
	}


	/**
	 * Setup mouse navigation
	 */
	setupMouseNavigation() {
		// Mobile/tablet detection
		window.mobileAndTabletCheck = function() {
			let check = false;
			(function(a) {
				if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
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

