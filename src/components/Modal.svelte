<div class="modal">
	<div 
		class="modal-backdrop" 
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && handleBackdropClick()}
		role="button"
		tabindex="0"
		aria-label={closeAriaLabel}
	>
		<div 
			class="modal-content" 
			style="--modal-max-width: {maxWidth}"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="presentation"
		>
			<slot />
		</div>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { stores } from '../stores.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import { t } from '../utils/i18n.js';

	export let modalId;
	export let maxWidth = '550px';

	const localeStore = stores.i18n.locale;
	$: closeAriaLabel = t($localeStore, 'modal.close');

	function handleBackdropClick() {
		closeModal();
	}

	function closeModal() {
		stores.navigation.currentModal.set(null);
		shortcuts.removeModalShortcuts(modalId);
	}

	function handleEscape() {
		closeModal();
	}

	onMount(() => {
		// Set modal as the current modal
		stores.navigation.currentModal.set(modalId);

		// Register Escape as modal shortcut
		shortcuts.addModalShortcut(modalId, 'Escape', handleEscape);
	});

	onDestroy(() => {
		// Clear modal and remove shortcuts
		stores.navigation.currentModal.set(null);
		shortcuts.removeModalShortcuts(modalId);
	});
</script>

<style>
	.modal {
		/* Font interface variables - map global variables to local scope */
		--modal-font-rounded: var(--ffRounded);
	}
	.modal {
		/* Interface variables - map global variables to local scope */
		--modal-background-color: var(--color-background-primary);
		--modal-text-color: var(--color-white);
		--modal-border-color: var(--color-gray-dark);
		--modal-backdrop-color: rgba(0, 0, 0, 0.7);
		/* Note: backdrop color is a specific opacity value, kept as rgba for clarity */
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--modal-backdrop-color);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 110;
		cursor: pointer;
	}

	.modal-content {
		background-color: var(--modal-background-color);
		border: 1px solid var(--modal-border-color);
		border-radius: 8px;
		padding: 20px 50px;
		max-width: var(--modal-max-width, 550px);
		width: fit-content;
		max-height: 90vh;
		overflow-y: auto;
		cursor: default;
	}

	/* Responsive adjustments */
	@media (max-height: 750px) {
		.modal-content {
			padding: 16px;
		}
	}

	@media (max-height: 500px) {
		.modal-content {
			padding: 12px;
		}
	}
</style>

