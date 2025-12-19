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
			#1F1F1F 0%,
			#1F1F1F 50%,
			oklch(0.1776 0 0) 80%,
			oklch(0.1776 0 0) 100%
		);
	}

</style>

