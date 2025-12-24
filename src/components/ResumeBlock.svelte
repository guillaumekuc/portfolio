<div class="contactGroup">
	<div class="iconCircle" class:selected={selected} on:click={handleResumeClick} on:keydown={(e) => e.key === 'Enter' && handleResumeClick(e)} role="button" tabindex="0">
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

<script>
	import profile from '../config/profile.json';

	export let selected = false;

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

	export function trigger() {
		window.open(profile.resumeUrl, '_blank');
	}
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
		color: var(--contact-text-secondary, var(--color-gray-light));
		cursor: pointer;
		transition: color 0.07s ease-in;
		flex-shrink: 0;
	}

	.resumeIcon:hover {
		color: var(--contact-accent-color, var(--color-accent));
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.contactInfo {
			flex-direction: row;
			align-items: center;
			gap: 0.4em;
		}

		.resumeIcon {
			width: var(--contact-icon-size, 12px);
			height: var(--contact-icon-size, 12px);
		}
	}
</style>

