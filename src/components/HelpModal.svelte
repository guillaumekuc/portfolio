<Modal modalId="helpModal">
	<div class="help-modal-shortcuts">
		<h2 class="help-modal-title">{helpTitle}</h2>
		{#each shortcutList as shortcut}
			<div class="help-modal-shortcut-item">
				<span class="help-modal-key" class:help-modal-key-space={shortcut.key === ' '}>{formatKey(shortcut.key)}</span>
				<span class="help-modal-description">
					{shortcut.description}
					{#if shortcut.contextual}
						<span class="help-modal-contextual"> {contextualSuffix}</span>
					{/if}
				</span>
			</div>
		{/each}
	</div>
</Modal>

<script>
	import Modal from './Modal.svelte';
	import { shortcuts } from '../utils/shortcuts.js';
	import { stores } from '../stores.js';
	import { t } from '../utils/i18n.js';

	const localeStore = stores.i18n.locale;

	const shortcutMetadata = {
		'music-prev': { category: 'track', order: 1 },
		'music-next': { category: 'track', order: 2 },
		'music-play-pause': { category: 'playback', order: 1 },
		'music-mute': { category: 'playback', order: 2 },
		'music-loop': { category: 'playback', order: 3 },
		'music-vol-up': { category: 'volume', order: 1 },
		'music-vol-down': { category: 'volume', order: 2 },
		'nav-up': { category: 'navigation', order: 1 },
		'nav-down': { category: 'navigation', order: 2 },
		'nav-left': { category: 'navigation', order: 3, contextual: true },
		'nav-right': { category: 'navigation', order: 4, contextual: true },
		'help-modal': { category: 'navigation', order: 5 }
	};

	const categoryOrder = ['navigation', 'playback', 'volume', 'track'];

	function shortcutT(loc, id) {
		const key = `shortcut.${id.replace(/-/g, '_')}`;
		return t(loc, key);
	}

	$: helpTitle = t($localeStore, 'help.title');
	$: contextualSuffix = t($localeStore, 'help.contextual');

	$: shortcutList = (() => {
		const loc = $localeStore;
		const list = [];
		for (const [id, shortcut] of shortcuts.global) {
			const metadata = shortcutMetadata[id] || { category: 'other', order: 999 };
			list.push({
				key: shortcut.key,
				description: shortcutT(loc, id),
				category: metadata.category,
				order: metadata.order,
				contextual: metadata.contextual || false,
				id
			});
		}
		const contextualShortcuts = [
			{ id: 'nav-left', key: 'ArrowLeft' },
			{ id: 'nav-right', key: 'ArrowRight' }
		];
		for (const contextual of contextualShortcuts) {
			const metadata = shortcutMetadata[contextual.id];
			if (metadata) {
				list.push({
					key: contextual.key,
					description: shortcutT(loc, contextual.id),
					category: metadata.category,
					order: metadata.order,
					contextual: true,
					id: contextual.id
				});
			}
		}
		list.sort((a, b) => {
			const aCategoryIndex = categoryOrder.indexOf(a.category);
			const bCategoryIndex = categoryOrder.indexOf(b.category);
			if (aCategoryIndex !== bCategoryIndex) {
				return aCategoryIndex - bCategoryIndex;
			}
			return a.order - b.order;
		});
		return list;
	})();

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

</script>

<style>
	.help-modal-shortcuts {
		/* Font interface variables - map global variables to local scope */
		--help-modal-font-rounded: var(--ffRounded);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.help-modal-title {
		color: var(--modal-text-color);
		font-family: var(--help-modal-font-rounded);
		font-size: 24px;
		font-weight: 400;
		margin: 0 0 12px 0;
		text-align: center;
	}

	.help-modal-shortcut-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.help-modal-key {
		color: var(--modal-text-color);
		font-family: var(--help-modal-font-rounded);
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
		font-family: var(--help-modal-font-rounded);
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

	/* Responsive adjustments */
	@media (max-height: 950px) {
		.help-modal-shortcuts {
			gap: 6px;
		}

		.help-modal-title {
			font-size: 22px;
			margin-bottom: 10px;
		}

		.help-modal-shortcut-item {
			gap: 10px;
		}

		.help-modal-key {
			font-size: 14px;
			width: 36px;
			height: 36px;
		}

		.help-modal-key-space {
			min-width: 70px;
			padding: 0 10px;
		}

		.help-modal-description {
			font-size: 14px;
		}

		.help-modal-contextual {
			font-size: 12px;
		}
	}

	@media (max-height: 750px) {
		.help-modal-shortcuts {
			gap: 5px;
		}

		.help-modal-title {
			font-size: 20px;
			margin-bottom: 8px;
		}

		.help-modal-shortcut-item {
			gap: 8px;
		}

		.help-modal-key {
			font-size: 13px;
			width: 32px;
			height: 32px;
			border-radius: 3px;
		}

		.help-modal-key-space {
			min-width: 60px;
			padding: 0 8px;
		}

		.help-modal-description {
			font-size: 13px;
		}

		.help-modal-contextual {
			font-size: 11px;
		}
	}

	@media (max-height: 500px) {
		.help-modal-shortcuts {
			gap: 4px;
		}

		.help-modal-title {
			font-size: 18px;
			margin-bottom: 6px;
		}

		.help-modal-shortcut-item {
			gap: 6px;
		}

		.help-modal-key {
			font-size: 12px;
			width: 28px;
			height: 28px;
			border-radius: 3px;
		}

		.help-modal-key-space {
			min-width: 50px;
			padding: 0 6px;
		}

		.help-modal-description {
			font-size: 12px;
		}

		.help-modal-contextual {
			font-size: 10px;
		}
	}
</style>

