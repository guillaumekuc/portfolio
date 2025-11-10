import { DOM } from './dom.js';
import { Animation } from './animation.js';
import { stores } from '../stores.js';

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
		
		// State
		this.allRubrics = [];
		this.currentScreen = 'startScreen';
		this.rubricFocused = 3;
		this.menuSelected = 1;
		this.websitesCurrentIndex = 0;
		
		// Initialize stores to match instance state
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
		this.setupCartography();
		this.setupKeyboardNavigation();
		this.setupMouseNavigation();
		window.addEventListener('resize', DOM.reSnap);
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
					self.currentScreen = element.id;
					// Update the store so Svelte components can react to changes
					stores.navigation.currentScreen.set(element.id);
					
					// Refresh slick position when screen becomes visible
					if (typeof window.$ !== 'undefined' && window.$.fn.slick) {
						window.$('.gallery').slick('setPosition');
					}
					
					const gallery = document.querySelector('#' + self.currentScreen + ' .gallery');
					if (gallery) {
						gallery.firstChild.focus();
						const video = document.querySelector('.slick-current video');
						if (video) video.play();
					}
					
					if (self.currentScreen === 'splashscreen' || self.currentScreen === 'startScreen') {
						const topArrow = document.querySelector('#topArrow');
						const bottomArrow = document.querySelector('#bottomArrow');
						if (topArrow) topArrow.classList.add('hidden');
						if (bottomArrow) bottomArrow.classList.add('hidden');
					}
					
					if (self.currentScreen === 'about') {
						const bottomArrow = document.querySelector('#bottomArrow');
						if (bottomArrow) bottomArrow.classList.add('hidden');
					}

					if (self.currentScreen === 'websitesFolio') {
						document.querySelectorAll('.websiteLink').forEach((link) => {
							link.classList.remove('focus');
						});
						if (self.websitesArray[self.websitesCurrentIndex]) {
							self.websitesArray[self.websitesCurrentIndex].classList.add('focus');
						}
						// Update the store
						stores.navigation.websitesCurrentIndex.set(self.websitesCurrentIndex);
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
					
					if (self.musicPlayer && self.musicPlayer.unpauseWhenDone === true) {
						self.musicPlayer.play();
					}
				}
			}, { threshold: 1 });
			observer.observe(video.parentElement);
		}

		function revealFoliosWhenRubricsVisible() {
			const elementObserver = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting === true) {
					const rubricClass = Navigation.getRubricClass(self.rubricFocused);
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
	 */
	setupKeyboardNavigation() {
		document.addEventListener('keydown', (event) => this.handleKeyNavigation(event));
	}

	/**
	 * Handle keyboard navigation
	 */
	handleKeyNavigation(event) {
		// Prevent default for navigation keys
		const preventDefaultKeys = [
			'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
			' ', 'l', 'm', 'z', 's', 'd', 'q', 'Enter'
		];
		if (preventDefaultKeys.includes(event.key)) {
			event.preventDefault();
		}

		// Music shortcuts (q, d, z, s, space, m, l)
		if (['q', 'd', 'z', 's', ' ', 'm', 'l'].includes(event.key)) {
			if (this.musicPlayer) {
				this.musicPlayer.handleKeyboardShortcut(event.key);
			}
		}

		// Screen-specific navigation
		if (this.currentScreen === 'startScreen') {
			if (event.key === 'Enter') {
				const enterBtn = document.querySelector('#enterBtn');
				if (enterBtn) {
					Animation.fakeHoverEvent(enterBtn);
					enterBtn.click();
				}
			}
			return;
		}

		if (this.currentScreen === 'splashscreen') {
			this.handleSplashscreenNavigation(event);
			return;
		}

		if (this.currentScreen === 'rubrics') {
			this.handleRubricsNavigation(event);
			return;
		}

		// Other screens navigation
		this.handleOtherScreensNavigation(event);
	}

	handleSplashscreenNavigation(event) {
		if (event.key === 'ArrowDown') {
			document.querySelectorAll('.splashNav a').forEach((link) => {
				link.classList.remove('focus');
			});
			this.menuSelected = 1;
			stores.navigation.menuSelected.set(1);
			Animation.fakeHoverEvent(document.querySelector('#worksBtn'));
			document.querySelector('#rubrics')?.scrollIntoView();
			return;
		}

		if (event.key === 'ArrowLeft') {
			if (this.menuSelected === 1) {
				this.menuSelected = 0;
			} else if (this.menuSelected === 0) {
				this.menuSelected = 2;
			} else if (this.menuSelected === 2) {
				this.menuSelected = 1;
			}
			stores.navigation.menuSelected.set(this.menuSelected);
			this.updateSplashNavFocus();
			return;
		}

		if (event.key === 'ArrowRight') {
			if (this.menuSelected === 2) {
				this.menuSelected = 0;
			} else if (this.menuSelected === 1) {
				this.menuSelected = 2;
			} else if (this.menuSelected === 0) {
				this.menuSelected = 1;
			}
			stores.navigation.menuSelected.set(this.menuSelected);
			this.updateSplashNavFocus();
			return;
		}

		if (event.key === 'Enter') {
			if (this.menuSelected === 0) {
				const blogBtn = document.querySelector('#blogBtn');
				if (blogBtn) {
					window.open(blogBtn.getAttribute('href')).focus();
				}
				document.querySelectorAll('.splashNav a').forEach((link) => {
					link.classList.remove('focus');
				});
				this.menuSelected = 1;
				stores.navigation.menuSelected.set(1);
			} else if (this.menuSelected === 1) {
				document.querySelector('#rubrics')?.scrollIntoView();
				document.querySelectorAll('.splashNav a').forEach((link) => {
					link.classList.remove('focus');
				});
				this.menuSelected = 1;
				stores.navigation.menuSelected.set(1);
			} else if (this.menuSelected === 2) {
				window.open('mailto:guillaume@guillaumekuc.com', 'mail');
				document.querySelectorAll('.splashNav a').forEach((link) => {
					link.classList.remove('focus');
				});
				this.menuSelected = 1;
				stores.navigation.menuSelected.set(1);
			}
		}
	}

	updateSplashNavFocus() {
		document.querySelectorAll('.splashNav a').forEach((link) => {
			link.classList.remove('focus');
		});
		if (this.menuSelected === 0) {
			const blogBtn = document.querySelector('#blogBtn');
			if (blogBtn) blogBtn.classList.add('focus');
		} else if (this.menuSelected === 1) {
			const worksBtn = document.querySelector('#worksBtn');
			if (worksBtn) worksBtn.classList.add('focus');
		} else if (this.menuSelected === 2) {
			const contactBtn = document.querySelector('#contactBtn');
			if (contactBtn) contactBtn.classList.add('focus');
		}
	}

	handleRubricsNavigation(event) {
		if (event.key === 'ArrowRight') {
			if (this.rubricFocused === 5) {
				this.rubricFocused = 1;
			} else {
				this.rubricFocused = parseInt(this.rubricFocused) + 1;
			}
			this.updateRubricFocus();
			return;
		}

		if (event.key === 'ArrowLeft') {
			if (this.rubricFocused === 1) {
				this.rubricFocused = 5;
			} else {
				this.rubricFocused = parseInt(this.rubricFocused) - 1;
			}
			this.updateRubricFocus();
			return;
		}

		if (event.key === 'ArrowUp') {
			const isChrome = Boolean(window.chrome);
			if (isChrome) {
				// Chrome workaround
				document.querySelector('#header')?.classList.add('hidden');
				document.querySelector('#footer')?.classList.add('hidden');
				document.querySelector('#splashscreen')?.scrollIntoView();
				setTimeout(() => {
					document.querySelector('#header')?.classList.remove('hidden');
					document.querySelector('#footer')?.classList.remove('hidden');
				}, 500);
			} else {
				document.querySelector('#splashscreen')?.scrollIntoView();
			}
			return;
		}

		if (event.key === 'Enter' || event.key === 'ArrowDown') {
			Navigation.goToFolios(this.currentScreen);
		}
	}

	updateRubricFocus() {
		const idToFocus = '#rBtn' + this.rubricFocused;
		this.allRubrics.forEach((rubric) => rubric.classList.remove('focus'));
		const rubricElement = document.querySelector(idToFocus);
		if (rubricElement) rubricElement.classList.add('focus');
		
		const target = '#hnBtn' + this.rubricFocused;
		document.querySelectorAll('.headerNav a').forEach((link) => {
			link.classList.remove('focus');
		});
		const headerNavLink = document.querySelector(target);
		if (headerNavLink) headerNavLink.classList.add('focus');
		
		const rubricClass = Navigation.getRubricClass(this.rubricFocused);
		Navigation.hideIrrelevantFolios(rubricClass);
		
		// Update the store
		stores.navigation.rubricFocused.set(this.rubricFocused);
	}

	handleOtherScreensNavigation(event) {
		if (event.key === 'ArrowUp') {
			const prevSibling = DOM.previousVisibleSibling(document.querySelector('#' + this.currentScreen));
			if (prevSibling) prevSibling.scrollIntoView();
			return;
		}

		if (event.key === 'ArrowDown') {
			const nextSibling = DOM.nextVisibleSibling(document.querySelector('#' + this.currentScreen));
			if (nextSibling) nextSibling.scrollIntoView();
			return;
		}

		const scrollThis = document.querySelector('#' + this.currentScreen + ' .scrollThis');
		if (scrollThis) {
			if (event.key === 'ArrowLeft') {
				scrollThis.scrollTop -= 30;
				return;
			}
			if (event.key === 'ArrowRight') {
				scrollThis.scrollTop += 30;
				return;
			}
		}

		// Music playlist folio navigation
		if (this.currentScreen === 'musicPlaylistFolio') {
			this.handleMusicPlaylistNavigation(event);
			return;
		}

		// Websites folio navigation
		if (this.currentScreen === 'websitesFolio') {
			this.handleWebsitesNavigation(event);
			return;
		}

		// Video gallery navigation
		const galleryVideo = document.querySelector('#' + this.currentScreen + ' .gallery video');
		if (galleryVideo) {
			if (['ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
				const currentVideo = document.querySelector('.slick-current video');
				if (currentVideo) currentVideo.play();
			}
			return;
		}

		// Large video navigation
		const largeVideo = document.querySelector('#' + this.currentScreen + ' .largeVideo');
		if (largeVideo && event.key === 'Enter') {
			if (largeVideo.currentTime > 0 && !largeVideo.paused && !largeVideo.ended && largeVideo.readyState > 2) {
				largeVideo.pause();
				const playBtn = largeVideo.parentElement.querySelector('.videoPlayBtn');
				if (playBtn) playBtn.classList.remove('hidden');
				if (this.musicPlayer && this.musicPlayer.isPlaying === false && this.musicPlayer.unpauseWhenDone === true) {
					this.musicPlayer.play();
				}
			} else {
				largeVideo.play();
				const playBtn = largeVideo.parentElement.querySelector('.videoPlayBtn');
				if (playBtn) playBtn.classList.add('hidden');
				if (this.musicPlayer && this.musicPlayer.isPlaying === true && !largeVideo.muted) {
					this.musicPlayer.pause();
					this.musicPlayer.unpauseWhenDone = true;
				} else {
					this.musicPlayer.unpauseWhenDone = false;
				}
			}
			return;
		}

		// About screen navigation
		if (this.currentScreen === 'about' && event.key === 'Enter') {
			Animation.fakeHoverEvent(document.querySelector('#backToTop'));
			document.querySelector('#splashscreen')?.scrollIntoView();
		}
	}

	handleMusicPlaylistNavigation(event) {
		if (!this.musicPlayer) return;

		function scrollIfNeeded(element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start'
			});
		}

		if (event.key === 'ArrowRight') {
			const currentIndex = this.musicPlayer.currentIndex;
			this.musicPlayer.nextTrackHandler();
			// Scroll to the new track after it's been set
			setTimeout(() => {
				const track = document.querySelectorAll('.musicPlaylist li')[this.musicPlayer.currentIndex];
				if (track) scrollIfNeeded(track);
			}, 10);
		}

		if (event.key === 'ArrowLeft') {
			const currentIndex = this.musicPlayer.currentIndex;
			this.musicPlayer.previousTrackHandler();
			// Scroll to the new track after it's been set
			setTimeout(() => {
				const track = document.querySelectorAll('.musicPlaylist li')[this.musicPlayer.currentIndex];
				if (track) scrollIfNeeded(track);
			}, 10);
		}
	}

	handleWebsitesNavigation(event) {
		if (event.key === 'ArrowRight') {
			if (this.websitesCurrentIndex < 1) {
				this.websitesCurrentIndex = this.websitesCurrentIndex + 1;
			} else if (this.websitesCurrentIndex === 1) {
				this.websitesCurrentIndex = 0;
			}
			stores.navigation.websitesCurrentIndex.set(this.websitesCurrentIndex);
			document.querySelectorAll('.websiteLink').forEach((link) => {
				link.classList.remove('focus');
			});
			if (this.websitesArray[this.websitesCurrentIndex]) {
				this.websitesArray[this.websitesCurrentIndex].classList.add('focus');
			}
		}

		if (event.key === 'ArrowLeft') {
			if (this.websitesCurrentIndex > 0) {
				this.websitesCurrentIndex = this.websitesCurrentIndex - 1;
			} else if (this.websitesCurrentIndex === 0) {
				this.websitesCurrentIndex = 1;
			}
			stores.navigation.websitesCurrentIndex.set(this.websitesCurrentIndex);
			document.querySelectorAll('.websiteLink').forEach((link) => {
				link.classList.remove('focus');
			});
			if (this.websitesArray[this.websitesCurrentIndex]) {
				this.websitesArray[this.websitesCurrentIndex].classList.add('focus');
			}
		}

		if (event.key === 'Enter') {
			if (this.websitesArray[this.websitesCurrentIndex]) {
				window.open(this.websitesArray[this.websitesCurrentIndex].getAttribute('href'));
			}
		}
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
		return this.currentScreen;
	}
}

