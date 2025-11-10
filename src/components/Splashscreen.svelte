<script>
	import SplashLinks from './SplashLinks.svelte';
	import SplashSound from './SplashSound.svelte';
	import SplashNav from './SplashNav.svelte';
</script>

<style>
	#splashscreen {
		font-size : var(--fs1);
	}
	@media (max-height: 648px) {
		#splashscreen{ font-size: var(--fs4o5); }
	}

	.splashscreen {
		position : relative;  
		z-index: 90;
	}

	.splashscreen button {
		width : calc(4 / 5 * var(--safeMargin));
		height : calc(4 / 5 * var(--safeMargin));
		padding : calc(0.1 * var(--safeMargin));
		border-radius : 5px;
		border : 0px ;
		background-color: transparent;
	}

	.splashscreen button:hover {
		background-color: var(--shadePop);
	}

	.splashArtArea {
		position : relative;
		height : 100vh;
		width : 100%;
	}

	.splashArt {
		margin: auto;
		position: relative;
		padding: auto;
		width : 100%;
		height : 100%;
		transform: scale(1.1);
		background: center no-repeat url("img/oldbg.jpg");
		background-size: cover;
		transition : 3s ease-out;
	}

	.splashArtShader {
		position : absolute;
		background: rgba(0, 0, 0, 0) linear-gradient(to bottom, rgba(0	, 0, 0, 0) 10%, rgba(0, 0, 0, .05) 40%, rgba(0, 0, 0, .25) 75%, rgba(0, 0, 0, 0.5) 100%) repeat scroll 0 0;
		bottom : 0;
		height: 200px;
		width : 100%;
		opacity : 0;
	}



	.splashBranding {
		position : absolute ;
		z-index: 95;
		right : 0;
		bottom : 10vh;
		color : var(--shadeWhite);
		--contourColor : rgba(0, 0, 0, 0.2  );
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
		padding-bottom : calc(var(--safeMargin) / 2.5);
	}

	.splashTitle {
		opacity : 0;
		font-size: 100%;
		font-family: var(--ff1);  
		font-weight: 400;
		font-variant: small-caps;
		vertical-align: top;
		margin: 0;
		transition: opacity 1s ease-out 3s;
	}

	.splashSubTitle{
		opacity : 0;
		font-size : 66.66%;
		line-height: 1;
		margin : 0;
		transition: opacity 1s ease-out 3.25s;
	}

	.splashDescription {
		opacity : 0;
		font-size : 66.66%;
		margin: 0;
		line-height: 1;
		transition: opacity 1s ease-out 3.5s;
	}

	.splashDomains {
		opacity : 0;
		line-height : 1.5;
		font-size : 66.66%;
		transition: opacity 1s ease-out 3.75s ;
		margin-bottom: 0;
	}

	#splashscreen .splashLinks .mailTooltip .tooltipText {
		top : 125%;
		left : 0;
	}
</style>

<div id="splashscreen" class="splashscreen fullPage snap">
	<SplashLinks />
	<SplashSound />

	<div id="splashBranding" class="splashBranding">
		<h1 id="splashTitle" class="splashTitle">
		Guillaume Kuc
		</h1>
		<h2 id="splashSubTitle" class="splashSubTitle">
		— Protean artist —
		</h2>
		<h2 id="splashDescription" class="splashDescription">
		<small><i>...because some people just can't choose</i> 😅</small>
		</h2>
		<h2 id="splashDomains" class="splashDomains">
		Illustration · Music · 3D · Web
		</h2>
	</div><!--#splashBranding-->

<div id="splashArtArea" class="splashArtArea">
	<div id="splashArt" class="splashArt zoomIn">
		<audio id="bgMusic" src="/sound/bgmusic.wav" loop type="audio/mpeg"></audio>

		<div id="splashArtShader" class="splashArtShader">
		</div><!--#splashArtShader-->
	</div><!--#splashArt-->
</div><!--splashArtArea-->

<SplashNav />
</div><!--#splashscreen-->
