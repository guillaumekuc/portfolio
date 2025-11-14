import { get } from 'svelte/store';

// Application API - exposes state and services for console debugging and external access
// All instances accessible through stores: stores.music.musicPlayer, stores.navigation.controller
export const appAPI = {
	// Will be populated during initialization
	stores: null,
	// Expose get function for console debugging
	get: get,
	// Convenience set function - stores already have .set() method, but this provides a consistent API
	set: (store, value) => {
		if (store && typeof store.set === 'function') {
			store.set(value);
		} else {
			console.error('Store does not have a set method');
		}
	}
};

// Expose to window for console debugging
if (typeof window !== 'undefined') {
	window.app = appAPI;
}
