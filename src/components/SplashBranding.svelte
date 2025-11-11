<div id="splashBranding" class="splashBranding">
	<h1 id="splashTitle" class="splashTitle">Guillaume Kuc</h1>
	<h2 id="splashSubTitle" class="splashSubTitle">— Protean artist —</h2>
	<h2 id="splashDescription" class="splashDescription">
		<small><i>...because some people just can't choose</i> 😅</small>
	</h2>
	<h2 id="splashDomains" class="splashDomains">Illustration · Music · 3D · Web</h2>
</div>

<style>
	.splashBranding {
		position: absolute;
		z-index: 95;
		right: 0;
		bottom: 10vh;
		color: var(--shadeWhite);
		--contourColor: rgba(0, 0, 0, 0.2);
		text-shadow:
			1px 0 var(--contourColor),
			0 1px var(--contourColor),
			-1px 0 var(--contourColor),
			0 -1px var(--contourColor),
			-1px -1px var(--contourColor),
			-1px 1px var(--contourColor),
			1px -1px var(--contourColor),
			1px 1px var(--contourColor);
		text-align: right;
		line-height: 0;
		padding-right: var(--safeMargin);
		padding-bottom: calc(var(--safeMargin) / 2.5);
	}

	.splashTitle {
		opacity: 0;
		font-size: 100%;
		font-family: var(--ff1);
		font-weight: 400;
		font-variant: small-caps;
		vertical-align: top;
		margin: 0;
		transition: opacity 1s ease-out 3s;
	}

	.splashSubTitle {
		opacity: 0;
		font-size: 66.66%;
		line-height: 1;
		margin: 0;
		transition: opacity 1s ease-out 3.25s;
	}

	.splashDescription {
		opacity: 0;
		font-size: 66.66%;
		margin: 0;
		line-height: 1;
		transition: opacity 1s ease-out 3.5s;
	}

	.splashDomains {
		opacity: 0;
		line-height: 1.5;
		font-size: 66.66%;
		transition: opacity 1s ease-out 3.75s;
		margin-bottom: 0;
	}
</style>

