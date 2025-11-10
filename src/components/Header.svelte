<script>
	import { onMount } from 'svelte';
	import HeaderLinks from './HeaderLinks.svelte';
	import { rubricFocused } from '../stores.js';
	import { DOM } from '../utils/dom.js';
	import { Navigation } from '../utils/navigation.js';

	function sortHeaderNav(event) {
		const target = event.currentTarget.getAttribute('data-target');
		document.querySelectorAll('.folio:not(.' + target + ')').forEach(folio => folio.classList.add('hidden'));
		document.querySelectorAll('.' + target).forEach(folio => folio.classList.remove('hidden'));
		document.querySelectorAll(".headerNav a").forEach(link => link.classList.remove('focus'));
		event.currentTarget.classList.add('focus');
		
		let focused = 3;
		if (target === "folio3D") focused = 1;
		if (target === "folio2D") focused = 2;
		if (target === "folioAll") focused = 3;
		if (target === "folioMusic") focused = 4;
		if (target === "folioWeb") focused = 5;
		
		rubricFocused.set(focused);
		const idToFocus = '#rBtn' + focused;
		document.querySelectorAll('.rubric').forEach(rubric => rubric.classList.remove('focus'));
		const rubricElement = document.querySelector(idToFocus);
		if (rubricElement) rubricElement.classList.add('focus');
		
		// Hide irrelevant folios
		const rubricClass = Navigation.getRubricClass(focused);
		Navigation.hideIrrelevantFolios(rubricClass);
		
		const next = DOM.nextVisibleSibling(document.querySelector('#rubrics'));
		if (next) next.scrollIntoView();
	}

	onMount(() => {
		const headerNavLinks = document.querySelectorAll('#headerNav a');
		headerNavLinks.forEach(link => {
			link.addEventListener('click', sortHeaderNav);
		});
	});
</script>

<style>
	.header { font-size: var(--fs2o3); }
	@media (max-height : 648px){ .header { font-size: var(--fs1o2); } }
	@media (max-height : 432px){ .header { font-size: var(--fs1o2); } }

	.header {
		display : block;
		position : sticky;
		top :0;
		height : calc(2 * var(--safeMargin));
		width : 100%;
		color : white;
		background-color: var(--shade1);
		z-index: 85;
	}


	.headerBranding {
		position: absolute;
		top : 0;
		height : var(--safeMargin);
		padding-left: var(--safeMargin);
		display : flex;
		align-items: center;
		justify-content: left;
	}

	.headerTitle {
		font-variant: small-caps;
		color : var(--shadeWhite);
	}

	.headerTitle:hover{
		cursor : pointer;
		color : var(--shadeWhite);
	}

	.headerNav {
		position : absolute;
		top : var(--safeMargin);
		width : 100%;
		height : var(--safeMargin);
		padding-left: var(--safeMargin);
		padding-right : var(--safeMargin);
		display : flex;
		align-items: top;
		justify-content: left;
		color : var(--shade3);
		line-height: auto;
		user-select: none;
	}

	.headerNav a {
		color : var(--shade3);
		height: content;
	}

	.headerNav a:hover {
		color : var(--shade4);
	}
	.headerNav a.focus {
		color : var(--shadeWhite);
	}

	.headerLinks  .tooltipText {
		top : 125%;
		left : 50%;
		transform : translateX(-50%);
	}
</style>

<div id="header" class="header">
	<div id="stickyHeader" class="stickyHeader">
		<HeaderLinks />
		<div id="headerBranding" class="headerBranding">
			<a class="headerTitle" on:click={() => document.querySelector('#splashscreen')?.scrollIntoView()}>Guillaume Kuc</a>
			<span>&nbsp;—&nbsp;</span>
			<span class="headerSubTitle">Protean artist</span>
		</div>
		<div id="headerNav" class="headerNav">
			<a id="hnBtn3" class="hnBtn3" data-target="folioAll">All</a>
			<span>&nbsp;·&nbsp;</span>
			<a id="hnBtn2" class="hnBtn2" data-target="folio2D">Illustration</a>
			<span>&nbsp;·&nbsp;</span>
			<a id="hnBtn4" class="hnBtn4" data-target="folioMusic">Music</a>
			<span>&nbsp;·&nbsp;</span>
			<a id="hnBtn1" class="hnBtn1" data-target="folio3D">3D</a>
			<span>&nbsp;·&nbsp;</span>
			<a id="hnBtn5" class="hnBtn5" data-target="folioWeb">Web</a>

		</div>
	</div><!--#stickyHeader-->
</div><!--#header-->
