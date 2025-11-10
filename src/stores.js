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
		unpauseWhenDone: writable(false)
	},

	/**
	 * Navigation-related state
	 */
	navigation: {
		currentScreen: writable('startScreen'),
		rubricFocused: writable(3),
		menuSelected: writable(1),
		websitesCurrentIndex: writable(0)
	}
};

// Helper function to get DOM elements (for compatibility with existing code)
export function getMusicElements() {
	return {
		bgMusicElement: document.querySelector("#bgMusic"),
		splashscreenVolumeSlider: document.querySelector('#bgVolume'),
		footerVolumeSlider: document.querySelector('#footerVolumeSlider'),
		splashscreenMuteBtn: document.querySelector('#muteBgMusic'),
		footerMuteBtn: document.querySelector('#footerMuteBtn'),
		footerPlayBtn: document.querySelector('#footerPlayBtn'),
		footerSleekSlider: document.querySelector('#footerSleekSlider'),
		footerLoopBtn: document.querySelector('#footerLoopBtn'),
		currentTimeDisplay: document.querySelector('#currentTime'),
		durationDisplay: document.querySelector('#duration'),
		musicPlaylist: document.querySelectorAll('#musicPlaylist li'),
		musicArray: Array.from(document.querySelector('#musicPlaylist')?.children || []),
		websitesArray: Array.from(document.querySelectorAll('.websiteLink') || [])
	};
}
