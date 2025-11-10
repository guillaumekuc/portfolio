<script>
	import Links from './Links.svelte';
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

	.splashLinks {
		z-index: 95; 
		position : absolute;
		display : flex;
		align-items: center;
		justify-content: left;
		padding-left: var(--safeMargin);
		height : var(--safeMargin);
	}

	.splashLinks a {
		height : calc( 4 * var(--safeMargin) / 5);
		width : calc( 4 * var(--safeMargin) / 5); 
		padding : calc(0.1 * var(--safeMargin));
		border-radius: 5px;
		opacity: 0;
		display : flex;
		align-items: center;
		justify-content: center;
	}

	.splashLinks a:hover {
		background-color : var(--shadePop);
	}

	.splashSound {
		z-index: 95;
		position : absolute;
		display : flex;
		align-items: center;
		justify-content: right;
		padding-right: var(--safeMargin);
		height : var(--safeMargin);
		right : 0 ;
	}

	.splashSound input[type="range"] {
		width : calc(1920px / 6 - 2 * var(--safeMargin));
		max-width : calc(100vw / 4 - 2 * var(--safeMargin));
		height : 2px;
		background: rgba(255, 255, 255, 0.5);
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

	#splashNavPositioner {
		position : absolute;
		display : block;  
		width : 100%;
		top : 0;
		left : 0;
		height : 100%;
	}

	#splashNavEmptySpace {
		display : block;
		position : relative;
		visibility: hidden;
		z-index : -100;
		height : 90%;
		max-height: calc(100% - 2 * var(--safeMargin));
	}

	.splashNavArea {
		display : flex;
		align-items: center;
		justify-content: center;
		position : relative;
		height : 10vh;
		width : 100%;
		min-height: calc(2 * var(--safeMargin));
		background-color: rgba(09, 09, 09, 0.90);
	}

	.splashNav {
		display : flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width : calc(100vw / 3);  
		min-width : 384px;
		height : 80%;
		z-index : 200;
	}

	@media (max-width : 768px){
		.splashNav {
			width : calc(100vw / 2);
			min-width: calc(100vw / 2)  ;
		}
	}
	.splashNav > a, .splashNav > span {
		position : relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		color : var(--shadeWhite);
		font-variant: small-caps;
		font-size: calc(var(--safeMargin)/2);
		opacity : 20%;
		pointer-events: none;
		user-select: none;  
	}

	#blogBtn { transition : opacity 1.5s ease-out 3.25s ; }
	#worksBtn { transition : opacity 1.5s ease-out 3s ; }
	#contactBtn { transition : opacity 1.5s ease-out 3.5s ; }

	.splashNav img {
		width : calc(1.2 * var(--safeMargin));
		height : calc(1.2 * var(--safeMargin));
	}

	@media (max-height : 432px)
	{
		.splashNav img {
			width : calc(0.9 * var(--safeMargin));
			height : calc(0.9 * var(--safeMargin));
		}
	}

	@media (max-height : 864px)
	{
		.splashNav img {
			width : calc(1.05 * var(--safeMargin));
			height : calc(1.05 * var(--safeMargin));
		}
	}

	.splashNav > a:hover {
		transition : none !important;
		opacity : 100%;
		cursor: pointer ;
	}
	.splashNav > a.fakeHoverEvent {
		opacity : 100% !important;
		transition : none !important;
	}

	.splashNav > a:hover img {
		background-color: var(--shadePop);
		border-radius: calc(4vh / 5);
		box-sizing: border-box;
		transform : scale(1.2);
		border : calc(4vh / 10) solid var(--shadePop);
	}

	.splashNav > a.focus img {
		background-color: var(--shadePop)!important;
		border-radius: calc(4vh / 5);
		box-sizing: border-box;
		transform : scale(1.2);
		border : calc(4vh / 10) solid var(--shadePop);
		transition :0s linear;  
	}

	.splashNav > a.fakeHoverEvent img {
		background-color: var(--shadePop); 
		border-radius: calc(4vh / 5);
		box-sizing: border-box;
		transform : scale(1.2);
		border : calc(4vh / 10) solid var(--shadePop);
	}

	#splashscreen .splashLinks .mailTooltip .tooltipText {
		top : 125%;
		left : 0;
	}

	#contactBtn .tooltipText {
		top : -25%;
		left : 50%;
		transform : translateX(-50%) translateY(-100%);
		font-variant: normal;
		font-family: var(--ff1);
		font-size : 90%;
	}
</style>

<div id="splashscreen" class="splashscreen fullPage snap">
	<div id="splashLinks" class="splashLinks">
		<Links />
	</div><!--splashLinks-->

	<div id="splashSound" class="splashSound">
		<input id="bgVolume" value="0" type="range" />
		<button id="muteBgMusic" class="muteBgMusic"></button>
	</div><!--splashSound-->

	<div id="splashBranding" class="splashBranding">
		<img class="splashLogo" alt="Logo" />
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

<div id="splashNavPositioner">

	<div id="splashNavEmptySpace"></div>
	<div id="splashNavArea" class="splashNavArea">
		<div id="splashNav" class="splashNav">
			<a id="blogBtn" href="http://guillaumekuc.blog" target="_blank">
			<img src="/img/icons/blog.svg" alt="Blog" />
			<span class="navLabel">Blog</span>
			</a>

			<span>·</span>

			<a id="worksBtn" on:click={() => document.querySelector('#rubrics')?.scrollIntoView()}>
			<img src="/img/icons/keydown2_w.svg" alt="Works" />
			<span class="navLabel">Works</span>
			</a>

			<span>·</span>

			<a id="contactBtn" class="mailTooltip" 
			target="_blank" 
			on:click|preventDefault={() => window.open('mailto:guillaume@guillaumekuc.com', 'mail')} 
			href="mailto:guillaume@guillaumekuc.com">
			<img src="/img/icons/contact_w.svg" alt="Contact" />
			<span class="navLabel">Contact</span>
			</a>

		</div><!--#splashNav-->
	</div><!--#splashNavArea-->
</div>
</div><!--#splashscreen-->
