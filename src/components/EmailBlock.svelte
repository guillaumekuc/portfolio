<div class="contactGroup">
	<div class="iconCircle" class:selected={selected} on:click={handleMailClick} on:keydown={(e) => e.key === 'Enter' && handleMailClick(e)} role="button" tabindex="0">
		<div class="contactIcon" style="--icon-url: url('/img/nav/contact.svg')"></div>
	</div>
	<div class="contactInfo">
		<div class="contactLabel">Email</div>
		<div class="emailRow">
			<a
				bind:this={emailElement}
				class="contactEmail"
				target="_blank"
				on:click|preventDefault={handleMailClick}
				href="#">{emailAddress}</a
			>
			<div class="copyIconWrapper">
				<svg 
					class="copyIcon" 
					on:click={handleCopyEmail} 
					on:keydown={(e) => e.key === 'Enter' && handleCopyEmail(e)} 
					role="button" 
					tabindex="0"
					viewBox="0 0 32 32" 
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="m8 8v11.3333333c0 2.5057364 1.97487565 4.5502158 4.4530532 4.6618646l.2136135.0048021h11.3333333v4c0 2.209139-1.790861 4-4 4h-16c-2.209139 0-4-1.790861-4-4v-16c0-2.209139 1.790861-4 4-4zm21-8c1.6568542 0 3 1.34314575 3 3v16c0 1.6568542-1.3431458 3-3 3h-16c-1.6568542 0-3-1.3431458-3-3v-16c0-1.65685425 1.3431458-3 3-3z" fill="currentColor"/>
				</svg>
				{#if showCopiedTooltip}
					<div class="copiedTooltip">Copied!</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { getEmail, getMailtoUrl, openEmail } from '../utils/email.js';

	export let selected = false;

	let emailAddress = '';
	let emailElement;
	let showCopiedTooltip = false;
	let tooltipTimeout;

	function handleMailClick(event) {
		openEmail();
	}

	export function trigger() {
		openEmail();
	}

	async function handleCopyEmail(event) {
		try {
			await navigator.clipboard.writeText(emailAddress);
			showCopiedTooltip = true;
			
			if (tooltipTimeout) {
				clearTimeout(tooltipTimeout);
			}
			
			tooltipTimeout = setTimeout(() => {
				showCopiedTooltip = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy email:', err);
		}
	}

	onMount(() => {
		emailAddress = getEmail();
		if (emailElement) {
			emailElement.href = getMailtoUrl();
		}
	});

	onDestroy(() => {
		if (tooltipTimeout) {
			clearTimeout(tooltipTimeout);
		}
	});
</script>

<style>
	.contactGroup {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--contact-group-gap, 1em);
		overflow: visible;
	}

	.iconCircle {
		width: var(--icon-circle-size, 52px);
		height: var(--icon-circle-size, 52px);
		border-radius: 50%;
		border: 1px solid var(--contact-accent-color, var(--color-accent));
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		cursor: pointer;
		transition: background-color 0.07s ease-in;
	}

	.iconCircle:hover {
		background-color: var(--contact-accent-color, var(--color-accent));
	}

	.iconCircle.selected {
		background-color: var(--contact-accent-color, var(--color-accent));
		border-color: var(--contact-text-primary, var(--color-white));
		border-width: 2px;
	}

	.contactIcon {
		width: var(--contact-icon-size, 32px);
		height: var(--contact-icon-size, 32px);
		background-color: currentColor;
		mask-image: var(--icon-url);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		color: var(--contact-text-primary, var(--color-white));
		transition: color 0.07s ease-in;
	}

	.iconCircle:hover .contactIcon {
		color: var(--contact-text-primary, var(--color-white));
	}

	.contactInfo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 0.25em;
		overflow: visible;
	}

	.contactLabel {
		font-family: var(--contact-font-rounded, var(--ffRounded));
		font-weight: 700;
		font-size: var(--contact-label-size, 18px);
		color: var(--contact-text-primary, var(--color-white));
	}

	.contactEmail {
		font-family: var(--contact-font-rounded, var(--ffRounded));
		font-weight: 300;
		font-size: var(--contact-email-size, 11px);
		color: var(--contact-text-secondary, var(--color-gray-light));
		text-decoration: none;
		transition: color 0.07s ease-in;
	}

	.contactEmail:hover {
		cursor: pointer;
		color: var(--contact-accent-color, var(--color-accent));
	}

	.emailRow {
		display: flex;
		align-items: center;
		gap: 0.5em;
		overflow: visible;
	}

	.copyIconWrapper {
		position: relative;
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.copyIcon {
		width: 16px;
		height: 16px;
		color: var(--contact-text-secondary, var(--color-gray-light));
		cursor: pointer;
		transition: color 0.07s ease-in;
		flex-shrink: 0;
	}

	.copyIcon:hover {
		color: var(--contact-accent-color, var(--color-accent));
	}

	.copiedTooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--contact-accent-color, var(--color-accent));
		color: var(--contact-text-primary, var(--color-white));
		padding: 6px 10px;
		border-radius: 4px;
		font-size: 11px;
		font-family: var(--ffRounded), sans-serif;
		font-weight: 600;
		white-space: nowrap;
		pointer-events: none;
		z-index: 9999;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		display: block;
		opacity: 1;
	}

	.copiedTooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: var(--contact-accent-color, var(--color-accent));
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.contactInfo {
			flex-direction: row;
			align-items: center;
			gap: 0.4em;
		}

		.contactEmail {
			display: none;
		}

		.copyIcon {
			width: var(--contact-icon-size, 12px);
			height: var(--contact-icon-size, 12px);
		}
	}
</style>

