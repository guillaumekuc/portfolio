import { DOM } from './dom.js';
import { stores } from '../stores.js';
import { get } from 'svelte/store';
import { shortcuts } from './shortcuts.js';
import { debugLog } from './debuglog.js';
import navConfig from '../config/nav.json';
import portfolioConfig from '../config/portfolio.json';

// Navigation controller - handles keyboard/mouse navigation and scroll tracking
export class Navigation {
	// Flag to suppress IntersectionObserver actions during programmatic navigation
	static isNavigating = false;
	static overlay = null;
	
	// Show navigation overlay (only covers content, not header/footer)
	static showOverlay() {
		if (!this.overlay) {
			// Get actual header and footer heights dynamically
			const header = document.getElementById('header');
			const footer = document.getElementById('footer');
			const headerHeight = header ? header.offsetHeight : 0;
			const footerHeight = footer ? footer.offsetHeight : 0;
			
			this.overlay = document.createElement('div');
			this.overlay.id = 'navOverlay';
			this.overlay.style.position = 'fixed';
			this.overlay.style.top = `${headerHeight}px`;
			this.overlay.style.left = '0';
			this.overlay.style.right = '0';
			this.overlay.style.bottom = `${footerHeight}px`;
			this.overlay.style.backgroundColor = '#000';
			this.overlay.style.opacity = '0';
			this.overlay.style.transition = 'opacity 0.15s ease';
			this.overlay.style.zIndex = '50';
			this.overlay.style.pointerEvents = 'none';
			this.overlay.setAttribute('aria-hidden', 'true');
			this.overlay.setAttribute('role', 'presentation');
			
			document.body.appendChild(this.overlay);
		}
		requestAnimationFrame(() => {
			if (this.overlay) {
				this.overlay.style.opacity = '1';
			}
		});
	}
	
	// Hide navigation overlay
	static hideOverlay() {
		if (this.overlay) {
			this.overlay.style.opacity = '0';
			setTimeout(() => {
				if (this.overlay && this.overlay.parentNode) {
					this.overlay.parentNode.removeChild(this.overlay);
					this.overlay = null;
				}
			}, 150);
		}
	}
	// Scrolls to the next visible portfolio section from the current screen
	static goToPortfolioSections(currentScreenId) {
		const currentElement = document.querySelector('#' + currentScreenId);
		if (!currentElement) return;

		// Get visibility from store instead of querying DOM
		const visibility = get(stores.navigation.portfolioSectionVisibility);
		
		// Find the first visible portfolio section after current screen
		for (const section of portfolioConfig.portfolioSections) {
			// Check if section is visible using store
			const isVisible = !visibility || visibility.size === 0 
				? true 
				: (visibility.get(section.id) ?? true);
			
			if (!isVisible) continue;
			
			// Check if this section comes after current screen in DOM
			const sectionElement = document.getElementById(section.id);
			if (sectionElement && 
				currentElement.compareDocumentPosition(sectionElement) & Node.DOCUMENT_POSITION_FOLLOWING) {
				debugLog('Navigating to portfolio section:', section.id);
				sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				break;
			}
		}
	}

	// Filters portfolio sections based on nav item target
	// target can be: 'portfolio-2d', 'portfolio-3d', 'portfolio-music', 'portfolio-web', 'portfolio-all', 'portfolio-about', 'about', or null/undefined for external items
	static filterPortfolioSectionsByNavTarget(target) {
		const visibilityMap = new Map();

		// Process portfolio sections from config
		portfolioConfig.portfolioSections.forEach((section) => {
			const portfolioSectionId = section.id;
			const categories = section.categories.split(/\s+/);
			const hasAnyCategory = categories.includes('any');
			let isVisible = false;

			// Sections with "any" category should always be visible regardless of filtering
			if (hasAnyCategory) {
				isVisible = true;
			} else if (target === 'portfolio-all') {
				// Show all portfolio sections (anything with portfolio-all category)
				isVisible = categories.includes('portfolio-all');
			} else if (target && target.startsWith('portfolio-')) {
				// Show only sections with the matching portfolio category
				isVisible = categories.includes(target);
			} else {
				// External items (blog, contact) or no target - hide all portfolio sections
				isVisible = false;
			}

			visibilityMap.set(portfolioSectionId, isVisible);
		});

		// Handle about section separately (it's not in portfolio config)
		// Check if about section exists in DOM for backward compatibility
		const aboutSection = document.querySelector('#about');
		if (aboutSection) {
			const categoriesAttr = aboutSection.getAttribute('data-categories');
			const categories = categoriesAttr ? categoriesAttr.split(/\s+/) : [];
			const hasAnyCategory = categories.includes('any');
			const isAboutSection = aboutSection.id === 'about' || categories.includes('portfolio-about');
			let isVisible = false;

			if (hasAnyCategory) {
				isVisible = true;
			} else if (target === 'about' || target === 'portfolio-about') {
				isVisible = isAboutSection || hasAnyCategory;
			} else if (target === 'portfolio-all') {
				// About section should be visible when showing all
				isVisible = categories.includes('portfolio-all') || categories.includes('any');
			} else {
				isVisible = false;
			}

			visibilityMap.set('about', isVisible);
		}

		stores.navigation.portfolioSectionVisibility.set(visibilityMap);
		debugLog(
			'Filtered portfolio sections by nav target:',
			target,
			'visible count:',
			Array.from(visibilityMap.values()).filter((v) => v).length
		);
	}

	static initializeScroll() {
		document.body.scroll(0, 0);
	}

	// Navigate back to splashscreen/home
	static goToHome() {
		const htmlElement = document.documentElement;
		let scrollTimer;
		let cleanupDone = false;
		
		const cleanup = () => {
			if (cleanupDone) return;
			cleanupDone = true;
			htmlElement.style.scrollSnapType = 'y mandatory';
			Navigation.isNavigating = false;
			window.removeEventListener('scroll', onScroll);
			clearTimeout(scrollTimer);
			clearTimeout(fallbackTimer);
		};
		
		const onScroll = () => {
			clearTimeout(scrollTimer);
			scrollTimer = setTimeout(cleanup, 200);
		};
		
		// Suppress IntersectionObserver and snap during scroll
		Navigation.isNavigating = true;
		htmlElement.style.scrollSnapType = 'none';
		
		window.addEventListener('scroll', onScroll, { passive: true });
		window.scrollTo({ top: 0, behavior: 'smooth' });
		
		// Fallback cleanup
		const fallbackTimer = setTimeout(cleanup, 3000);
	}

	// Static method to refresh scroll tracking when new sections are added
	static refreshScrollTracking() {
		const controller = get(stores.navigation.controller);
		if (controller) {
			controller.refreshScrollTracking();
		}
	}

	constructor() {
		// State - only keep non-store properties
		// Store values are initialized in stores.js - single source of truth
	}

	init() {
		debugLog('Navigation initialized');
		this.setupScrollTracking();
		this.setupKeyboardNavigation();
		this.setupMouseNavigation();
		window.addEventListener('resize', DOM.reSnap);
		this.registerGlobalShortcuts();
		
		// Initialize filtering with CTA target (default active category)
		const ctaItem = navConfig.navigation.find(item => item.cta === true);
		if (ctaItem && ctaItem.type === 'internal' && ctaItem.target) {
			stores.navigation.currentNavTarget.set(ctaItem.target);
			Navigation.filterPortfolioSectionsByNavTarget(ctaItem.target);
			debugLog('Initialized filtering with CTA target:', ctaItem.target);
		}
	}

	// Setup scroll tracking with IntersectionObserver
	setupScrollTracking() {
		this.refreshScrollTracking();
	}

	// Refresh scroll tracking - can be called when new sections are added to DOM
	refreshScrollTracking() {
		const allFullPages = document.querySelectorAll('.fullPage');

		function updateHashWhenVisible(element) {
			const elementObserver = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry.isIntersecting === true && entry.intersectionRatio >= 0.4) {
						const style = window.getComputedStyle(element);
						if (style.display === 'none' || style.visibility === 'hidden') return;

						const previousScreen = get(stores.navigation.currentScreen);
						if (previousScreen === element.id) return;

						// During navigation, only update if we've reached high visibility (80%+)
						// This prevents intermediate screens from registering but allows final destination
						if (Navigation.isNavigating && entry.intersectionRatio < 0.8) return;

						stores.navigation.currentScreen.set(element.id);
						debugLog('Screen changed:', element.id);

						// Refresh slick position when screen becomes visible
						if (typeof window.$ !== 'undefined' && window.$.fn.slick) {
							window.$('.gallery').slick('setPosition');
						}

						const gallery = document.querySelector('#' + element.id + ' .gallery');
						if (gallery) {
							gallery.firstChild.focus();
							const video = document.querySelector('.slick-current video');
							if (video) video.play();
						}

						if (element.id === 'splashscreen' || element.id === 'startScreen') {
							const topArrow = document.querySelector('#topArrow');
							const bottomArrow = document.querySelector('#bottomArrow');
							if (topArrow) topArrow.classList.add('hidden');
							if (bottomArrow) bottomArrow.classList.add('hidden');
						}

						if (element.id === 'about') {
							const bottomArrow = document.querySelector('#bottomArrow');
							if (bottomArrow) bottomArrow.classList.add('hidden');
						}
					}
				},
				{ threshold: [0.4, 0.8] }
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

		// Removed revealPortfolioSectionsWhenCategoriesVisible - categories section removed
		// Removed hidePortfolioSectionsWhenSplashscreenVisible - portfolio sections are no longer hidden when splashscreen is visible
		allFullPages.forEach((page) => updateHashWhenVisible(page));
		document.querySelectorAll('.largeVideo').forEach((video) => videoObserver(video));
	}

	// Setup keyboard navigation - most shortcuts handled by components via shortcuts system
	setupKeyboardNavigation() {
		// Keyboard navigation is now handled by the shortcuts system
		// This method is kept for backward compatibility
	}

	// Register global shortcuts (music controls and general navigation)
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
			if (['splashscreen', 'startScreen'].includes(currentScreen)) {
				return;
			}
			const currentElement = document.querySelector('#' + currentScreen);
			if (!currentElement) return;
			
			const prevSibling = DOM.previousVisibleSibling(currentElement);
			if (prevSibling) {
				debugLog('Navigate up'); 
				debugLog(prevSibling);
				prevSibling.scrollIntoView({ behavior: 'smooth' });
			} else {
				// If no previous sibling, we're at the first section - go to splashscreen
				const splashscreen = document.querySelector('#splashscreen');
				if (splashscreen) {
					debugLog('Navigate up to splashscreen');
					splashscreen.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}

		function handleNavDown() {
			const currentScreen = get(stores.navigation.currentScreen);
			// Skip if screen has its own ArrowDown handler
			if (['splashscreen'].includes(currentScreen)) {
				return;
			}
			const nextSibling = DOM.nextVisibleSibling(document.querySelector('#' + currentScreen));
			if (nextSibling) {
				debugLog('Navigate down');
				nextSibling.scrollIntoView({ behavior: 'smooth' });
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
