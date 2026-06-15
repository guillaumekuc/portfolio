import { Time } from './time.js';
import { stores } from '../stores.js';
import { get } from 'svelte/store';
import { debugLog } from './debuglog.js';
import { Storage, STORAGE_KEYS } from './storage.js';

// Music player controller - handles background music and playlist functionality
export class Music {
	constructor() {
		// Only keep reference to audio element for playback control
		// Store values are initialized in stores.js - single source of truth
		this.bgMusicElement = null;
	}

	init(audioElement) {
		this.bgMusicElement = audioElement;
		debugLog('Music player initialized');

		// Setup time update listener to update stores
		if (this.bgMusicElement) {
			// Sync isPlaying store with actual audio element state
			this.bgMusicElement.addEventListener('play', () => {
				stores.music.isPlaying.set(true);
				debugLog('Audio element playing - syncing store');
			});

			this.bgMusicElement.addEventListener('pause', () => {
				stores.music.isPlaying.set(false);
				debugLog('Audio element paused - syncing store');
			});

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
					const collections = get(stores.music.collections);
					const currentCollectionIndex = get(stores.music.currentCollectionIndex);
					const currentTrackIndex = get(stores.music.currentTrackIndex);
					
					// Check if there's a next track (either in current collection or next collection)
					let hasNext = false;
					if (collections && collections.length > 0) {
						const currentCollection = collections[currentCollectionIndex];
						if (currentCollection && currentTrackIndex + 1 < currentCollection.tracks.length) {
							hasNext = true;
						} else if (currentCollectionIndex + 1 < collections.length) {
							hasNext = true;
						}
					} else {
						// Fallback to old system
						const currentIndex = get(stores.music.currentIndex);
						const tracks = get(stores.music.tracks);
						hasNext = currentIndex + 1 < tracks.length;
					}
					
					if (hasNext) {
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
		
		const currentVolume = get(stores.music.volume);
		const isMuted = get(stores.music.isMuted);
		
		// If user is trying to play while muted, unmute first
		if (isMuted) {
			stores.music.isMuted.set(false);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, false);
		}
		
		// If volume is 0 (initial muted state), set to full volume when music starts
		if (currentVolume === 0) {
			stores.music.volume.set(100);
			this.bgMusicElement.volume = 1;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = 1;
			});
			Storage.set(STORAGE_KEYS.MUSIC_VOLUME, 100);
		} else {
			// Apply current volume setting
			this.bgMusicElement.volume = currentVolume / 100;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = currentVolume / 100;
			});
		}
		
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
		Storage.set(STORAGE_KEYS.MUSIC_MUTED, true);
		debugLog('Music muted');
	}

	unmute() {
		if (!this.bgMusicElement) return;
		const currentVolume = get(stores.music.volume);
		const hasEnteredWithMusic = get(stores.music.hasEnteredWithMusic);
		const isPlaying = get(stores.music.isPlaying);
		
		if (currentVolume === undefined || currentVolume === 0) {
			this.bgMusicElement.volume = 1;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = 1;
			});
			stores.music.volume.set(100);
			Storage.set(STORAGE_KEYS.MUSIC_VOLUME, 100);
		} else {
			this.bgMusicElement.volume = currentVolume / 100;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = currentVolume / 100;
			});
		}
		stores.music.isMuted.set(false);
		Storage.set(STORAGE_KEYS.MUSIC_MUTED, false);
		
		// If user has entered the site but music never started (because they were muted), start it now
		if (hasEnteredWithMusic && !isPlaying) {
			this.play();
		}
		
		debugLog('Music unmuted');
	}

	volumeHandler(slider) {
		const newVolume = parseInt(slider.value);
		stores.music.volume.set(newVolume);
		Storage.set(STORAGE_KEYS.MUSIC_VOLUME, newVolume);
		debugLog('Volume changed:', newVolume);

		if (this.bgMusicElement) {
			this.bgMusicElement.volume = newVolume / 100;
		}
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = newVolume / 100;
		});

		if (newVolume === 0) {
			stores.music.isMuted.set(true);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, true);
		} else {
			stores.music.isMuted.set(false);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, false);
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
		const collections = get(stores.music.collections);
		const currentCollectionIndex = get(stores.music.currentCollectionIndex);
		const currentTrackIndex = get(stores.music.currentTrackIndex);
		
		if (!collections || collections.length === 0) {
			// Fallback to old system if no collections
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
			return;
		}
		
		const currentCollection = collections[currentCollectionIndex];
		if (!currentCollection) return;
		
		// Check if we can move to next track in current collection
		if (currentTrackIndex + 1 < currentCollection.tracks.length) {
			// Next track in same collection
			const newTrackIndex = currentTrackIndex + 1;
			stores.music.currentTrackIndex.set(newTrackIndex);
			
			const track = currentCollection.tracks[newTrackIndex];
			if (this.bgMusicElement) {
				this.bgMusicElement.setAttribute('src', track.sound);
			}
			if (currentCollection.image) {
				stores.music.trackImage.set(currentCollection.image);
			}
			debugLog('Next track:', currentCollectionIndex, newTrackIndex);
			this.play();
		} else if (currentCollectionIndex + 1 < collections.length) {
			// Move to next collection, first track
			const newCollectionIndex = currentCollectionIndex + 1;
			const newCollection = collections[newCollectionIndex];
			
			stores.music.currentCollectionIndex.set(newCollectionIndex);
			stores.music.currentTrackIndex.set(0);
			
			const track = newCollection.tracks[0];
			if (this.bgMusicElement) {
				this.bgMusicElement.setAttribute('src', track.sound);
			}
			if (newCollection.image) {
				stores.music.trackImage.set(newCollection.image);
			}
			debugLog('Next collection:', newCollectionIndex, 0);
			this.play();
		}
	}

	previousTrackHandler() {
		const collections = get(stores.music.collections);
		const currentCollectionIndex = get(stores.music.currentCollectionIndex);
		const currentTrackIndex = get(stores.music.currentTrackIndex);
		
		if (!collections || collections.length === 0) {
			// Fallback to old system if no collections
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
			return;
		}
		
		// Check if we can move to previous track in current collection
		if (currentTrackIndex > 0) {
			// Previous track in same collection
			const newTrackIndex = currentTrackIndex - 1;
			stores.music.currentTrackIndex.set(newTrackIndex);
			
			const currentCollection = collections[currentCollectionIndex];
			const track = currentCollection.tracks[newTrackIndex];
			if (this.bgMusicElement) {
				this.bgMusicElement.setAttribute('src', track.sound);
			}
			if (currentCollection.image) {
				stores.music.trackImage.set(currentCollection.image);
			}
			debugLog('Previous track:', currentCollectionIndex, newTrackIndex);
			this.play();
		} else if (currentCollectionIndex > 0) {
			// Move to previous collection, last track
			const newCollectionIndex = currentCollectionIndex - 1;
			const newCollection = collections[newCollectionIndex];
			const lastTrackIndex = newCollection.tracks.length - 1;
			
			stores.music.currentCollectionIndex.set(newCollectionIndex);
			stores.music.currentTrackIndex.set(lastTrackIndex);
			
			const track = newCollection.tracks[lastTrackIndex];
			if (this.bgMusicElement) {
				this.bgMusicElement.setAttribute('src', track.sound);
			}
			if (newCollection.image) {
				stores.music.trackImage.set(newCollection.image);
			}
			debugLog('Previous collection:', newCollectionIndex, lastTrackIndex);
			this.play();
		}
	}

	volumeUp() {
		const currentVolume = get(stores.music.volume);
		const newVolume = Math.min(100, parseInt(currentVolume) + 10);
		stores.music.volume.set(newVolume);
		Storage.set(STORAGE_KEYS.MUSIC_VOLUME, newVolume);
		if (this.bgMusicElement) {
			this.bgMusicElement.volume = newVolume / 100;
		}
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = newVolume / 100;
		});
		if (newVolume > 0) {
			stores.music.isMuted.set(false);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, false);
		}
	}

	volumeDown() {
		const currentVolume = get(stores.music.volume);
		const newVolume = Math.max(0, parseInt(currentVolume) - 10);
		stores.music.volume.set(newVolume);
		Storage.set(STORAGE_KEYS.MUSIC_VOLUME, newVolume);
		if (this.bgMusicElement) {
			this.bgMusicElement.volume = newVolume / 100;
		}
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = newVolume / 100;
		});
		if (newVolume === 0) {
			stores.music.isMuted.set(true);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, true);
		} else {
			stores.music.isMuted.set(false);
			Storage.set(STORAGE_KEYS.MUSIC_MUTED, false);
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
