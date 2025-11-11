/**
 * Application API
 * Exposes application state and services for console debugging and external access
 * All instances are accessible through stores: stores.music.musicPlayer, stores.navigation.controller
 */
export const appAPI = {
	// Will be populated during initialization
	stores: null
};

// Expose to window for console debugging
if (typeof window !== 'undefined') {
	window.app = appAPI;
}

