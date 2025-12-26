<div class="portfolioSectionWrapper">
	<div class="halfColumn">
		<img loading="lazy" src="/img/portfolio/guillaumekuc_P4cover.jpg" alt="P4 Cover" />
	</div>
	<div class="halfColumn P4bookQuote scrollable">
		<span class="title">All fourths tuning — <small>Improvisation</small></span>
		<blockquote>
			All fourths tuning is in many ways more of a standard tuning than Standard tuning is. Getting rid
			of the inconsistency between the G and B string makes the whole fretboard more logical. Using a
			regular tuning means that any chord, scale, or shape, can now be displaced along AND across
			strings while still retaining its sound. A same fingering will always produce the same interval.
			As a result, intuition develops faster on P4 tuning, and the mind-fingers connection happens
			quicker. P4 tuning is especially useful for improvisation. It opens up the fretboard both for
			single lines and chord improvisation. This book is my contribution to the internet knowledge
			library since resources are still few regarding the tuning.
		</blockquote>
		<a
			class="focus extLinkBtn"
			href="https://www.amazon.fr/All-fourths-tuning-Improvisation-English-ebook/dp/B07F89CW6V"
			><img loading="lazy" src="/img/nav/gotoURL.png" alt="Go to URL" /><span>More on Kindle</span></a
		>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { shortcuts } from '../../utils/shortcuts.js';

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

	.P4bookQuote blockquote {
		display: block;
		text-align: justify;
		text-align-last: left;
		font-size: 116.66%;
	}
</style>
