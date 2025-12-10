<div id="rotatePlease" class="rotatePlease">
	<div id="rotatePleaseContent" class="rotatePleaseContent">
		{#if isPortrait}
			<lottie-player
				class="rotateIcon"
				src="https://assets8.lottiefiles.com/private_files/lf30_uqnbeq1u.json"
				background="transparent"
				speed="1"
				loop
				autoplay
			></lottie-player>
		{/if}

		<h1>
			<span
				style="padding : 2px 10px; background-color : var(--shade2); border-radius : 5px ; font-variant:small-caps;"
				>Guillaume Kuc <span style="font-variant : normal	;">.art</span></span
			> is best displayed horizontally.
		</h1>
	</div>
	<!--#rotatePleaseContent-->
</div>
<!--#rotatePlease-->

<script>
	import { onMount } from 'svelte';

	let isPortrait = false;

	function checkOrientation() {
		isPortrait = window.matchMedia('(orientation: portrait)').matches;
		
		// Only load lottie-player script when in portrait mode
		if (isPortrait && !document.querySelector('script[src*="lottie-player"]')) {
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
			script.async = true;
			document.head.appendChild(script);
		}
	}

	onMount(() => {
		checkOrientation();
		const mediaQuery = window.matchMedia('(orientation: portrait)');
		mediaQuery.addEventListener('change', checkOrientation);
		
		return () => {
			mediaQuery.removeEventListener('change', checkOrientation);
		};
	});
</script>

<style>
	.rotatePlease {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		overflow: hidden;
	}

	.rotatePleaseContent {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 80%;
		width: 100%;
	}

	.rotatePleaseContent h1 {
		display: block;
		font-size: var(--fs1);
		padding-right: 10%;
		padding-left: 10%;
		height: content;
	}

	.rotateIcon {
		display: block;
		max-height: 300px;
		max-width: 300px;
		min-height: 0px;
		min-width: 0px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (orientation: portrait) {
		/* Hide all direct children of #app except #rotatePlease */
		:global(#app > *) {
			display: none !important;
		}

		/* Explicitly show #rotatePlease with higher specificity */
		:global(#app > #rotatePlease),
		.rotatePlease {
			display: flex !important;
			align-items: center;
			justify-content: center;
			background-color: var(--shade1);
			color: var(--shadeWhite);
			position: fixed !important;
			z-index: 9999 !important;
		}
	}
</style>
