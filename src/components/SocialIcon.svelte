<div class="social-icon" style="--icon-url: url('{iconPath}')"></div>

<script>
	export let iconPath = '';
</script>

<style>
	.social-icon {
		width: 100%;
		height: 100%;
		background-color: currentColor;
		mask-image: var(--icon-url);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
	}
</style>

