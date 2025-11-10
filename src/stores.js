import { writable } from 'svelte/store';

// Music state
export const bgMusicIsPlaying = writable(false);
export const bgMusicIsLooping = writable(false);
export const bgMusicIsMuted = writable(false);
export const bgVolume = writable(0);
export const musicCurrentIndex = writable(0);
export const unpauseMusicWhenDone = writable(false);

// Navigation state
export const currentScreen = writable('startScreen');
export const rubricFocused = writable(3);
export const menuSelected = writable(1);
export const websitesCurrentIndex = writable(0);

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

