<script>
	import HeaderLinks from './HeaderLinks.svelte';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';
	import { Navigation } from '../utils/navigation.js';

	const headerNavItems = [
		{ id: 'hnBtn3', target: 'folioAll', label: 'All', focused: 3 },
		{ id: 'hnBtn2', target: 'folio2D', label: 'Illustration', focused: 2 },
		{ id: 'hnBtn4', target: 'folioMusic', label: 'Music', focused: 4 },
		{ id: 'hnBtn1', target: 'folio3D', label: '3D', focused: 1 },
		{ id: 'hnBtn5', target: 'folioWeb', label: 'Web', focused: 5 }
	];

	// Extract the store for reactive access
	const rubricFocusedStore = stores.navigation.rubricFocused;
	$: rubricFocused = $rubricFocusedStore;

	function handleHeaderNavClick(target, focused) {
		stores.navigation.rubricFocused.set(focused);
		
		// Hide irrelevant folios
		const rubricClass = Navigation.getRubricClass(focused);
		Navigation.hideIrrelevantFolios(rubricClass);
		
		// Scroll to next visible folio
		const rubricsElement = document.querySelector('#rubrics');
		if (rubricsElement) {
			const next = DOM.nextVisibleSibling(rubricsElement);
			if (next) next.scrollIntoView();
		}
	}

	function handleTitleClick() {
		const splashscreen = document.querySelector('#splashscreen');
		if (splashscreen) splashscreen.scrollIntoView({ behavior: 'smooth' });
	}
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
		color : var(--shadeWhite);
		font-size: 1em;
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
		align-items: center;
		justify-content: left;
		color : var(--shade3);
		line-height: auto;
		user-select: none;
	}

	.headerNav button {
		color : var(--shade3);
		height: content;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font: inherit;
	}

	.headerNav button:hover {
		color : var(--shade4);
	}
	.headerNav button.focus {
		color : var(--shadeWhite);
	}
</style>

<div id="header" class="header">
	<div id="stickyHeader" class="stickyHeader">
		<HeaderLinks />
		<div id="headerBranding" class="headerBranding">
			<button type="button" class="headerTitle" on:click={handleTitleClick}>Guillaume Kuc</button>
			<span>&nbsp;—&nbsp;</span>
			<span class="headerSubTitle">Protean artist</span>
		</div>
		<div id="headerNav" class="headerNav">
			{#each headerNavItems as item, index}
				<button 
					type="button"
					id={item.id} 
					class={item.id}
					class:focus={rubricFocused === item.focused}
					on:click={() => handleHeaderNavClick(item.target, item.focused)}
				>
					{item.label}
				</button>
				{#if index < headerNavItems.length - 1}
					<span>&nbsp;·&nbsp;</span>
				{/if}
			{/each}
		</div>
	</div><!--#stickyHeader-->
</div><!--#header-->
