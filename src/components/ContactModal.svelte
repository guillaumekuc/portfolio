<Modal modalId="contactModal" maxWidth="600px">
	<div class="contact-modal-body">
		<div class="contact-modal-profile">
			<ProfileAvatar />
			<ProfileInfo />
		</div>
		<ContactBlocks bind:this={contactBlocksRef} layout="vertical" showBlog={true} selectedIndex={selectedContactButton} />
	</div>
</Modal>

<script>
	import { onMount, onDestroy } from 'svelte';
	import Modal from './Modal.svelte';
	import ProfileAvatar from './ProfileAvatar.svelte';
	import ProfileInfo from './ProfileInfo.svelte';
	import ContactBlocks from './ContactBlocks.svelte';
	import { shortcuts } from '../utils/shortcuts.js';

	let contactBlocksRef;
	let selectedContactButton = 0; // Local state for selected button index

	function selectPreviousButton() {
		const totalButtons = contactBlocksRef ? contactBlocksRef.getButtonCount() : 3;
		selectedContactButton = selectedContactButton <= 0 ? totalButtons - 1 : selectedContactButton - 1;
	}

	function selectNextButton() {
		const totalButtons = contactBlocksRef ? contactBlocksRef.getButtonCount() : 3;
		selectedContactButton = selectedContactButton >= totalButtons - 1 ? 0 : selectedContactButton + 1;
	}

	function triggerSelectedButton() {
		if (contactBlocksRef) {
			contactBlocksRef.triggerButton(selectedContactButton);
		}
	}

	onMount(() => {
		// Reset selection when modal opens
		selectedContactButton = 0;
		
		// Register modal shortcuts
		shortcuts.addModalShortcut('contactModal', 'ArrowLeft', selectPreviousButton);
		shortcuts.addModalShortcut('contactModal', 'ArrowRight', selectNextButton);
		shortcuts.addModalShortcut('contactModal', 'Enter', triggerSelectedButton);
	});

	onDestroy(() => {
		// Clean up shortcuts
		shortcuts.removeModalShortcuts('contactModal');
	});
</script>

<style>
	.contact-modal-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.contact-modal-profile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
		width: 100%;
	}

	/* Responsive adjustments */
	@media (max-height: 750px) {
		.contact-modal-body {
			gap: 16px;
		}
	}

	@media (max-height: 500px) {
		.contact-modal-body {
			gap: 12px;
		}
	}
</style>

