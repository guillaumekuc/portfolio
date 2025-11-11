<div id="splashLinks" class="splashLinks">
	<Links />
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import Links from './Links.svelte';

	let linksContainer;

	function handleLinksAnimate() {
		if (linksContainer) {
			const links = linksContainer.querySelectorAll('a');
			let animStartTime = 0;
			links.forEach((link) => {
				link.style.transition = `opacity 1s ease-out ${animStartTime}s`;
				link.style.opacity = '1';
				animStartTime += 0.25;
			});
		}
	}

	onMount(() => {
		linksContainer = document.querySelector('.splashLinks');
		window.addEventListener('linksAnimate', handleLinksAnimate);
	});

	onDestroy(() => {
		window.removeEventListener('linksAnimate', handleLinksAnimate);
	});
</script>

<style>
	.splashLinks {
		z-index: 95;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: left;
		padding-left: var(--safeMargin);
		height: var(--safeMargin);
		gap: calc(var(--safeMargin) / 4);
	}

	.splashLinks :global(a) {
		height: calc(4 * var(--safeMargin) / 5);
		width: calc(4 * var(--safeMargin) / 5);
		min-width: calc(4 * var(--safeMargin) / 5);
		min-height: calc(4 * var(--safeMargin) / 5);
		max-width: calc(4 * var(--safeMargin) / 5);
		max-height: calc(4 * var(--safeMargin) / 5);
		padding: calc(0.1 * var(--safeMargin));
		border-radius: 5px;
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-sizing: border-box;
		overflow: hidden;
	}

	.splashLinks :global(a[style*='pointer-events']) {
		width: auto;
		min-width: auto;
		height: auto;
		min-height: auto;
		max-width: none;
		max-height: none;
		padding: 0;
		opacity: 0.3;
	}

	.splashLinks :global(a:hover) {
		background-color: var(--shadePop);
	}

	.splashLinks :global(a img) {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		display: block;
		flex-shrink: 0;
	}
</style>
