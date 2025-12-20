<div class="modal">
	<div 
		class="modal-backdrop" 
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && handleBackdropClick()}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	>
		<div 
			class="modal-content" 
			style="--modal-max-width: {maxWidth}"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="presentation"
		>
			{#if title}
				<h2 class="modal-title">{title}</h2>
			{/if}
			<slot />
		</div>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { stores } from '../stores.js';
	import { shortcuts } from '../utils/shortcuts.js';

	export let modalId;
	export let title = null;
	export let maxWidth = '550px';

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
		padding: 20px;
		max-width: var(--modal-max-width, 550px);
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
		cursor: default;
	}

	.modal-title {
		color: var(--modal-text-color);
		font-family: 'M PLUS Rounded 1c';
		font-size: 24px;
		font-weight: 400;
		margin: 0 0 12px 0;
		text-align: center;
	}

	/* Responsive adjustments */
	@media (max-height: 750px) {
		.modal-content {
			padding: 16px;
		}

		.modal-title {
			font-size: 20px;
			margin-bottom: 16px;
		}
	}

	@media (max-height: 500px) {
		.modal-content {
			padding: 12px;
		}

		.modal-title {
			font-size: 18px;
			margin-bottom: 12px;
		}
	}
</style>

