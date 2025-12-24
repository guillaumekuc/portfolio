<div class="contactSection">
	<ContactBlocks layout="horizontal" showBlog={false} />
</div>

<script>
	import ContactBlocks from './ContactBlocks.svelte';
</script>

<style>
	.contactSection {
		/* Font interface variables - map global variables to local scope */
		--contact-font-rounded: var(--ffRounded);
	}
	.contactSection {
		margin-top: 1em;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: var(--contact-section-gap);
		overflow: visible;
		
		/* Color interface variables */
		--contact-accent-color: var(--color-accent);
		--contact-text-primary: var(--color-white);
		--contact-text-secondary: var(--color-gray-light);
		--contact-background-secondary: var(--color-background-secondary);
		
		/* Contact section variables */
		--icon-circle-size: 52px;
		--contact-icon-size: 32px;
		--contact-label-size: 18px;
		--contact-email-size: 11px;
		--contact-section-gap: 2em;
		--contact-group-gap: 1em;
	}

	/* Responsive margin adjustments */
	@media (max-height: 750px) {
		.contactSection {
			margin-top: 0.75em;
		}
	}

	@media (max-height: 500px) {
		.contactSection {
			margin-top: 0.5em;
		}
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.contactSection {
			--icon-circle-size: 44px;
			--contact-icon-size: 26px;
			--contact-label-size: 15px;
			--contact-section-gap: 1.5em;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.contactSection {
			--icon-circle-size: 32px;
			--contact-icon-size: 16px;
			--contact-label-size: 13px;
			--contact-email-size: 10px;
			--contact-section-gap: 1.2em;
			--contact-group-gap: 0.6em;
		}
	}

</style>


