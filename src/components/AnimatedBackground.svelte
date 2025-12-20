<script>
	import AnimatedBackgroundCharacterLayer from './AnimatedBackgroundCharacterLayer.svelte';

	// Layer configuration - enable/disable different background layers
	const layerConfig = {
		characterLayer: true
	};
</script>

<div class="animated-background">
	{#if layerConfig.characterLayer}
		<AnimatedBackgroundCharacterLayer />
	{/if}
</div>

<style>
	.animated-background {
		/* Color interface variables */
		--animated-bg-gradient-top: #1F1F1F;
		--animated-bg-background-tertiary: var(--color-background-tertiary);
		
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
		
		/* Subtle vertical gradient from lighter grey at top to footer color at bottom */
		/* Footer color: oklch(0.1776 0 0) ≈ #2D2D2D */
		/* Midpoint at 80% (20% from bottom) with smoother spread */
		background: linear-gradient(
			to bottom,
			var(--animated-bg-gradient-top) 0%,
			var(--animated-bg-gradient-top) 50%,
			var(--animated-bg-background-tertiary) 80%,
			var(--animated-bg-background-tertiary) 100%
		);
	}

</style>

