<div id="about" class="fullPage portfolioSection aboutme" data-categories="portfolio-about any">
	<!-- <AnimatedBackground /> -->
	<div class="vertWrapper">
		<div id="contentWrapper" style="">
			<div class="leftColumn">
				<div class="profileSection">
					<ProfileAvatar onClick={handleProfileClick} />
					<ProfileInfo />
				</div>
				{#if profile.availableForHire}
					<div class="profileAvailability">Open to new opportunities <span class="separator">•</span> <span class="profileLocationInline">{profile.location}</span></div>
				{/if}
				{#if isMobile}
					<ContactBlocks layout="vertical" showBlog={true} align="left" />
				{/if}
				{#if !isMobile}
					<BlogFeed />
				{/if}
			</div>

			<div class="rightColumn">
				<div bind:this={scrollableElement} id="aboutDescription" class="scrollable">
					{@html parsedMarkdown}
				</div>
				{#if !isMobile}
					<ContactBlocks layout="horizontal" showBlog={false} />
				{/if}
			</div>
		</div>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { marked } from 'marked';
	import { shortcuts } from '../utils/shortcuts.js';
	import { Navigation } from '../utils/navigation.js';
	import aboutMarkdown from '../content/about.md?raw';
	import { debugLog } from '../utils/debuglog.js';
	import ProfileAvatar from './ProfileAvatar.svelte';
	import ProfileInfo from './ProfileInfo.svelte';
	import BlogFeed from './BlogFeed.svelte';
	import ContactBlocks from './ContactBlocks.svelte';
	import AnimatedBackground from './AnimatedBackground.svelte';
	import profile from '../config/profile.json';

	// Configure marked to allow HTML
	marked.setOptions({
		breaks: false,
		gfm: true
	});

	let parsedMarkdown = marked.parse(aboutMarkdown);
	let scrollableElement;
	let isMobile = false;

	function checkMobile() {
		isMobile = window.innerHeight <= 500;
	}

	function handleProfileClick(event) {
		Navigation.goToHome();
	}

	function goBackToTop() {
		Navigation.goToHome();
	}

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
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		debugLog('About component mounted, registering shortcuts');
		// Screen-specific shortcuts for the about page
		// ArrowLeft: scroll content up (note: scrollable element scrolls vertically with horizontal arrows)
		// ArrowRight: scroll content down
		// Enter: go back to top (splashscreen)
		shortcuts.addScreenShortcut('about', 'ArrowLeft', scrollContentUp, true);
		shortcuts.addScreenShortcut('about', 'ArrowRight', scrollContentDown, true);
		shortcuts.addScreenShortcut('about', 'Enter', goBackToTop, true);
		debugLog('About shortcuts registered for screen: about');
		
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	onDestroy(() => {
		debugLog('About component unmounting, removing shortcuts');
		shortcuts.removeScreenShortcuts('about');
	});
</script>

<style>
	#about {
		/* Interface variables - map global variables to local scope */
		--about-accent-color: var(--color-accent);
		--about-margin: calc(var(--header-footer-height) + var(--safeMargin));
		--about-font-rounded: var(--ffRounded);
		--about-font-primary: var(--ffCrimson);
		
		/* Local variables */
		--about-total-width: 960px;
		--about-column-gap: 10px;
		
		/* Color interface variables */
		--about-white: var(--color-white);
		--about-gray: var(--color-gray-light);
		--about-gray-dark: var(--color-gray-medium);
		--about-background-primary: var(--color-background-primary);
		
		/* Responsive font sizes */
		--about-font-size: 20px;
		
		position: relative;
	}

	/* small desktop viewport */
	@media (max-height: 950px) {
		#about {
			--about-font-size: 18px;
		}
	}

	/* tablet viewport */
	@media (max-height: 750px) {
		#about {
			--about-font-size: 16px;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		#about {
			--about-font-size: 14px;
		}
	}

	.aboutme {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#contentWrapper {
		width: calc(var(--about-total-width) + 60px);
		max-width: calc(100vw - 2 * var(--about-margin));
		height: 100vh;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		gap: var(--about-column-gap);
		box-sizing: border-box;
		background-color: var(--about-background-primary);
		z-index: 1;
		padding-top: var(--about-margin);
		padding-bottom: var(--about-margin);
		padding-left: 30px;
		padding-right: 30px;
		overflow: hidden;
	}

	.leftColumn {
		width: calc((var(--about-total-width) - var(--about-column-gap)) * 2 / 5);
		max-width: calc((100% - var(--about-column-gap)) * 2 / 5);
		min-width: 0;
		flex-shrink: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
		height: 100%;
	}

	/* Optimize column widths for reading on small screens */
	/* small desktop viewport - keep 2/5 and 3/5 ratio for 18px font */
	@media (max-height: 950px) {
		.leftColumn {
			width: calc((var(--about-total-width) - var(--about-column-gap)) * 2 / 5);
			max-width: calc((100% - var(--about-column-gap)) * 2 / 5);
		}

		.rightColumn {
			width: calc((var(--about-total-width) - var(--about-column-gap)) * 3 / 5);
			max-width: calc((100% - var(--about-column-gap)) * 3 / 5);
		}
	}

	/* tablet viewport - 3/7 and 4/7 ratio for better readability at 16px font */
	@media (max-height: 750px) {
		.leftColumn {
			width: calc((var(--about-total-width) - var(--about-column-gap)) * 3 / 7);
			max-width: calc((100% - var(--about-column-gap)) * 3 / 7);
		}

		.rightColumn {
			width: calc((var(--about-total-width) - var(--about-column-gap)) * 4 / 7);
			max-width: calc((100% - var(--about-column-gap)) * 4 / 7);
		}
	}

	/* mobile viewport - 1/2 and 1/2 ratio for 14px font readability */
	@media (max-height: 500px) {
		#about {
			--about-total-width: 680px;
		}

		.leftColumn {
			width: calc((var(--about-total-width) - var(--about-column-gap)) * 1 / 2);
			max-width: calc((100% - var(--about-column-gap)) * 1 / 2);
		}

		.rightColumn {
			width: calc((var(--about-total-width) - var(--about-column-gap)) * 1 / 2);
			max-width: calc((100% - var(--about-column-gap)) * 1 / 2);
		}
	}

	.profileSection {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
		width: 100%;
	}

	/* Horizontal compact layout for small screens */
	/* tablet viewport */
	@media (max-height: 750px) {
		.profileSection {
			flex-direction: row;
			align-items: center;
			gap: 0.75em;
		}
	}

	/* mobile viewport */
	@media (max-height: 500px) {
		.profileSection {
			flex-direction: row;
			align-items: center;
			gap: 0.5em;
			justify-content: center;
		}

		.leftColumn {
			gap: 0.75em;
			align-items: flex-start;
		}

		.profileAvailability {
			text-align: left;
		}

		:global(.contactBlocks.vertical) {
			width: 100%;
			margin-top: 0.5em;
			--icon-circle-size: 24px;
			--contact-icon-size: 12px;
			--contact-label-size: 10px;
			--contact-email-size: 9px;
			--contact-group-gap: 0.5em;
		}
	}

	.profileAvailability {
		font-family: var(--about-font-rounded);
		font-size: 14px;
		font-weight: 500;
		color: var(--about-accent-color);
		text-align: center;
		letter-spacing: 0.05em;
		width: 100%;
	}

	.separator {
		color: var(--about-gray);
	}

	.profileLocationInline {
		color: var(--about-gray);
		font-weight: 300;
	}

	/* Responsive sizing for availability */
	@media (max-height: 950px) {
		.profileAvailability {
			font-size: 13px;
		}
	}

	@media (max-height: 750px) {
		.profileAvailability {
			font-size: 11px;
			text-align: left;
		}
	}

	@media (max-height: 500px) {
		.profileAvailability {
			font-size: 10px;
			text-align: left;
		}
	}

	.rightColumn {
		width: calc((var(--about-total-width) - var(--about-column-gap)) * 3 / 5);
		max-width: calc((100% - var(--about-column-gap)) * 3 / 5);
		min-width: 0;
		flex-shrink: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	#aboutDescription {
		width: 100%;
		min-width: 0;
		height: 100%;
		font-size: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: rgba(170, 170, 170, 0.3) transparent;
		padding-left: calc(var(--about-margin) / 2);
		padding-right: calc(var(--about-margin) / 2);
		text-align: left;
		box-sizing: border-box;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	#aboutDescription::-webkit-scrollbar {
		width: 6px;
	}

	#aboutDescription::-webkit-scrollbar-track {
		background: transparent;
	}

	#aboutDescription::-webkit-scrollbar-thumb {
		background-color: rgba(170, 170, 170, 0.3);
		border-radius: 3px;
		transition: background-color 0.2s ease;
	}

	#aboutDescription::-webkit-scrollbar-thumb:hover {
		background-color: rgba(170, 170, 170, 0.5);
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
		margin-top: 1em;
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
</style>
