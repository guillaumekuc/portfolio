import $ from 'jquery';
import 'slick-carousel';
import { Music } from './utils/music.js';
import { Navigation } from './utils/navigation.js';
import { Init } from './utils/init.js';

// Make jQuery available globally for slick-carousel
window.$ = window.jQuery = $;

// Global instances
let musicPlayer;
let navigationController;

// Initialize script variables after DOM is ready
export function initScripts() {
	const elements = Init.initScripts();
	
	// Initialize music player
	musicPlayer = new Music();
	musicPlayer.init(elements);
	
	// Initialize navigation controller
	navigationController = new Navigation(musicPlayer, elements.websitesArray);
	navigationController.init();
	
	// Make music player globally accessible for event listeners
	window.musicPlayer = musicPlayer;
	
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
