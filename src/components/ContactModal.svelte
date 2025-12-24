<Modal modalId="contactModal" maxWidth="600px">
	<div class="contact-modal-body">
		<div class="contact-modal-profile">
			<ProfileAvatar />
			<ProfileInfo />
		</div>
		<ContactSection />
	</div>
</Modal>

<script>
	import Modal from './Modal.svelte';
	import ProfileAvatar from './ProfileAvatar.svelte';
	import ProfileInfo from './ProfileInfo.svelte';
	import ContactSection from './ContactSection.svelte';
</script>

<style>
	.contact-modal-body {
		display: flex;
		flex-direction: column;
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

