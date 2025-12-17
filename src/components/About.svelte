<div id="about" class="fullPage portfolioSection aboutme" data-categories="portfolio-about any">
	<div class="vertWrapper">
		<div id="contentWrapper" style="">
			<div class="leftColumn">
				<ProfileAvatar onClick={handleProfileClick} />
				<div class="profileInfo">
					<div class="profileName">{profile.name}</div>
					<div class="profileHeadline">{profile.headline}</div>
					<div class="profileLocation">{profile.location}</div>
					<div class="socialLinks">
						{#each socials.socials.filter(s => !s.disabled) as social}
							<a 
								href={social.url} 
								target="_blank" 
								rel="noopener noreferrer"
								class="socialLink"
								title={social.name}
								style="--icon-url: url('{social.icon}')"
							>
							</a>
						{/each}
					</div>
				</div>
			</div>

			<div class="rightColumn">
				<div bind:this={scrollableElement} id="aboutDescription" class="scrollable">
					{@html parsedMarkdown}
				</div>
				
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
			</div>
		</div>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { marked } from 'marked';
	import { shortcuts } from '../utils/shortcuts.js';
	import { Navigation } from '../utils/navigation.js';
	import { getEmail, getMailtoUrl, openEmail } from '../utils/email.js';
	import aboutMarkdown from '../content/about.md?raw';
	import profile from '../config/profile.json';
	import socials from '../config/socials.json';
	import { debugLog } from '../utils/debuglog.js';
	import ProfileAvatar from './ProfileAvatar.svelte';

	// Configure marked to allow HTML
	marked.setOptions({
		breaks: false,
		gfm: true
	});

	let parsedMarkdown = marked.parse(aboutMarkdown);
	let emailAddress = '';
	let emailElement;
	let showCopiedTooltip = false;
	let tooltipTimeout;

	function handleProfileClick(event) {
		Navigation.goToHome();
	}

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

	function goBackToTop() {
		Navigation.goToHome();
	}

	let scrollableElement;

	function scrollContentUp(e) {
		if (scrollableElement) {
			// Prevent default to avoid conflicts with browser scroll behavior
			if (e) e.preventDefault();
			scrollableElement.scrollBy({ top: -150, behavior: 'smooth' });
		}
	}

	function scrollContentDown(e) {
		if (scrollableElement) {
			// Prevent default to avoid conflicts with browser scroll behavior
			if (e) e.preventDefault();
			scrollableElement.scrollBy({ top: 150, behavior: 'smooth' });
		}
	}

	onMount(() => {
		// Assemble email at runtime to protect from bots
		emailAddress = getEmail();
		if (emailElement) {
			emailElement.href = getMailtoUrl();
		}
		
		debugLog('About component mounted, registering shortcuts');
		// Screen-specific shortcuts for the about page
		// ArrowLeft: scroll content up (note: scrollable element scrolls vertically with horizontal arrows)
		// ArrowRight: scroll content down
		// Enter: go back to top (splashscreen)
		shortcuts.addScreenShortcut('about', 'ArrowLeft', scrollContentUp, true);
		shortcuts.addScreenShortcut('about', 'ArrowRight', scrollContentDown, true);
		shortcuts.addScreenShortcut('about', 'Enter', goBackToTop, true);
		debugLog('About shortcuts registered for screen: about');
	});

	onDestroy(() => {
		debugLog('About component unmounting, removing shortcuts');
		shortcuts.removeScreenShortcuts('about');
		if (tooltipTimeout) {
			clearTimeout(tooltipTimeout);
		}
	});
</script>

<style>
	#about {
		/* Interface variables - map global variables to local scope */
		--about-accent-color: var(--accentColor);
		--about-margin: var(--safeMargin);
		--about-font-rounded: var(--ffRounded);
		--about-font-primary: var(--ffCrimson);
		
		/* Local variables */
		--about-total-width: 960px;
		--about-column-gap: 10px;
		--about-letter-spacing: 0.05em;
		
		/* Hardcoded color values */
		--about-white: #fff;
		--about-gray: #aaaaaa;
		--about-gray-dark: #343434;
		--about-gray-darker: #242424;
		
		/* Hardcoded font sizes */
		--about-font-size: 20px;
		--about-font-size-small: 15px;
		
		font-size: var(--about-font-size);
	}
	@media (max-height: 648px) {
		#about {
			font-size: var(--about-font-size-small);
		}
	}

	.aboutme {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#contentWrapper {
		width: var(--about-total-width);
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		gap: var(--about-column-gap);
	}

	.leftColumn {
		width: calc((var(--about-total-width) - var(--about-column-gap)) * 2 / 5);
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
	}

	.profileInfo {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.profileName {
		font-family: var(--about-font-rounded);
		font-size: 24px;
		font-weight: 500;
		color: var(--about-white);
		text-align: center;
		letter-spacing: var(--about-letter-spacing);
	}

	.profileHeadline {
		font-family: var(--about-font-rounded);
		font-size: 18px;
		font-weight: 400;
		color: var(--about-gray);
		text-align: center;
		letter-spacing: var(--about-letter-spacing);
	}

	.profileLocation {
		font-family: var(--about-font-rounded);
		font-size: 14px;
		font-weight: 300;
		color: var(--about-gray);
		text-align: center;
		letter-spacing: var(--about-letter-spacing);
		margin-top: 0.25em;
	}

	.socialLinks {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75em;
		justify-content: center;
		align-items: center;
		height: 32px;
	}

	.socialLink {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background-color: currentColor;
		mask-image: var(--icon-url);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		color: var(--about-white);
		transition: transform 0.15s ease-in, color 0.15s ease-in;
	}

	.socialLink:hover {
		transform: scale(1.1);
		color: var(--about-accent-color);
	}

	.rightColumn {
		width: calc((var(--about-total-width) - var(--about-column-gap)) * 3 / 5);
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	#aboutDescription {
		width: 100%;
		height: 100%;
		font-size: 100%;
		overflow-y: auto;
		scrollbar-width: thin;
		padding-left: calc(var(--about-margin) / 2);
		padding-right: calc(var(--about-margin) / 2);
		text-align: left;
	}

	#aboutDescription::-webkit-scrollbar {
		width: 8px;
	}

	/* Markdown content styling */
	#aboutDescription :global(h1) {
		font-family: var(--about-font-rounded);
		font-size: 30px;
		font-weight: 800;
		margin-bottom: 0.5em;
		margin-top: 0;
		line-height: 1.2;
		text-align: left;
	}

	#aboutDescription :global(h2) {
		font-family: var(--about-font-primary);
		font-size: 24px;
		font-weight: 400;
		margin-top: 1.5em;
		margin-bottom: 0.75em;
		line-height: 1.2;
		text-align: left;
		display: inline-block;
		border-bottom: 2px solid var(--about-accent-color);
		padding-bottom: 0.25em;
	}

	#aboutDescription :global(h2::before) {
		content: '◈ ';
	}

	#aboutDescription :global(p) {
		margin-bottom: 1em;
		line-height: 1.5;
		text-align: left;
	}

	#aboutDescription :global(p:last-child) {
		margin-bottom: 0;
	}

	#aboutDescription :global(blockquote) {
		font-family: var(--about-font-primary);
		font-style: italic;
		font-weight: 300;
		margin: 1.5em 0;
		padding-left: 1em;
		border-left: 2px solid var(--about-gray-dark);
		color: var(--about-gray);
		text-align: left;
	}

	#aboutDescription :global(blockquote::before),
	#aboutDescription :global(blockquote::after) {
		content: none;
	}

	#aboutDescription :global(blockquote p) {
		margin-bottom: 0.5em;
	}

	#aboutDescription :global(blockquote p:last-child) {
		margin-bottom: 0;
	}

	#aboutDescription :global(strong) {
		font-variant: small-caps;
		background-color: var(--about-gray-dark);
		padding: 2px 5px;
		border-radius: 5px;
		font-weight: bold;
	}

	#aboutDescription :global(em),
	#aboutDescription :global(i) {
		color: var(--about-gray);
		font-style: italic;
	}

	#aboutDescription :global(a) {
		background-color: var(--about-gray-dark);
		color: var(--about-white);
		padding: 2px 5px;
		border-radius: 5px;
		text-decoration: none;
		transition: background-color 0.07s ease-in;
	}

	#aboutDescription :global(a:hover) {
		background-color: var(--about-accent-color);
		cursor: pointer;
	}

	.contactSection {
		margin-top: calc(var(--about-margin) / 3);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 2em;
		overflow: visible;
	}

	.contactGroup {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
		overflow: visible;
	}

	.iconCircle {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		border: 1px solid var(--about-accent-color);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		cursor: pointer;
		transition: background-color 0.07s ease-in;
	}

	.iconCircle:hover {
		background-color: var(--about-accent-color);
	}

	.contactIcon {
		width: 32px;
		height: 32px;
		background-color: currentColor;
		mask-image: var(--icon-url);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		color: var(--about-white);
		transition: color 0.07s ease-in;
	}

	.iconCircle:hover .contactIcon {
		color: var(--about-white);
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
		font-family: var(--about-font-rounded);
		font-weight: 700;
		font-size: 18px;
		color: var(--about-white);
	}

	.contactEmail {
		font-family: var(--about-font-rounded);
		font-weight: 300;
		font-size: 11px;
		color: var(--about-gray);
		text-decoration: none;
		transition: color 0.07s ease-in;
	}

	.contactEmail:hover {
		cursor: pointer;
		color: var(--about-accent-color);
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
		color: var(--about-gray);
		cursor: pointer;
		transition: color 0.07s ease-in;
		flex-shrink: 0;
	}

	.resumeIcon:hover {
		color: var(--about-accent-color);
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
		color: var(--about-gray);
		cursor: pointer;
		transition: color 0.07s ease-in;
		flex-shrink: 0;
	}

	.copyIcon:hover {
		color: var(--about-accent-color);
	}

	.copiedTooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--about-accent-color);
		color: var(--about-white);
		padding: 6px 10px;
		border-radius: 4px;
		font-size: 11px;
		font-family: var(--about-font-rounded), sans-serif;
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
		border-top-color: var(--about-accent-color);
	}
</style>
