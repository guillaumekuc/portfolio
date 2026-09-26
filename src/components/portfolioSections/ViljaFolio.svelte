<div class="portfolioSectionWrapper viljaWrapper">
	<div class="halfColumn coverColumn">
		<img class="cover" loading="lazy" src={resolvedCoverImage} alt={title} />
	</div>
	<div class="halfColumn viljaQuote scrollable">
		<span class="title viljaTitle">{title} — <small>{subtitle}</small></span>
		<div class="content">
			{@html parsedMarkdown}
		</div>
		<a
			class="focus extLinkBtn"
			href={linkUrl}
			target="_blank"
			rel="noopener"
			><img loading="lazy" src="/img/nav/gotoURL.png" alt="Go to URL" /><span>{linkText}</span></a
		>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { marked } from 'marked';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';
	import { stores } from '../../stores.js';
	import { L, resolveLocalizedMarkdownPath } from '../../utils/localized.js';

	export let sectionConfig = {};

	const localeStore = stores.i18n.locale;

	// Configure marked to allow HTML
	marked.setOptions({
		breaks: false,
		gfm: true
	});

	const contentModules = import.meta.glob('../../content/*.md', {
		eager: true,
		as: 'raw'
	});

	function loadMarkdown(path, loc) {
		if (!path) return '';
		const localized = resolveLocalizedMarkdownPath(path, loc);
		let raw = contentModules[`../../content/${localized}`] || '';
		if (!String(raw).trim() && loc !== 'en') {
			raw = contentModules[`../../content/${path}`] || '';
		}
		return String(raw).trim();
	}

	$: title = L(sectionConfig?.title, $localeStore);
	$: subtitle = L(sectionConfig?.subtitle, $localeStore);
	$: linkUrl = sectionConfig?.linkUrl || '';
	$: linkText = L(sectionConfig?.linkText, $localeStore);
	$: coverImage = sectionConfig?.coverImage || '';
	$: contentPath = sectionConfig?.contentPath || '';

	$: rawMarkdown = loadMarkdown(contentPath, $localeStore);
	$: parsedMarkdown = rawMarkdown ? marked.parse(rawMarkdown) : '';

	$: resolvedCoverImage = coverImage ? getAssetUrl(coverImage) : '';

	function openViljaLink() {
		const link = document.querySelector('#viljaFolio .extLinkBtn');
		if (link && link.href) {
			window.open(link.href, '_blank');
		}
	}

	onMount(() => {
		shortcuts.addScreenShortcut('viljaFolio', 'Enter', openViljaLink);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('viljaFolio');
	});
</script>

<style>
	.viljaWrapper {
		/* Font interface variables - map global variables to local scope */
		--vilja-font-rounded: var(--ffRounded);
	}

	.halfColumn {
		width: 50%;
		height: 80vh;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin)));
	}

	.coverColumn {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.cover {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		border-radius: var(--radius-large);
	}

	.viljaQuote {
		padding-left: calc(var(--safeMargin) / 2);
		padding-right: var(--safeMargin);
		margin-right: var(--safeMargin);
		margin-left: 0;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(170, 170, 170, 0.3) transparent;
	}

	.viljaQuote::-webkit-scrollbar {
		width: 6px;
	}

	.viljaQuote::-webkit-scrollbar-track {
		background: transparent;
	}

	.viljaQuote::-webkit-scrollbar-thumb {
		background-color: rgba(170, 170, 170, 0.3);
		border-radius: 3px;
		transition: background-color 0.2s ease;
	}

	.viljaQuote::-webkit-scrollbar-thumb:hover {
		background-color: rgba(170, 170, 170, 0.5);
	}

	.viljaQuote .content {
		display: block;
		text-align: justify;
		text-align-last: left;
		font-style: normal;
	}

	.viljaQuote .content :global(hr) {
		border: none;
		border-top: solid 0.5px var(--color-white);
		opacity: 0.3;
		margin: calc(var(--safeMargin) / 2) 0;
	}

	.viljaTitle {
		font-family: var(--vilja-font-rounded);
	}
</style>
