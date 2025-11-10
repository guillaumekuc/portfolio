import { Time } from './time.js';
import { stores } from '../stores.js';
import { get } from 'svelte/store';
import { debugLog } from './debuglog.js';

/**
 * Music player controller class
 * Handles all background music and playlist functionality
 */
export class Music {
	constructor() {
		// Only keep reference to audio element for playback control
		this.bgMusicElement = null;
		
		// Initialize stores
		stores.music.isPlaying.set(false);
		stores.music.isLooping.set(false);
		stores.music.isMuted.set(false);
		stores.music.volume.set(0);
		stores.music.currentIndex.set(0);
		stores.music.unpauseWhenDone.set(false);
		stores.music.currentTime.set(0);
		stores.music.duration.set(0);
	}

	/**
	 * Initialize music player with DOM elements
	 */
	init(elements) {
		this.bgMusicElement = elements.bgMusicElement;
		debugLog('Music player initialized');
		
		// Setup time update listener to update stores
		if (this.bgMusicElement) {
			this.bgMusicElement.addEventListener('timeupdate', () => {
				if (this.bgMusicElement) {
					stores.music.currentTime.set(this.bgMusicElement.currentTime);
					if (this.bgMusicElement.duration) {
						stores.music.duration.set(this.bgMusicElement.duration);
					}
				}
			});
			
			// Handle track end
			this.bgMusicElement.addEventListener('ended', () => {
				const isLooping = get(stores.music.isLooping);
				if (!isLooping) {
					const currentIndex = get(stores.music.currentIndex);
					const tracks = get(stores.music.tracks);
					if (currentIndex + 1 < tracks.length) {
						this.nextTrackHandler();
					} else {
						this.pause();
						if (this.bgMusicElement) {
							this.bgMusicElement.currentTime = 0;
						}
					}
				}
			});
		}
	}

	stop() {
		if (!this.bgMusicElement) return;
		this.bgMusicElement.pause();
		this.bgMusicElement.currentTime = 0;
		stores.music.isPlaying.set(false);
		stores.music.currentTime.set(0);
	}

	play() {
		if (!this.bgMusicElement) return;
		this.bgMusicElement.play();
		stores.music.isPlaying.set(true);
		debugLog('Music playing');
	}

	pause() {
		if (!this.bgMusicElement) return;
		this.bgMusicElement.pause();
		stores.music.isPlaying.set(false);
		debugLog('Music paused');
	}

	playHandler() {
		const isPlaying = get(stores.music.isPlaying);
		if (!isPlaying) {
			this.play();
		} else {
			this.pause();
		}
	}

	muteHandler() {
		const isMuted = get(stores.music.isMuted);
		if (!isMuted) {
			this.mute();
		} else {
			this.unmute();
		}
	}

	mute() {
		if (!this.bgMusicElement) return;
		const currentVolume = get(stores.music.volume);
		// Save current volume before muting
		if (currentVolume > 0) {
			// Volume is already stored, just set audio to 0
		}
		this.bgMusicElement.volume = 0;
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = 0;
		});
		stores.music.isMuted.set(true);
		debugLog('Music muted');
	}

	unmute() {
		if (!this.bgMusicElement) return;
		const currentVolume = get(stores.music.volume);
		if (currentVolume == undefined || currentVolume == 0) {
			this.bgMusicElement.volume = 1;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = 1;
			});
			stores.music.volume.set(100);
		} else {
			this.bgMusicElement.volume = currentVolume / 100;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = currentVolume / 100;
			});
		}
		stores.music.isMuted.set(false);
		debugLog('Music unmuted');
	}

	volumeHandler(slider) {
		const newVolume = parseInt(slider.value);
		stores.music.volume.set(newVolume);
		debugLog('Volume changed:', newVolume);
		
		if (this.bgMusicElement) {
			this.bgMusicElement.volume = newVolume / 100;
		}
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = newVolume / 100;
		});

		if (newVolume == 0) {
			stores.music.isMuted.set(true);
		} else {
			stores.music.isMuted.set(false);
		}
	}

	sleekHandler(slider) {
		if (!this.bgMusicElement || !slider) return;
		this.bgMusicElement.currentTime = (slider.value / 100) * this.bgMusicElement.duration;
	}

	loopHandler() {
		if (!this.bgMusicElement) return;
		const isLooping = get(stores.music.isLooping);
		if (isLooping) {
			this.bgMusicElement.loop = false;
			stores.music.isLooping.set(false);
		} else {
			this.bgMusicElement.loop = true;
			stores.music.isLooping.set(true);
		}
	}

	nextTrackHandler() {
		const currentIndex = get(stores.music.currentIndex);
		const tracks = get(stores.music.tracks);
		if (currentIndex + 1 < tracks.length) {
			const newIndex = currentIndex + 1;
			stores.music.currentIndex.set(newIndex);
			if (this.bgMusicElement && tracks[newIndex]) {
				this.bgMusicElement.setAttribute('src', tracks[newIndex].sound);
				stores.music.trackImage.set(tracks[newIndex].image);
			}
			debugLog('Next track:', newIndex);
			this.play();
		}
	}

	previousTrackHandler() {
		const currentIndex = get(stores.music.currentIndex);
		const tracks = get(stores.music.tracks);
		if (currentIndex > 0) {
			const newIndex = currentIndex - 1;
			stores.music.currentIndex.set(newIndex);
			if (this.bgMusicElement && tracks[newIndex]) {
				this.bgMusicElement.setAttribute('src', tracks[newIndex].sound);
				stores.music.trackImage.set(tracks[newIndex].image);
			}
			debugLog('Previous track:', newIndex);
			this.play();
		}
	}

	volumeUp() {
		const currentVolume = get(stores.music.volume);
		const newVolume = Math.min(100, parseInt(currentVolume) + 10);
		stores.music.volume.set(newVolume);
		if (this.bgMusicElement) {
			this.bgMusicElement.volume = newVolume / 100;
		}
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = newVolume / 100;
		});
		if (newVolume > 0) {
			stores.music.isMuted.set(false);
		}
	}

	volumeDown() {
		const currentVolume = get(stores.music.volume);
		const newVolume = Math.max(0, parseInt(currentVolume) - 10);
		stores.music.volume.set(newVolume);
		if (this.bgMusicElement) {
			this.bgMusicElement.volume = newVolume / 100;
		}
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = newVolume / 100;
		});
		if (newVolume === 0) {
			stores.music.isMuted.set(true);
		} else {
			stores.music.isMuted.set(false);
		}
	}

	// Keyboard shortcuts for music control
	handleKeyboardShortcut(key) {
		debugLog('Music shortcut:', key);
		if (key === 'q') {
			// Previous track
			this.previousTrackHandler();
		}
		if (key === 'd') {
			// Next track
			this.nextTrackHandler();
		}
		if (key === 'z') {
			// Volume up
			this.volumeUp();
		}
		if (key === 's') {
			// Volume down
			this.volumeDown();
		}
		if (key === ' ') {
			// Play/pause
			this.playHandler();
		}
		if (key === 'm') {
			// Mute/unmute
			this.muteHandler();
		}
		if (key === 'l') {
			// Loop toggle
			this.loopHandler();
		}
	}

	// Getters for external access - return store values for single source of truth
	get isPlaying() {
		return get(stores.music.isPlaying);
	}

	get isMuted() {
		return get(stores.music.isMuted);
	}

	get volume() {
		return get(stores.music.volume);
	}

	get currentIndex() {
		return get(stores.music.currentIndex);
	}

	get unpauseWhenDone() {
		return get(stores.music.unpauseWhenDone);
	}

	set unpauseWhenDone(value) {
		stores.music.unpauseWhenDone.set(value);
	}

}

