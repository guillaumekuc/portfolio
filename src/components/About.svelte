<div id="about" class="fullPage portfolioSection aboutme" data-categories="portfolio-about any">
	<div class="vertWrapper">
		<div id="contentWrapper" style="">
			<div id="profilePicture"><img loading="lazy" src="/img/profile-pic.jpg" alt="Profile" /></div>

			<div bind:this={scrollableElement} id="aboutDescription" class="scrollable">
				{@html parsedMarkdown}
			</div>
			<a
				class="emailLink"
				target="_blank"
				on:click|preventDefault={handleMailClick}
				href="mailto:guillaume@guillaumekuc.com">guillaume[at]guillaumekuc.com</a
			>
		</div>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { marked } from 'marked';
	import { Tooltip } from '../utils/tooltip.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import aboutMarkdown from '../content/about.md?raw';

	// Configure marked to allow HTML
	marked.setOptions({
		breaks: false,
		gfm: true
	});

	let parsedMarkdown = marked.parse(aboutMarkdown);

	function handleMailClick(event) {
		Tooltip.handleMailTooltip(event);
		window.open('mailto:guillaume@guillaumekuc.com', 'mail');
	}

	function goBackToTop() {
		const splashscreen = document.querySelector('#splashscreen');
		if (splashscreen) splashscreen.scrollIntoView({ behavior: 'smooth' });
	}

	let scrollableElement;

	function scrollContentUp() {
		if (scrollableElement) {
			scrollableElement.scrollBy({ top: -150, behavior: 'smooth' });
		}
	}

	function scrollContentDown() {
		if (scrollableElement) {
			scrollableElement.scrollBy({ top: 150, behavior: 'smooth' });
		}
	}

	onMount(() => {
		// Screen-specific shortcuts for the about page
		// ArrowLeft: scroll content up
		// ArrowRight: scroll content down
		// Enter: go back to top (splashscreen)
		shortcuts.addScreenShortcut('about', 'ArrowLeft', scrollContentUp);
		shortcuts.addScreenShortcut('about', 'ArrowRight', scrollContentDown);
		shortcuts.addScreenShortcut('about', 'Enter', goBackToTop);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('about');
	});
</script>

<style>
	#about {
		--about-accent-color: var(--accentColor);
		font-size: var(--fs2o3);
	}
	@media (max-height: 648px) {
		#about {
			font-size: var(--fs1o2);
		}
		#profilePicture img {
			height: 3em !important;
			width: 3em !important;
		}
	}

	.aboutme {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#contentWrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#profilePicture img {
		height: 5em;
		width: 5em;
		border-radius: 50%;
		margin-bottom: 0.25em;
	}

	#aboutDescription {
		width: 40%;
		height: 100%;
		font-size: 100%;
		overflow-y: auto;
		scrollbar-width: thin;
		padding-left: calc(var(--safeMargin) / 2);
		padding-right: calc(var(--safeMargin) / 2);
		text-align: left;
	}

	#aboutDescription::-webkit-scrollbar {
		width: 8px;
	}

	@media (max-width: 1152px) {
		#aboutDescription {
			width: 60%;
		}
	}

	/* Markdown content styling */
	#aboutDescription :global(h1) {
		font-family: 'M PLUS Rounded 1c', sans-serif;
		font-size: 125%;
		font-weight: 400;
		margin-bottom: 0.5em;
		margin-top: 0;
		line-height: 1.2;
		text-align: left;
	}

	#aboutDescription :global(h2) {
		font-family: var(--ff1);
		font-size: 110%;
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
		font-family: var(--ff1);
		font-style: italic;
		font-weight: 300;
		margin: 1.5em 0;
		padding-left: 1em;
		border-left: 2px solid var(--shade3);
		color: var(--shade4);
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
		background-color: var(--shade3);
		padding: 2px 5px;
		border-radius: 5px;
		font-weight: bold;
	}

	#aboutDescription :global(em),
	#aboutDescription :global(i) {
		color: var(--shade4);
		font-style: italic;
	}

	#aboutDescription :global(a) {
		background-color: var(--shade3);
		color: var(--shadeWhite);
		padding: 2px 5px;
		border-radius: 5px;
		text-decoration: none;
		transition: background-color 0.07s ease-in;
	}

	#aboutDescription :global(a:hover) {
		background-color: var(--about-accent-color);
		cursor: pointer;
	}

	.emailLink {
		position: relative;
		margin-top: calc(var(--safeMargin) / 3);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		padding: 2px 10px;
		color: var(--shade3);
	}

	:global(.emailLink .tooltipText) {
		top: 125%;
		left: 50%;
		transform: translateX(-50%);
	}

	.emailLink:hover {
		cursor: pointer;
		color: var(--shadeWhite);
		background-color: var(--about-accent-color);
	}
</style>
