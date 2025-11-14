<div class="nav-icon" style="--icon-url: url('{iconPath}')"></div>

<script>
	export let iconPath = '';
</script>

<style>
	.nav-icon {
		width: 32px;
		height: 32px;
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

