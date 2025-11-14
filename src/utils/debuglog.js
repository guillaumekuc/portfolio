import { get } from 'svelte/store';
import { stores } from '../stores.js';

// Debug logging - only logs when debug flag is enabled in config store
export function debugLog(...args) {
	if (get(stores.config.debug)) {
		console.log('[DEBUG]', ...args);
	}
}
