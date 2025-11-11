/**
 * Application API
 * Exposes application state and services for console debugging and external access
 */
export const appAPI = {
	// Will be populated during initialization
	musicPlayer: null,
	stores: null,
	navigation: null
};

// Expose to window for console debugging
if (typeof window !== 'undefined') {
	window.app = appAPI;
}

