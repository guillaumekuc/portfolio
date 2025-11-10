import { get } from 'svelte/store';
import { stores } from '../stores.js';
import { debugLog } from './debuglog.js';

/**
 * Keyboard shortcuts
 * 
 * Three types (priority order):
 * - Modal: Highest priority, active when a modal is open (e.g., startScreen)
 * - Screen: Active only when a full-page section is visible
 * - Global: Always active (e.g., music controls)
 */
class Shortcuts {
	constructor() {
		this.global = new Map();
		this.screens = new Map();
		this.modals = new Map();
		this.handler = null;
		this.ready = false;
	}
	
	init() {
		if (this.ready) return;
		
		this.handler = (e) => this.onKey(e);
		document.addEventListener('keydown', this.handler);
		this.ready = true;
		debugLog('Shortcuts initialized');
	}
	
	destroy() {
		if (this.handler) {
			document.removeEventListener('keydown', this.handler);
			this.handler = null;
		}
		this.ready = false;
	}
	
	/**
	 * Add a global shortcut (always active)
	 */
	addGlobalShortcut(key, handler, id, prevent = true) {
		this.global.set(id, { key, handler, prevent });
		debugLog('Global shortcut added:', key, id);
	}
	
	/**
	 * Add a screen shortcut (active only when screen is visible)
	 */
	addScreenShortcut(screen, key, handler, prevent = true) {
		if (!this.screens.has(screen)) {
			this.screens.set(screen, new Map());
		}
		
		const map = this.screens.get(screen);
		// Use key as the map key since each screen has its own map
		map.set(key, { key, handler, prevent });
	}
	
	/**
	 * Add a modal shortcut (highest priority, active when modal is open)
	 */
	addModalShortcut(modal, key, handler, prevent = true) {
		if (!this.modals.has(modal)) {
			this.modals.set(modal, new Map());
		}
		
		const map = this.modals.get(modal);
		map.set(key, { key, handler, prevent });
	}
	
	/**
	 * Remove a global shortcut
	 */
	removeGlobalShortcut(id) {
		this.global.delete(id);
	}
	
	/**
	 * Remove all shortcuts for a screen
	 */
	removeScreenShortcuts(screen) {
		this.screens.delete(screen);
	}
	
	/**
	 * Remove all shortcuts for a modal
	 */
	removeModalShortcuts(modal) {
		this.modals.delete(modal);
	}
	
	/**
	 * Handle keydown events
	 * Priority: Modal → Screen → Global
	 * When a modal is active, only modal shortcuts work (others are frozen)
	 */
	onKey(e) {
		// Check modal shortcuts first (highest priority)
		const currentModal = get(stores.navigation.currentModal);
		if (currentModal) {
			const map = this.modals.get(currentModal);
			if (map) {
				const shortcut = map.get(e.key);
				if (shortcut) {
					if (shortcut.prevent) e.preventDefault();
					debugLog('Modal shortcut:', e.key, currentModal);
					shortcut.handler(e);
					return;
				}
			}
			// Modal is active but no shortcut matched - block all other shortcuts
			return;
		}
		
		// Check screen shortcuts (they take precedence over global)
		const currentScreen = get(stores.navigation.currentScreen);
		const map = this.screens.get(currentScreen);
		if (map) {
			const shortcut = map.get(e.key);
			if (shortcut) {
				if (shortcut.prevent) e.preventDefault();
				debugLog('Screen shortcut:', e.key, currentScreen);
				shortcut.handler(e);
				return;
			}
		}
		
		// Check global shortcuts if no screen shortcut matched
		for (const [id, s] of this.global) {
			if (e.key === s.key) {
				if (s.prevent) e.preventDefault();
				debugLog('Global shortcut:', e.key, id);
				s.handler(e);
				return;
			}
		}
	}
}

// Singleton instance
export const shortcuts = new Shortcuts();

// Initialize on import
if (typeof document !== 'undefined') {
	shortcuts.init();
}

