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
 * Initialize audio/music player
 * @param {HTMLAudioElement} audioElement - Audio element from Splashscreen component
 * @returns {Music|null} Music player instance or null if initialization failed
 */
export function initAudio(audioElement) {
	debugLog('Initializing audio');

	if (!audioElement) {
		debugLog('Warning: Audio element not provided');
		return null;
	}

	// Initialize music player with audio element
	const musicPlayer = new Music();
	musicPlayer.init(audioElement);

	// Store instance in store for component access
	stores.music.musicPlayer.set(musicPlayer);

	debugLog('Audio initialized');
	return musicPlayer;
}

/**
 * Initialize navigation controller
 * @returns {Navigation|null} Navigation controller instance or null if initialization failed
 */
export function initNavigation() {
	debugLog('Initializing navigation');

	// Music player is accessed from stores when needed
	// Initialize navigation controller
	const navigationController = new Navigation();
	navigationController.init();

	// Store instance in store for component access
	stores.navigation.controller.set(navigationController);

	debugLog('Navigation initialized');
	return navigationController;
}

/**
 * Initialize API exposure for console debugging and external access
 */
export function initAPI() {
	debugLog('Initializing API');

	// Expose stores to window.app for console debugging (external access only)
	// All instances are accessible through stores: stores.music.musicPlayer, stores.navigation.controller
	appAPI.stores = stores;

	debugLog('API initialized');
}
