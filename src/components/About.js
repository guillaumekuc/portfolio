export function About() {
  return /* html */ `<div id="about" class="fullPage aboutme">
	<div class="vertWrapper">
		<div id="aboutTop" style="">
			<div id="myPic"><img src="/img/profilePic.jpg"></div>
			<div style="color : grey;">Protean, <small>adjective</small> :  
				<li style="list-style: none;">
					<ul><small>1. </small>Tending or able to change frequently or easily.</ul>
					<ul><small>2. </small>Able to do many different things; versatile.</ul><br>
			</div>
			
			<div id="myDescription" class="scrollThis">
				<div id="myHello">Bonjour !</div>
				<span>I am currently employed as a 2D/3D graphic designer <a href="https://visioglobe.com/">@visioglobe</a> and am also open for any kind of comissions that I would be suited for, which ranges from <strong>Illustration</strong> <i>[concept-art, book covers, game-art]</i>, to <strong>Music</strong> <i>[score writing, guitar recording, sound design]</i>, covering <strong>Web-development</strong><i>[showcase sites, blogs, design]</i> and <strong>3D animation</strong>.</span>

				<span>At the old age of 27, I've consumed the last decade or so ballooning my chops up to this point with a bad habit of branching my skills out in all directions that I found interesting. Turns out, there are stupendous amounts of mesmerizing material desperate to be learned all over ! <small>I couldn't resist.</small></span>

				<span>I have riddled out by now that I am a wiz' at spreading wide, for better or for worse. The way I see it, Arts are languages and each serves the same vocation : keenly felt communication. Thus, I am plotting to fuse my know-hows into a single voice that will undoubtedly be uniquely mine. <small>Long road ahead, I would concur</small><small>.</small></span>

				<span>In the meantime, it is also my desire to spend some spare time <strong>teaching</strong>, which is why I ushered the <a href="http://www.guillaumekuc.blog">.blog website</a>. I found didactics to be an excellent way to solidify one's learning all the while helping out a few folks on their own art pilgrimages.</span>

				<span>Oh. And I am a french guy born in Valence, whose schooling took place in Paris at école Estienne and who is currently based in Grenoble. <small>In case you wondered.</small></span>

				<span>À la revoyure !</span>
			</div><!--#description-->
			<a class="myMail" target="_blank" onClick="javascript:window.open('mailto:guillaume@guillaumekuc.com', 'mail'); event.preventDefault()" href="mailto:'guillaume@guillaumekuc.com'">guillaume[at]guillaumekuc.com</a>
		</div>
		<div id="aboutBottom">	
			<a id="backToTop" onclick="document.querySelector('#splashscreen').scrollIntoView();">
				<img src="/img/icons/backToTop2.png">
			</a>
			<div id="copyright"><span style="font-variant : small-caps;">Guillaume Kuc</span> .art — ©2022 Guillaume Kuc</div>
		</div><!--aboutBottom-->
	</div><!--foliowrap-->
</div>`;
}

