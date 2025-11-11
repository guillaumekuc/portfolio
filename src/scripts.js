import $ from 'jquery';
import 'slick-carousel';
import { Music } from './utils/music.js';
import { Navigation } from './utils/navigation.js';
import { debugLog } from './utils/debuglog.js';
import { stores } from './stores.js';
import { appAPI } from './utils/api.js';

// Make jQuery available globally for slick-carousel
window.$ = window.jQuery = $;

/**
 * Initialize scripts with element references
 * @param {HTMLAudioElement} audioElement - Audio element from Splashscreen component
 * @param {Array} websitesArray - Array of website link elements (optional, can be empty initially)
 */
export function initScripts(audioElement, websitesArray = []) {
	debugLog('Initializing scripts');
	
	if (!audioElement) {
		debugLog('Warning: Audio element not provided');
		return null;
	}
	
	// Initialize music player with audio element
	const musicPlayer = new Music();
	musicPlayer.init(audioElement);
	
	// Initialize navigation controller
	const navigationController = new Navigation(musicPlayer, websitesArray);
	navigationController.init();
	
	// Store instances in stores for component access
	stores.music.musicPlayer.set(musicPlayer);
	stores.navigation.controller.set(navigationController);
	
	// Expose to window.app for console debugging (external access only)
	appAPI.musicPlayer = musicPlayer;
	appAPI.navigation = navigationController;
	appAPI.stores = stores;
	
	debugLog('Scripts initialized');
	return {
		musicPlayer,
		navigationController
	};
}

// Export functions for backward compatibility
export function bgMusicControls() {
	// Music controls are now handled by Music class instance
	// This function is kept for backward compatibility but does nothing
	// as setup is done in initScripts()
}

export function navigation() {
	// Navigation is now handled by NavigationController class instance
	// This function is kept for backward compatibility but does nothing
	// as setup is done in initScripts()
}
