<Modal modalId="helpModal" title="Keyboard Shortcuts">
	<div class="help-modal-shortcuts">
		{#each shortcutList as shortcut}
			<div class="help-modal-shortcut-item">
				<span class="help-modal-key" class:help-modal-key-space={shortcut.key === ' '}>{formatKey(shortcut.key)}</span>
				<span class="help-modal-description">
					{shortcut.description}
					{#if shortcut.contextual}
						<span class="help-modal-contextual"> (contextual)</span>
					{/if}
				</span>
			</div>
		{/each}
	</div>
</Modal>

<script>
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';
	import { shortcuts } from '../utils/shortcuts.js';

	// Map of shortcut IDs to metadata (description and category)
	const shortcutMetadata = {
		'music-prev': { description: 'Previous track', category: 'track', order: 1 },
		'music-next': { description: 'Next track', category: 'track', order: 2 },
		'music-play-pause': { description: 'Play / Pause', category: 'playback', order: 1 },
		'music-mute': { description: 'Mute / Unmute', category: 'playback', order: 2 },
		'music-loop': { description: 'Toggle loop', category: 'playback', order: 3 },
		'music-vol-up': { description: 'Volume up', category: 'volume', order: 1 },
		'music-vol-down': { description: 'Volume down', category: 'volume', order: 2 },
		'nav-up': { description: 'Navigate up', category: 'navigation', order: 1 },
		'nav-down': { description: 'Navigate down', category: 'navigation', order: 2 },
		'nav-left': { description: 'Navigate left', category: 'navigation', order: 3, contextual: true },
		'nav-right': { description: 'Navigate right', category: 'navigation', order: 4, contextual: true }
	};

	// Category display order
	const categoryOrder = ['navigation', 'playback', 'volume', 'track'];

	// Get global shortcuts and map to display format
	let shortcutList = [];
	
	function buildShortcutList() {
		shortcutList = [];
		// Add global shortcuts
		for (const [id, shortcut] of shortcuts.global) {
			const metadata = shortcutMetadata[id] || { description: id, category: 'other', order: 999 };
			shortcutList.push({
				key: shortcut.key,
				description: metadata.description,
				category: metadata.category,
				order: metadata.order,
				contextual: metadata.contextual || false,
				id: id
			});
		}
		// Add contextual shortcuts (not in global shortcuts)
		const contextualShortcuts = [
			{ id: 'nav-left', key: 'ArrowLeft' },
			{ id: 'nav-right', key: 'ArrowRight' }
		];
		for (const contextual of contextualShortcuts) {
			const metadata = shortcutMetadata[contextual.id];
			if (metadata) {
				shortcutList.push({
					key: contextual.key,
					description: metadata.description,
					category: metadata.category,
					order: metadata.order,
					contextual: true,
					id: contextual.id
				});
			}
		}
		// Sort by category order, then by order within category
		shortcutList.sort((a, b) => {
			const aCategoryIndex = categoryOrder.indexOf(a.category);
			const bCategoryIndex = categoryOrder.indexOf(b.category);
			if (aCategoryIndex !== bCategoryIndex) {
				return aCategoryIndex - bCategoryIndex;
			}
			return a.order - b.order;
		});
	}

	function formatKey(key) {
		if (key === ' ') {
			return 'Space';
		}
		if (key === 'ArrowUp') {
			return '↑';
		}
		if (key === 'ArrowDown') {
			return '↓';
		}
		if (key === 'ArrowLeft') {
			return '←';
		}
		if (key === 'ArrowRight') {
			return '→';
		}
		return key.toUpperCase();
	}

	onMount(() => {
		// Build shortcut list
		buildShortcutList();
	});
</script>

<style>
	.help-modal-shortcuts {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.help-modal-shortcut-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.help-modal-key {
		color: var(--modal-text-color);
		font-family: 'M PLUS Rounded 1c';
		font-size: 16px;
		font-weight: 500;
		padding: 0;
		border: 1px solid var(--modal-border-color);
		border-radius: 4px;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex-shrink: 0;
	}

	.help-modal-key-space {
		width: auto;
		min-width: 80px;
		padding: 0 12px;
	}

	.help-modal-description {
		color: var(--modal-text-color);
		font-family: 'M PLUS Rounded 1c';
		font-size: 16px;
		font-weight: 300;
		text-align: left;
		flex: 1;
	}

	.help-modal-contextual {
		color: var(--modal-text-color);
		opacity: 0.6;
		font-size: 14px;
		font-style: italic;
	}
</style>

