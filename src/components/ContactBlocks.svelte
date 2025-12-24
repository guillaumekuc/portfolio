<div class="contactBlocks" class:vertical={layout === 'vertical'} class:horizontal={layout === 'horizontal'} class:alignLeft={align === 'left'} class:alignCenter={align === 'center'}>
	<EmailBlock bind:this={emailBlockRef} selected={selectedIndex === 0} />
	<ResumeBlock bind:this={resumeBlockRef} selected={selectedIndex === 1} />
	{#if showBlog}
		<BlogBlock bind:this={blogBlockRef} selected={selectedIndex === 2} />
	{/if}
</div>

<script>
	import EmailBlock from './EmailBlock.svelte';
	import ResumeBlock from './ResumeBlock.svelte';
	import BlogBlock from './BlogBlock.svelte';

	export let layout = 'horizontal'; // 'horizontal' or 'vertical'
	export let showBlog = false; // whether to show blog block
	export let align = 'center'; // 'left' or 'center' - alignment for vertical layout
	export let selectedIndex = -1; // Selected button index (-1 means none selected, only used in modal)

	let emailBlockRef;
	let resumeBlockRef;
	let blogBlockRef;

	export function getButtonCount() {
		return showBlog ? 3 : 2;
	}

	export function triggerButton(index) {
		if (index === 0 && emailBlockRef) {
			emailBlockRef.trigger();
		} else if (index === 1 && resumeBlockRef) {
			resumeBlockRef.trigger();
		} else if (index === 2 && showBlog && blogBlockRef) {
			blogBlockRef.trigger();
		}
	}
</script>

<style>
	.contactBlocks {
		/* Font interface variables - map global variables to local scope */
		--contact-font-rounded: var(--ffRounded);
		
		/* Color interface variables */
		--contact-accent-color: var(--color-accent);
		--contact-text-primary: var(--color-white);
		--contact-text-secondary: var(--color-gray-light);
		--contact-background-secondary: var(--color-background-secondary);
		
		/* Contact section variables - can be overridden by parent */
		--icon-circle-size: 52px;
		--contact-icon-size: 32px;
		--contact-label-size: 18px;
		--contact-email-size: 11px;
		--contact-section-gap: 2em;
		--contact-group-gap: 1em;
		
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--contact-section-gap);
		overflow: visible;
	}

	.contactBlocks.vertical {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5em;
		width: fit-content;
	}

	.contactBlocks.vertical.alignCenter {
		margin-left: auto;
		margin-right: auto;
	}

	.contactBlocks.vertical.alignLeft {
		margin-left: 0;
		margin-right: 0;
	}

	.contactBlocks.horizontal {
		flex-direction: row;
		align-items: center;
		gap: var(--contact-section-gap, 2em);
		margin-top: 1em;
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		.contactBlocks {
			--icon-circle-size: 44px;
			--contact-icon-size: 26px;
			--contact-label-size: 15px;
			--contact-section-gap: 1.5em;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		.contactBlocks {
			--icon-circle-size: 32px;
			--contact-icon-size: 16px;
			--contact-label-size: 13px;
			--contact-email-size: 10px;
			--contact-section-gap: 1.2em;
			--contact-group-gap: 0.6em;
		}
		.contactBlocks.horizontal {
			margin-top: 0.75em;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.contactBlocks.horizontal {
			--contact-section-gap: 1em;
			margin-top: 0.5em;
		}
	}
</style>

