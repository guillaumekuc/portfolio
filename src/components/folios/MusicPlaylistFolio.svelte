

<div class="musicPlaylistWrapper">
	<div id="musicPlaylistCover" class="musicPlaylistCover" style="position : relative; text-align: left; ">
		<div style="position : absolute; top : auto; left : var(--safeMargin); bottom : var(--safeMargin);">
			<div><i class="musicIcon">SPACE</i> : play/pause</div>		
			<div><i class="musicIcon">Q</i>, <i class="musicIcon">D</i> : previous/next track </div>
			<div><i class="musicIcon">S</i>, <i class="musicIcon">Z</i> : volume down/up</div>
			<div><i class="musicIcon">M</i> : mute, <i class="musicIcon">L</i> : loop</div>
		</div>
	</div>
	<div class="musicPlaylistRPanel">
		<div class="musicPlaylistTitle">— Jukebox —</div> <!--title-->
		<ul id="musicPlaylist" class="musicPlaylist" aria-label="Fragments">
			<li class="focus" data-sound="/sound/bgmusic.wav" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Background music #1</span></li>
			<li data-sound="/sound/bgmusic2.wav" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Background music #2</span></li>
			<li data-sound="/sound/MallowHazard.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Mallow Hazard</span></li>
			<li data-sound="/sound/Chris'Journey.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Chris' Journey</span></li>
			<li data-sound="/sound/ChillingVastitude.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Chilling Vastitude</span></li>
			<li data-sound="/sound/ChaoticIntruders.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Chaotic Intruders</span></li>
			<li data-sound="/sound/DistractingScent.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Distracting Scent</span></li>
			<li data-sound="/sound/FerventHorizon.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Fervent Horizon</span></li>
			<li data-sound="/sound/GalvanizingQuest.wav" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Galvanizing Quest</span></li>
			<li data-sound="/sound/InvigoratingFarm.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Invigorating Farm</span></li>
			<li data-sound="/sound/RecalcitrantWaterflow.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Recalcitrant Waterflow</span></li>
			<li data-sound="/sound/SpicyGallant.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Spicy Gallant</span></li>
			<li data-sound="/sound/UntroubledMorning.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Untroubled Morning</span></li>
			<li data-sound="/sound/Chris'Journey.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Chris' Journey</span></li>
			<li data-sound="/sound/StunnedChickens.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Stunned Chickens</span></li>
			<li data-sound="/sound/Meanwhile.mp3" data-image="/img/bgMusic.jpg">
				<i class="playIcon"></i><span>Meanwhile</span></li>
		</ul> <!--list-->
	</div>
</div> <!--musicPlaylistWrapper-->


<style>
	i.musicIcon {
		font-style: normal;
		display : inline-block;
		height : 1.5em;
		font-size: 1em;
		box-sizing: border-box;
		padding-left: 0.4em;
		padding-right: 0.4em;
		border : 1px solid var(--shadeWhite);
		border-radius: 5px;
		font-family : var(--ff3);
		text-transform: uppercase;
		vertical-align: middle;
		-webkit-filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
					drop-shadow(-1px 1px 0 var(--iconBorderColor))
					drop-shadow(1px -1px 0 var(--iconBorderColor))
					drop-shadow(-1px -1px 0 var(--iconBorderColor));
		filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor))
			drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));
	}

	.musicPlaylistWrapper {
		font-size : var(--fs2o3);
	}
	@media (max-height: 648px) { .musicPlaylistWrapper { font-size : var(--fs1o2); } }

	.musicPlaylistWrapper
	{
		display : flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		width : 100%;
		padding : 0;
		margin : 0;
	}

	.musicPlaylistCover {
		flex-shrink: 0;
		display : inline-block;
		width : calc( 2 * 100vw / 3);
		height : 66.66vh;
		max-height : calc(100vh - 4 * var(--safeMargin));
		background-color: var(--shade2  );
		border-radius: 0 15px 15px 0;
		background: no-repeat center / cover url('img/bgMusic.jpg');
	}

	.musicPlaylistRPanel {
		display : flex;
		flex-direction:column;
		flex-shrink: 1;
		width : 100%;
		height : 66.66vh;
		max-height : calc(100vh - 4 * var(--safeMargin));
		margin-left: var(--safeMargin);
		margin-right: var(--safeMargin);
	}

	.musicPlaylist {
		font-size: 100%;
		display : block;
		list-style-type: none;
		margin-top: 15px;
		overflow: auto;
		scrollbar-width: thin;  
	}

	.musicPlaylist::-webkit-scrollbar {
		width : 8px;
	}

	.musicPlaylistTitle {
		display : block;
		font-size: 150%;
		font-weight:bold;
		font-variant: small-caps ;
		height : max-content;
	}

	.playIcon {
		display: inline-block;
		background : url('img/icons/play_alt.png') center center no-repeat;
		background-size: 80%;
		vertical-align: middle;
		width : 1em;
		height : 1em;
		margin-right: calc(var(--safeMargin)/2);
	}

	.musicPlaylist li { 
		display : flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		cursor : pointer;
		margin-top: 0.25em;
		margin-bottom: 0.25em;
		text-align: left;
		line-height: 1;
		vertical-align: middle;
		border-radius: 5px;
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		padding-left: calc(var(--safeMargin) / 2 );
	}

	.musicPlaylist li span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.musicPlaylist li:hover {
		background-color: var(--shadePop);
	}

	.musicPlaylist li.focus {
		background-color: var(--shade2);
	}

	.musicPlaylist li.focus:hover {
		background-color: var(--shadePop);
	}

	.musicPlaylist li.focus .playIcon {
		background : url('img/icons/pause.svg') center center no-repeat;
	}
</style>