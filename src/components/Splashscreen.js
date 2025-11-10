import { Links } from './Links.js';

export function Splashscreen() {
  return /* html */ `<div id="splashscreen" class="splashscreen fullPage snap">
	<div id="splashLinks" class="splashLinks">
		${Links()}
	</div><!--splashLinks-->

	<div id="splashSound" class="splashSound">
		<input id="bgVolume" value="0" type="range"></input>
		<button id="muteBgMusic" class="muteBgMusic"></button>
	</div><!--splashSound-->

	<div id="splashBranding" class="splashBranding">
		<img class="splashLogo">
		</img>
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
			<img src="/img/icons/blog.svg"></img>
			<span class="navLabel">Blog</span>
			</a>

			<span>·</span>

			<a id="worksBtn" onclick="document.querySelector('#rubrics').scrollIntoView();">
			<img src="/img/icons/keydown2_w.svg"></img>
			<span class="navLabel">Works</span>
			</a>

			<span>·</span>

			<a id="contactBtn" class="mailTooltip" 
			target="_blank" 
			onClick="javascript:window.open('mailto:guillaume@guillaumekuc.com', 'mail'); event.preventDefault()" 
			href="mailto:'guillaume@guillaumekuc.com'">
			<img src="/img/icons/contact_w.svg"></img>
			<span class="navLabel">Contact</span>
			</a>

		</div><!--#splashNav-->
	</div><!--#splashNavArea-->
</div>
</div><!--#splashscreen-->`;
}

