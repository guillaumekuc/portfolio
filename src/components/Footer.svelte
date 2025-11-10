<style>
	.footer {
		display : block;
		position : sticky;
		bottom :0;
		height : calc(2 * var(--safeMargin));
		width : 100%;
		color : white;
		background-color: var(--shade1);
		z-index: 2;
	}

	.stickyFooter {
		display: flex;
		align-items: center;
		justify-content: center;
		height : 100%;
	}

	.footer button {
		vertical-align: middle;
		padding : calc(var(--safeMargin) / 5);
		width : var(--safeMargin);
		height : var(--safeMargin);
		margin-top : auto;
		margin-bottom: auto;
		background-size : 80% !important;
		display : flex;
		align-items: center;
		justify-content: center;
	}

	.footer button img {
		height : 100%;
		width : 100%;
	}

	.footer button:hover {
		background-color: var(--shadePop);
		border-radius: 5px;
	}

	.footerSleekSlider {
		width : calc(var(--safeMargin) * 10);
		height : calc(var(--safeMargin) / 2);
	}
	.footerVolumeSlider {
		width : calc(var(--safeMargin) * 2);
	}

	.footerTime{
		font-family: var(--ff3);
		font-size: 75%;
	}

	.footerPlayBtn {
		background : no-repeat center url("img/icons/play_alt.png");
		background-size: 80%;
	}

	.footerPlayBtn.isPlaying {
		background : no-repeat center url("img/icons/pause.svg")!important;
		background-size: 80% !important;
	}

	.footerPlayBtn.isPlaying:hover {
		background-color : var(--shadePop)!important  ; 
	}

	.footerLoopBtn {
		background : no-repeat center url("img/icons/loop.png");
		background-size : 80%;
		opacity: 1;
	}

	.footerLoopBtn:hover{
		opacity : 1;
	}

	.footerLoopBtn.isLooping {
		opacity: 1 ;
		border-radius: 5px;
		background-color: var(--shade2);
	}

	.rSpacer {
		margin-right: calc(var(--safeMargin)/2);
	}

	.footerNextBtn.lastTrack {
		opacity : 20%;
		pointer-events: none;
	}

	.footerPreviousBtn.firstTrack {
		opacity : 20%;
		pointer-events: none;
	}
</style>

<div id="footer" class="footer">
	<div id="stickyFooter" class="stickyFooter">
			<button id="footerPreviousBtn" class="footerPreviousBtn"><img src="/img/icons/previous2.png" alt="Previous" /></button>
			<button id="footerPlayBtn" class="footerPlayBtn"></button>
			<button id="footerNextBtn" class="footerNextBtn rSpacer"><img src="/img/icons/next2.png" alt="Next" /></button>
			<input id="footerSleekSlider" class="footerSleekSlider rSpacer" value="0" type="range" />
			<span class="footerTime rSpacer"><span id="currentTime"></span> / <span id="duration"></span> </span>
			<button id="footerLoopBtn" class="footerLoopBtn rSpacer"></button>
			<button id="footerMuteBtn" class="muteBgMusic"></button>
			<input id="footerVolumeSlider" class="footerVolumeSlider" value="0" type="range" />
	</div>
</div><!--#footer-->
