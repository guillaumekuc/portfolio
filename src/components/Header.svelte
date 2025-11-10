<script>
	import Links from './Links.svelte';
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

	.headerLinks {
		position : absolute;
		top : 0;
		height : var(--safeMargin);
		width: 100%;
		display : flex;
		align-items: center;
		justify-content: right;
		padding-right: var(--safeMargin);
	}
	.headerLinks a {
		height : calc( 4 * var(--safeMargin) / 5);
		width : calc( 4 * var(--safeMargin) / 5); 
		padding : calc(0.1 * var(--safeMargin));
		border-radius: 5px;
		opacity: 100;
		display : flex;
		align-items: center;
		justify-content: center;
	}
	.headerLinks a:hover {
		background-color : var(--shadePop);
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
		<div id="headerLinks" class="headerLinks">
			<Links />
		</div>
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
