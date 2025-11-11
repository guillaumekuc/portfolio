import { writable } from 'svelte/store';

/**
 * Organized store namespaces
 */
export const stores = {
	/**
	 * Music-related state
	 */
	music: {
		isPlaying: writable(false),
		isLooping: writable(false),
		isMuted: writable(false),
		volume: writable(0),
		currentIndex: writable(0),
		unpauseWhenDone: writable(false),
		currentTime: writable(0),
		duration: writable(0),
		playlistLength: writable(0),
		trackImage: writable('/img/bgMusic.jpg'),
		tracks: writable([]),
		// Music player instance
		musicPlayer: writable(null)
	},

	/**
	 * Navigation-related state
	 */
	navigation: {
		currentScreen: writable('startScreen'),
		currentModal: writable(null),
		categoryFocused: writable(3),
		selectedMenuItem: writable(1),
		// Map of portfolio section ID to visibility boolean for reactive portfolio section visibility
		portfolioSectionVisibility: writable(new Map()),
		// Navigation controller instance
		controller: writable(null)
	},

	/**
	 * Configuration settings
	 */
	config: {
		debug: writable(true)
	}
};
