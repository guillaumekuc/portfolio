/**
 * Initialization utilities
 */
export class Init {
	/**
	 * Initialize all script variables and return them
	 * @returns {Object} Object containing all initialized DOM elements and arrays
	 */
	static initScripts() {
		return {
			bgMusicElement: document.querySelector('#bgMusic'),
			splashscreenVolumeSlider: document.querySelector('#bgVolume'),
			footerVolumeSlider: document.querySelector('#footerVolumeSlider'),
			splashscreenMuteBtn: document.querySelector('#muteBgMusic'),
			footerMuteBtn: document.querySelector('#footerMuteBtn'),
			footerPlayBtn: document.querySelector('#footerPlayBtn'),
			footerSleekSlider: document.querySelector('#footerSleekSlider'),
			footerLoopBtn: document.querySelector('#footerLoopBtn'),
			footerNextBtn: document.querySelector('#footerNextBtn'),
			footerPreviousBtn: document.querySelector('#footerPreviousBtn'),
			currentTimeDisplay: document.querySelector('#currentTime'),
			durationDisplay: document.querySelector('#duration'),
			musicPlaylist: document.querySelectorAll('#musicPlaylist li'),
			musicArray: Array.prototype.slice.call(document.querySelector('#musicPlaylist')?.children || []),
			websitesArray: Array.prototype.slice.call(document.querySelectorAll('.websiteLink'))
		};
	}
}

