<div class="contactSection">
	<div class="contactGroup">
		<div class="iconCircle" on:click={handleMailClick} on:keydown={(e) => e.key === 'Enter' && handleMailClick(e)} role="button" tabindex="0">
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

	<div class="contactGroup">
		<div class="iconCircle" on:click={handleResumeClick} on:keydown={(e) => e.key === 'Enter' && handleResumeClick(e)} role="button" tabindex="0">
			<div class="contactIcon" style="--icon-url: url('/img/nav/resume.svg')"></div>
		</div>
		<div class="contactInfo">
			<div class="contactLabel">Resume</div>
			<div class="resumeRow">
				<div 
					class="resumeIcon" 
					on:click={handleResumeView} 
					on:keydown={(e) => e.key === 'Enter' && handleResumeView(e)} 
					role="button" 
					tabindex="0"
					style="--icon-url: url('/img/nav/ext-link.svg')"
					title="View"
				></div>
				<div 
					class="resumeIcon" 
					on:click={handleResumeDownload} 
					on:keydown={(e) => e.key === 'Enter' && handleResumeDownload(e)} 
					role="button" 
					tabindex="0"
					style="--icon-url: url('/img/nav/download.svg')"
					title="Download"
				></div>
			</div>
		</div>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { getEmail, getMailtoUrl, openEmail } from '../utils/email.js';
	import profile from '../config/profile.json';

	let emailAddress = '';
	let emailElement;
	let showCopiedTooltip = false;
	let tooltipTimeout;

	function handleMailClick(event) {
		openEmail();
	}

	function handleResumeClick(event) {
		window.open(profile.resumeUrl, '_blank');
	}

	function handleResumeView(event) {
		window.open(profile.resumeUrl, '_blank');
	}

	function handleResumeDownload(event) {
		// TODO: Add download functionality
		console.log('Download resume clicked');
	}

	async function handleCopyEmail(event) {
		try {
			await navigator.clipboard.writeText(emailAddress);
			showCopiedTooltip = true;
			
			// Clear any existing timeout
			if (tooltipTimeout) {
				clearTimeout(tooltipTimeout);
			}
			
			// Hide tooltip after 2 seconds
			tooltipTimeout = setTimeout(() => {
				showCopiedTooltip = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy email:', err);
		}
	}

	onMount(() => {
		// Assemble email at runtime to protect from bots
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
	.contactSection {
		margin-top: 1em;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: var(--contact-section-gap);
		overflow: visible;
		
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

		.copyIcon,
		.resumeIcon {
			width: 12px;
			height: 12px;
		}
	}

	.contactGroup {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--contact-group-gap);
		overflow: visible;
	}

	.iconCircle {
		width: var(--icon-circle-size);
		height: var(--icon-circle-size);
		border-radius: 50%;
		border: 1px solid var(--accentColor);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		cursor: pointer;
		transition: background-color 0.07s ease-in;
	}

	.iconCircle:hover {
		background-color: var(--accentColor);
	}

	.contactIcon {
		width: var(--contact-icon-size);
		height: var(--contact-icon-size);
		background-color: currentColor;
		mask-image: var(--icon-url);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		color: #fff;
		transition: color 0.07s ease-in;
	}

	.iconCircle:hover .contactIcon {
		color: #fff;
	}

	.contactInfo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 0.25em;
		overflow: visible;
	}

	/* mobile viewport - single line layout */
	@media (max-height: 500px) {
		.contactSection {
			--icon-circle-size: 28px;
			--contact-icon-size: 14px;
		}

		.contactInfo {
			flex-direction: row;
			align-items: center;
			gap: 0.4em;
		}

		.contactEmail {
			display: none;
		}

		.copyIcon,
		.resumeIcon {
			width: 10px;
			height: 10px;
		}
	}

	.contactLabel {
		font-family: var(--ffRounded);
		font-weight: 700;
		font-size: var(--contact-label-size);
		color: #fff;
	}

	.contactEmail {
		font-family: var(--ffRounded);
		font-weight: 300;
		font-size: var(--contact-email-size);
		color: #aaaaaa;
		text-decoration: none;
		transition: color 0.07s ease-in;
	}

	.contactEmail:hover {
		cursor: pointer;
		color: var(--accentColor);
	}

	.emailRow {
		display: flex;
		align-items: center;
		gap: 0.5em;
		overflow: visible;
	}

	.resumeRow {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.resumeIcon {
		width: 16px;
		height: 16px;
		background-color: currentColor;
		mask-image: var(--icon-url);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		color: #aaaaaa;
		cursor: pointer;
		transition: color 0.07s ease-in;
		flex-shrink: 0;
	}

	.resumeIcon:hover {
		color: var(--accentColor);
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
		color: #aaaaaa;
		cursor: pointer;
		transition: color 0.07s ease-in;
		flex-shrink: 0;
	}

	.copyIcon:hover {
		color: var(--accentColor);
	}

	.copiedTooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--accentColor);
		color: #fff;
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
		border-top-color: var(--accentColor);
	}
</style>


