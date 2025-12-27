import { writable } from 'svelte/store';
import { Storage, STORAGE_KEYS } from './utils/storage.js';
import { getAssetUrl } from './utils/assets.js';

// Load saved audio preferences from localStorage
const savedVolume = Storage.get(STORAGE_KEYS.MUSIC_VOLUME, 0);
const savedMuted = Storage.get(STORAGE_KEYS.MUSIC_MUTED, false);

// Organized store namespaces
export const stores = {
	// Music-related state
	music: {
		isPlaying: writable(false),
		isLooping: writable(false),
		isMuted: writable(savedMuted),
		volume: writable(savedVolume), // 0-100 scale, loads from localStorage
		currentIndex: writable(0),
		unpauseWhenDone: writable(false),
		currentTime: writable(0),
		duration: writable(0),
		playlistLength: writable(0),
		trackImage: writable(getAssetUrl('/img/guillaumekuc_bgMusic.jpg')),
		tracks: writable([]),
		// Music player instance
		musicPlayer: writable(null),
		// Track if user has entered the site with music trigger
		hasEnteredWithMusic: writable(false)
	},

	// Navigation-related state
	navigation: {
		currentScreen: writable('startScreen'),
		currentModal: writable(null),
		currentNavTarget: writable('portfolio-all'), // Current navigation target (e.g., 'portfolio-2d', 'portfolio-3d', etc.)
		selectedMenuItem: writable(-1),
		// Map of portfolio section ID to visibility boolean for reactive portfolio section visibility
		portfolioSectionVisibility: writable(new Map()),
		// Navigation controller instance
		controller: writable(null),
		// True after user clicks Enter on start screen (never goes back to false)
		hasEnteredSite: writable(false)
	},

	// Configuration settings
	config: {
		debug: writable(true)
	}
};
