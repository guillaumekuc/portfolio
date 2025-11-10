<script>
	import Links from './Links.svelte';
</script>

<style>
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

	.headerLinks :global(a) {
		height : calc( 4 * var(--safeMargin) / 5);
		width : calc( 4 * var(--safeMargin) / 5); 
		padding : calc(0.1 * var(--safeMargin));
		border-radius: 5px;
		opacity: 1;
		display : flex;
		align-items: center;
		justify-content: center;
	}

	.headerLinks :global(a:hover) {
		background-color : var(--shadePop);
	}

	.headerLinks :global(a img) {
		width : 100%;
		height : 100%;
		object-fit: contain;
		display: block;
	}
</style>

<div id="headerLinks" class="headerLinks">
	<Links />
</div>

