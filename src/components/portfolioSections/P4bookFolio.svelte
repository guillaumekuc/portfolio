<div class="portfolioSectionWrapper p4bookWrapper">
	<div class="halfColumn">
		<img loading="lazy" src={resolvedCoverImage} alt="Cover" />
	</div>
	<div class="halfColumn P4bookQuote scrollable">
		<span class="title p4bookTitle">{title} — <small>{subtitle}</small></span>
		<div class="content">
			{@html parsedMarkdown}
		</div>
		<a
			class="focus extLinkBtn"
			href={linkUrl}
			><img loading="lazy" src="/img/nav/gotoURL.png" alt="Go to URL" /><span>{linkText}</span></a
		>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { marked } from 'marked';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';

	export let sectionConfig = {};

	// Configure marked to allow HTML
	marked.setOptions({
		breaks: false,
		gfm: true
	});

	// Dynamically load all markdown files
	const contentModules = import.meta.glob('../../content/*.md', { 
		eager: true, 
		as: 'raw'
	});

	// Get content from config, fallback to defaults
	const title = sectionConfig?.title || '';
	const subtitle = sectionConfig?.subtitle || '';
	const linkUrl = sectionConfig?.linkUrl || '';
	const linkText = sectionConfig?.linkText || '';
	const coverImage = sectionConfig?.coverImage || '';
	const contentPath = sectionConfig?.contentPath || '';
	const rawMarkdown = contentPath ? (contentModules[`../../content/${contentPath}`] || '').trim() : '';
	const parsedMarkdown = rawMarkdown ? marked.parse(rawMarkdown) : '';
	
	// Resolve asset URL
	const resolvedCoverImage = coverImage ? getAssetUrl(coverImage) : '';

	function openP4bookLink() {
		const link = document.querySelector('#P4book .extLinkBtn');
		if (link && link.href) {
			window.open(link.href, '_blank');
		}
	}

	onMount(() => {
		shortcuts.addScreenShortcut('P4book', 'Enter', openP4bookLink);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('P4book');
	});
</script>

<style>
	.p4bookWrapper {
		/* Font interface variables - map global variables to local scope */
		--p4book-font-rounded: var(--ffRounded);
	}

	.halfColumn {
		width: 50%;
		height: 80vh;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin)));
	}

	.halfColumn img {
		height: 100%;
		width: auto;
	}

	.P4bookQuote {
		padding-left: calc(var(--safeMargin) / 2);
		padding-right: var(--safeMargin);
		margin-right: var(--safeMargin);
		margin-left: 0;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(170, 170, 170, 0.3) transparent;
	}

	.P4bookQuote::-webkit-scrollbar {
		width: 6px;
	}

	.P4bookQuote::-webkit-scrollbar-track {
		background: transparent;
	}

	.P4bookQuote::-webkit-scrollbar-thumb {
		background-color: rgba(170, 170, 170, 0.3);
		border-radius: 3px;
		transition: background-color 0.2s ease;
	}

	.P4bookQuote::-webkit-scrollbar-thumb:hover {
		background-color: rgba(170, 170, 170, 0.5);
	}

	.P4bookQuote .content {
		display: block;
		text-align: justify;
		text-align-last: left;
		font-size: 116.66%;
		font-style: normal;
	}

	.p4bookTitle {
		font-family: var(--p4book-font-rounded);
	}
</style>
