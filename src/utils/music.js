import { Time } from './time.js';

/**
 * Music player controller class
 * Handles all background music and playlist functionality
 */
export class Music {
	constructor() {
		// DOM elements - initialized by init()
		this.bgMusicElement = null;
		this.splashscreenVolumeSlider = null;
		this.footerVolumeSlider = null;
		this.splashscreenMuteBtn = null;
		this.footerMuteBtn = null;
		this.footerPlayBtn = null;
		this.footerSleekSlider = null;
		this.footerLoopBtn = null;
		this.footerNextBtn = null;
		this.footerPreviousBtn = null;
		this.currentTimeDisplay = null;
		this.durationDisplay = null;
		this.musicPlaylist = null;
		
		// State
		this.bgVolume = 0;
		this.bgMusicIsPlaying = false;
		this.bgMusicIsLooping = false;
		this.bgMusicIsMuted = false;
		this.musicArray = [];
		this.musicCurrentIndex = 0;
		this.unpauseMusicWhenDone = false;
	}

	/**
	 * Initialize music player with DOM elements
	 */
	init(elements) {
		this.bgMusicElement = elements.bgMusicElement;
		this.splashscreenVolumeSlider = elements.splashscreenVolumeSlider;
		this.footerVolumeSlider = elements.footerVolumeSlider;
		this.splashscreenMuteBtn = elements.splashscreenMuteBtn;
		this.footerMuteBtn = elements.footerMuteBtn;
		this.footerPlayBtn = elements.footerPlayBtn;
		this.footerSleekSlider = elements.footerSleekSlider;
		this.footerLoopBtn = elements.footerLoopBtn;
		this.footerNextBtn = elements.footerNextBtn;
		this.footerPreviousBtn = elements.footerPreviousBtn;
		this.currentTimeDisplay = elements.currentTimeDisplay;
		this.durationDisplay = elements.durationDisplay;
		this.musicPlaylist = elements.musicPlaylist;
		this.musicArray = elements.musicArray;
	}

	/**
	 * Setup all event listeners
	 */
	setupEventListeners() {
		if (this.splashscreenMuteBtn) {
			this.splashscreenMuteBtn.addEventListener('click', () => this.muteHandler());
		}
		if (this.footerMuteBtn) {
			this.footerMuteBtn.addEventListener('click', () => this.muteHandler());
		}
		if (this.splashscreenVolumeSlider) {
			this.splashscreenVolumeSlider.addEventListener('input', (e) => this.volumeHandler(e.target));
		}
		if (this.footerVolumeSlider) {
			this.footerVolumeSlider.addEventListener('input', (e) => this.volumeHandler(e.target));
		}
		if (this.footerPlayBtn) {
			this.footerPlayBtn.addEventListener('click', () => this.playHandler());
		}
		if (this.bgMusicElement) {
			this.bgMusicElement.addEventListener('timeupdate', () => this.updateTime());
		}
		if (this.footerSleekSlider) {
			this.footerSleekSlider.addEventListener('input', () => this.sleekHandler());
		}
		if (this.footerLoopBtn) {
			this.footerLoopBtn.addEventListener('click', () => this.loopHandler());
		}
		if (this.footerNextBtn) {
			this.footerNextBtn.addEventListener('click', () => this.nextTrackHandler());
		}
		if (this.footerPreviousBtn) {
			this.footerPreviousBtn.addEventListener('click', () => this.previousTrackHandler());
		}
		if (this.musicPlaylist) {
			this.musicPlaylist.forEach((track) => {
				track.addEventListener('click', () => this.trackClicked(track));
			});
		}
	}

	stop() {
		if (!this.bgMusicElement) return;
		this.bgMusicElement.pause();
		this.bgMusicElement.currentTime = 0;
		this.bgMusicIsPlaying = false;
		if (this.splashscreenMuteBtn) {
			this.splashscreenMuteBtn.classList.remove('isPlaying');
			this.splashscreenMuteBtn.classList.add('isNotPlaying');
		}
	}

	play() {
		if (!this.bgMusicElement) return;
		this.bgMusicElement.play();
		this.bgMusicIsPlaying = true;
		if (this.footerPlayBtn) {
			this.footerPlayBtn.classList.add('isPlaying');
		}
	}

	pause() {
		if (!this.bgMusicElement) return;
		this.bgMusicElement.pause();
		this.bgMusicIsPlaying = false;
		if (this.footerPlayBtn) {
			this.footerPlayBtn.classList.remove('isPlaying');
		}
	}

	playHandler() {
		if (this.bgMusicIsPlaying === false) {
			this.play();
		} else if (this.bgMusicIsPlaying === true) {
			this.pause();
		}
	}

	muteHandler() {
		if (this.bgMusicIsMuted === false) {
			this.mute();
		} else {
			this.unmute();
		}
	}

	mute() {
		if (!this.bgMusicElement) return;
		this.bgMusicElement.volume = 0;
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = 0;
		});
		this.bgVolume = this.splashscreenVolumeSlider ? this.splashscreenVolumeSlider.value : 0;
		if (this.splashscreenVolumeSlider) this.splashscreenVolumeSlider.value = 0;
		if (this.footerVolumeSlider) this.footerVolumeSlider.value = 0;
		this.bgMusicIsMuted = true;
		if (this.splashscreenMuteBtn) this.splashscreenMuteBtn.classList.add('isMuted');
		if (this.footerMuteBtn) this.footerMuteBtn.classList.add('isMuted');
	}

	unmute() {
		if (!this.bgMusicElement) return;
		if (this.bgVolume == undefined || this.bgVolume == 0) {
			this.bgMusicElement.volume = 1;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = 1;
			});
			this.bgVolume = 100;
			if (this.splashscreenVolumeSlider) this.splashscreenVolumeSlider.value = this.bgVolume;
			if (this.footerVolumeSlider) this.footerVolumeSlider.value = this.splashscreenVolumeSlider.value;
		} else {
			this.bgMusicElement.volume = this.bgVolume / 100;
			document.querySelectorAll('.largeVideo').forEach((video) => {
				video.volume = this.bgVolume / 100;
			});
			if (this.splashscreenVolumeSlider) this.splashscreenVolumeSlider.value = this.bgVolume;
			if (this.footerVolumeSlider) this.footerVolumeSlider.value = this.splashscreenVolumeSlider.value;
		}
		this.bgMusicIsMuted = false;
		if (this.splashscreenMuteBtn) this.splashscreenMuteBtn.classList.remove('isMuted');
		if (this.footerMuteBtn) this.footerMuteBtn.classList.remove('isMuted');
	}

	volumeHandler(slider) {
		if (slider === this.splashscreenVolumeSlider) {
			this.bgVolume = this.splashscreenVolumeSlider.value;
			if (this.footerVolumeSlider) this.footerVolumeSlider.value = this.splashscreenVolumeSlider.value;
		}
		if (slider === this.footerVolumeSlider) {
			this.bgVolume = this.footerVolumeSlider.value;
			if (this.splashscreenVolumeSlider) this.splashscreenVolumeSlider.value = this.footerVolumeSlider.value;
		}
		if (this.bgMusicElement) {
			this.bgMusicElement.volume = this.bgVolume / 100;
		}
		document.querySelectorAll('.largeVideo').forEach((video) => {
			video.volume = this.bgVolume / 100;
		});

		if (this.bgVolume == 0) {
			if (this.splashscreenMuteBtn) this.splashscreenMuteBtn.classList.add('isMuted');
			if (this.footerMuteBtn) this.footerMuteBtn.classList.add('isMuted');
			this.bgMusicIsMuted = true;
		} else {
			if (this.splashscreenMuteBtn) this.splashscreenMuteBtn.classList.remove('isMuted');
			if (this.footerMuteBtn) this.footerMuteBtn.classList.remove('isMuted');
			this.bgMusicIsMuted = false;
		}
	}

	updateTime() {
		if (!this.bgMusicElement) return;
		const currentTime = this.bgMusicElement.currentTime;
		const duration = this.bgMusicElement.duration;

		if (duration) {
			if (this.footerSleekSlider) {
				this.footerSleekSlider.value = (currentTime / duration) * 100;
			}
			if (this.durationDisplay) {
				this.durationDisplay.textContent = Time.formatTime(duration);
			}
		} else {
			if (this.durationDisplay) this.durationDisplay.textContent = '0.00';
			if (this.footerSleekSlider) this.footerSleekSlider.value = 0;
		}
		if (this.currentTimeDisplay) {
			this.currentTimeDisplay.textContent = Time.formatTime(currentTime);
		}

		if (currentTime == duration && this.bgMusicIsLooping == false) {
			if (this.musicCurrentIndex + 1 < this.musicArray.length) {
				this.musicCurrentIndex = this.musicCurrentIndex + 1;
				this.checkFirstAndLastTrack();
				document.querySelectorAll('.musicPlaylist li').forEach((track) => {
					track.classList.remove('focus');
				});
				this.musicArray[this.musicCurrentIndex].classList.add('focus');
				this.bgMusicElement.setAttribute('src', this.musicArray[this.musicCurrentIndex].getAttribute('data-sound'));
				setTimeout(() => this.play(), 500);
				this.updateTrackImage();
			} else {
				this.pause();
				this.bgMusicElement.currentTime = 0;
			}
		}
	}

	sleekHandler() {
		if (!this.bgMusicElement || !this.footerSleekSlider) return;
		this.bgMusicElement.currentTime = (this.footerSleekSlider.value / 100) * this.bgMusicElement.duration;
	}

	loopHandler() {
		if (!this.bgMusicElement) return;
		if (this.bgMusicElement.loop == true) {
			this.bgMusicElement.loop = false;
			if (this.footerLoopBtn) this.footerLoopBtn.classList.remove('isLooping');
			this.bgMusicIsLooping = false;
		} else if (this.bgMusicElement.loop == false) {
			this.bgMusicElement.loop = true;
			if (this.footerLoopBtn) this.footerLoopBtn.classList.add('isLooping');
			this.bgMusicIsLooping = true;
		}
	}

	checkFirstAndLastTrack() {
		if (!this.footerNextBtn || !this.footerPreviousBtn) return;
		if (this.musicCurrentIndex + 1 == this.musicArray.length) {
			this.footerNextBtn.classList.add('lastTrack');
		} else {
			this.footerNextBtn.classList.remove('lastTrack');
		}
		if (this.musicCurrentIndex == 0) {
			this.footerPreviousBtn.classList.add('firstTrack');
		} else {
			this.footerPreviousBtn.classList.remove('firstTrack');
		}
	}

	updateTrackImage() {
		const coverElement = document.querySelector('#musicPlaylistCover');
		if (coverElement && this.musicArray[this.musicCurrentIndex]) {
			coverElement.style.background = 'no-repeat center / cover url(' + this.musicArray[this.musicCurrentIndex].getAttribute('data-image') + ')';
		}
	}

	nextTrackHandler() {
		if (this.musicCurrentIndex + 1 < this.musicArray.length) {
			this.musicCurrentIndex = this.musicCurrentIndex + 1;
			this.checkFirstAndLastTrack();
			document.querySelectorAll('.musicPlaylist li').forEach((track) => {
				track.classList.remove('focus');
			});
			this.musicArray[this.musicCurrentIndex].classList.add('focus');
			if (this.bgMusicElement) {
				this.bgMusicElement.setAttribute('src', this.musicArray[this.musicCurrentIndex].getAttribute('data-sound'));
			}
			this.play();
			this.updateTrackImage();
		}
	}

	previousTrackHandler() {
		if (this.musicCurrentIndex > 0) {
			this.musicCurrentIndex = this.musicCurrentIndex - 1;
			this.checkFirstAndLastTrack();
			document.querySelectorAll('.musicPlaylist li').forEach((track) => {
				track.classList.remove('focus');
			});
			this.musicArray[this.musicCurrentIndex].classList.add('focus');
			if (this.bgMusicElement) {
				this.bgMusicElement.setAttribute('src', this.musicArray[this.musicCurrentIndex].getAttribute('data-sound'));
			}
			this.play();
			this.updateTrackImage();
		}
	}

	trackClicked(track) {
		const newMusic = track.getAttribute('data-sound');
		if (this.bgMusicElement) {
			this.bgMusicElement.setAttribute('src', newMusic);
		}
		this.play();
		document.querySelectorAll('.musicPlaylist li').forEach((t) => {
			t.classList.remove('focus');
		});
		track.classList.add('focus');
		this.musicCurrentIndex = this.musicArray.indexOf(track);
		this.checkFirstAndLastTrack();
		this.updateTrackImage();
	}

	// Keyboard shortcuts for music control
	handleKeyboardShortcut(key) {
		if (key === 'q') {
			// Previous track
			if (this.musicCurrentIndex > 0) {
				this.musicCurrentIndex = this.musicCurrentIndex - 1;
				if (this.musicCurrentIndex + 1 == this.musicArray.length) {
					if (this.footerNextBtn) this.footerNextBtn.classList.add('lastTrack');
				} else {
					if (this.footerNextBtn) this.footerNextBtn.classList.remove('lastTrack');
				}
				if (this.musicCurrentIndex == 0) {
					if (this.footerPreviousBtn) this.footerPreviousBtn.classList.add('firstTrack');
				} else {
					if (this.footerPreviousBtn) this.footerPreviousBtn.classList.remove('firstTrack');
				}
				document.querySelectorAll('.musicPlaylist li').forEach((track) => {
					track.classList.remove('focus');
				});
				this.musicArray[this.musicCurrentIndex].classList.add('focus');
				if (this.bgMusicElement) {
					this.bgMusicElement.setAttribute('src', this.musicArray[this.musicCurrentIndex].getAttribute('data-sound'));
				}
				this.play();
				this.updateTrackImage();
			}
		}
		if (key === 'd') {
			// Next track
			if (this.musicCurrentIndex + 1 < this.musicArray.length) {
				this.musicCurrentIndex = this.musicCurrentIndex + 1;
				if (this.musicCurrentIndex + 1 == this.musicArray.length) {
					if (this.footerNextBtn) this.footerNextBtn.classList.add('lastTrack');
				} else {
					if (this.footerNextBtn) this.footerNextBtn.classList.remove('lastTrack');
				}
				if (this.musicCurrentIndex == 0) {
					if (this.footerPreviousBtn) this.footerPreviousBtn.classList.add('firstTrack');
				} else {
					if (this.footerPreviousBtn) this.footerPreviousBtn.classList.remove('firstTrack');
				}
				document.querySelectorAll('.musicPlaylist li').forEach((track) => {
					track.classList.remove('focus');
				});
				this.musicArray[this.musicCurrentIndex].classList.add('focus');
				if (this.bgMusicElement) {
					this.bgMusicElement.setAttribute('src', this.musicArray[this.musicCurrentIndex].getAttribute('data-sound'));
				}
				this.play();
				this.updateTrackImage();
			}
		}
		if (key === 'z') {
			// Volume up
			this.bgVolume = parseInt(this.bgVolume);
			this.bgVolume += 10;
			if (this.splashscreenVolumeSlider) this.splashscreenVolumeSlider.value = this.bgVolume;
			if (this.footerVolumeSlider) this.footerVolumeSlider.value = this.bgVolume;
			if (this.bgMusicElement) this.bgMusicElement.volume = this.bgVolume / 100;
		}
		if (key === 's') {
			// Volume down
			this.bgVolume = parseInt(this.bgVolume);
			this.bgVolume -= 10;
			if (this.splashscreenVolumeSlider) this.splashscreenVolumeSlider.value = this.bgVolume;
			if (this.footerVolumeSlider) this.footerVolumeSlider.value = this.bgVolume;
			if (this.bgMusicElement) this.bgMusicElement.volume = this.bgVolume / 100;
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

	// Getters for external access
	get isPlaying() {
		return this.bgMusicIsPlaying;
	}

	get isMuted() {
		return this.bgMusicIsMuted;
	}

	get volume() {
		return this.bgVolume;
	}

	get currentIndex() {
		return this.musicCurrentIndex;
	}

	get unpauseWhenDone() {
		return this.unpauseMusicWhenDone;
	}

	set unpauseWhenDone(value) {
		this.unpauseMusicWhenDone = value;
	}

}

