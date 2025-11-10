<style>
	#about {
		font-size: var(--fs2o3);
	}
	@media (max-height : 648px) {
		#about {
			font-size: var(--fs1o2);
		}
		#myPic img {
			height : 3em !important;
			width : 3em !important;
		}
	}

	.aboutme {
		display : flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#aboutTop {
		height : calc(100% * 4 / 5);
		display : flex;
		flex-direction : column;
		align-items: center;
		justify-content: center;
	}

	#aboutBottom {
		display : flex;
		flex-direction : column;
		align-items: center;
		justify-content: center;
		height : 100%;
	}
	#myPic img {
		height : 5em;
		width : 5em;
		border-radius : 50%;
		margin-bottom: 0.25em;
	}
	#myHello {
		font-size: 125%;
		margin-bottom: 0.25em;
	}

	#myDescription {
		width : 40%;
		height : 100%;
		font-size : 100%;
		overflow-y: auto;
		scrollbar-width : thin;
		padding-left : calc(var(--safeMargin) / 2);
		padding-right : calc(var(--safeMargin) / 2);
	}

	#myDescription::-webkit-scrollbar {
		width : 8px;
	}

	@media (max-width: 1152px) {
		#myDescription {
			width : 60%;
		}
	}

	#myDescription span {
		display : block;
		margin-bottom: 1em;
	}

	#myDescription strong {
		font-variant: small-caps;
		background-color: var(--shade3);
		padding : 2px 5px;
		border-radius: 5px;
	}

	#myDescription i {
		color : var(--shade4);
	}

	#myDescription a {
		background-color: var(--shade3);
		color : var(--shadeWhite);
		padding : 2px 5px;
		border-radius: 5px;
	}

	#myDescription a:hover {
		background-color: var(--shadePop);
	}

	.sCaps {
		font-variant: small-caps;
	}

	.myMail {
		position: relative;
		margin-top: calc(var(--safeMargin)/3);
		display : flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		padding : 2px 10px;
		color : var(--shade3);
	}

	#copyright {
		font-size: 80%;
		color : var(--shade3);
	}

	.myMail .tooltipText {
		top : 125%;
		left : 50%;
		transform : translateX(-50%);
	}

	.myMail:hover {
		cursor : pointer;
		color : var(--shadeWhite);  
		background-color: var(--shadePop);
	}

	#backToTop { 
		display : flex;
		align-items: center;
		justify-content: center;
		background-color : var(--shade3);
		border-radius: 15px;
		margin-bottom : calc(var(--safeMargin) / 3);
		height : 6.66vh;
		width : 6.66vh;
	}

	#backToTop img {
		height : 100%;
		width : auto;
	}
	#backToTop:hover {
		background-color : var(--shadeWhite);
	}

	#backToTop.fakeHoverEvent {
		background-color : var(--shadeWhite);
	}
</style>

<div id="about" class="fullPage aboutme">
	<div class="vertWrapper">
		<div id="aboutTop" style="">
			<div id="myPic"><img src="/img/profilePic.jpg" alt="Profile" /></div>
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
			<a class="myMail" target="_blank" on:click|preventDefault={() => window.open('mailto:guillaume@guillaumekuc.com', 'mail')} href="mailto:guillaume@guillaumekuc.com">guillaume[at]guillaumekuc.com</a>
		</div>
		<div id="aboutBottom">	
			<a id="backToTop" on:click={() => document.querySelector('#splashscreen')?.scrollIntoView()}>
				<img src="/img/icons/backToTop2.png" alt="Back to top" />
			</a>
			<div id="copyright"><span style="font-variant : small-caps;">Guillaume Kuc</span> .art — ©2022 Guillaume Kuc</div>
		</div><!--aboutBottom-->
	</div><!--foliowrap-->
</div>
