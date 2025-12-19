import { debugLog } from './debuglog.js';

// Storage utility for managing localStorage
export class Storage {
	/**
	 * Get an item from localStorage
	 * @param {string} key - The key to retrieve
	 * @param {*} defaultValue - Default value if key doesn't exist
	 * @returns {*} The parsed value or default value
	 */
	static get(key, defaultValue = null) {
		try {
			const item = localStorage.getItem(key);
			if (item === null) {
				return defaultValue;
			}
			return JSON.parse(item);
		} catch (error) {
			debugLog('Error reading from localStorage:', error);
			return defaultValue;
		}
	}

	/**
	 * Set an item in localStorage
	 * @param {string} key - The key to set
	 * @param {*} value - The value to store (will be JSON stringified)
	 */
	static set(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			debugLog('Error writing to localStorage:', error);
		}
	}

	/**
	 * Remove an item from localStorage
	 * @param {string} key - The key to remove
	 */
	static remove(key) {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			debugLog('Error removing from localStorage:', error);
		}
	}

	/**
	 * Clear all items from localStorage
	 */
	static clear() {
		try {
			localStorage.clear();
		} catch (error) {
			debugLog('Error clearing localStorage:', error);
		}
	}

	/**
	 * Check if a key exists in localStorage
	 * @param {string} key - The key to check
	 * @returns {boolean}
	 */
	static has(key) {
		return localStorage.getItem(key) !== null;
	}
}

// Storage keys constants for easy reference
export const STORAGE_KEYS = {
	MUSIC_VOLUME: 'music.volume',
	MUSIC_MUTED: 'music.isMuted',
};






