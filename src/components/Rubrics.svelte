<style>
	.rubrics {  font-size: var(--fs2o3); }
	@media (max-height: 432px) { .rubrics { font-size: var(--fs1o2); } }

	.rubrics {
		position: relative;
		display : flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.rubric {
		position: relative;
		z-index : 70;
		width : 20%;
		height : 80%;
		max-height: calc(100% - 4 * var(--safeMargin));
		overflow: hidden;
		background-position : center;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: scroll; 
		border-radius: 15px;
		margin : 4px;
		user-select: none;
	}

	.bigRubricLogo {
		position : absolute;
		top : 50%;
		left : 50%;
		transform: translate(-50%, -50%);
		display : block;
		opacity: 0%;
		z-index : 101;
		pointer-events: none;
	}

	.rubric.focus .bigRubricLogo {
		display : block;
		opacity: 100%;
	}

	.rubric .label {
		display : block;
		text-align: center;
		height : 100%;
		margin : auto;
		padding-top : 60vh;
		color : var(--shadeWhite);
		font-size: 100%;
		font-family: var(--ff2);
		font-variant: small-caps;
		transition : background-color 0.25s ease-in;
	}

	.rubric:after {
		content: '\A';
		position: absolute;
		width: 100%; 
		height:100%;
		top:0; 
		left:0;
		background:rgba(0,0,0,0.60);
		z-index : -1;
		opacity: 1;
	}
	.rubric.focus:after {
		opacity: 0;
	}

	.rubric .label:hover {
		cursor : pointer;
	}

	.rubric.focus .label {
		transition : none;
	}

	.rubric.focus .label::after {
		content : " —";
	}
	.rubric.focus .label::before {
		content : "— ";
	}

	.softwareIcons {
		position: absolute;
		display : none;
		top : 0;
		left : 0;
		width : 100%;
		display : visible;
		margin-top : calc(var(--safeMargin) / 2);
		margin-bottom : calc(var(--safeMargin) / 2);
	}

	.softwareIcons img {
		-webkit-filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
					drop-shadow(-1px 1px 0 var(--iconBorderColor))
					drop-shadow(1px -1px 0 var(--iconBorderColor))
					drop-shadow(-1px -1px 0 var(--iconBorderColor));

		filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor))
			drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));
		height : 1.5em;
		width : 1.5em;
		vertical-align: middle;
	}

	.rubric.focus .softwareIcons{
		display : block;
		z-index: 101;
	}

	.rubricEnter {
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
</style>

<div id="rubrics" class="rubrics fullPage">
	<div id="rBtn1" class="rubric" 
	style="background-image : url('/img/panorama1.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/blender48.png" alt="Blender" />
			<img src="/img/icons/maya48.png" alt="Maya" />
			<img src="/img/icons/3ds48.png" alt="3ds Max" />
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/3D.png" alt="3D" />
		</div>
		<span class="label">3D & Animation</span>
	</div>

	<div id="rBtn2" class="rubric IllustrationrBtn" 
	style="background-image : url('/img/panorama2.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/photoshop48.png" alt="Photoshop" />
			<img src="/img/icons/tablet58.png" alt="Tablet" />
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/painting.png" alt="Painting" />
		</div>
		<span class="label">Illustration</span>
	</div>

	<div id="rBtn3" class="rubric focus" 
	style="background-image : url('/img/panorama3.jpg');">
		<div class="softwareIcons navClues">
			<img src="/img/icons/leftArrow.png" alt="Left arrow" />
			<span class='rubricEnter'>
				Enter
			</span>
			<img src="/img/icons/rightArrow.png" alt="Right arrow" />
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/asterisk.png" alt="All" />
		</div>
		<span class="label">All</span>
	</div>
	<div id="rBtn4" class="rubric" 
	style="background-image : url('/img/panorama4.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/reaper48.png" alt="Reaper" />
			<img src="/img/icons/guitar48.png" alt="Guitar" />
			<img src="/img/icons/piano48.png" alt="Piano" />
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/music.png" alt="Music" />
		</div>
		<span class="label">Music</span>
	</div>
	<div id="rBtn5" class="rubric" 
	style="background-image : url('/img/panorama5.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/stext48.png" alt="Text" />
			<img src="/img/icons/js48.png" alt="JavaScript" />
			<img src="/img/icons/css48.png" alt="CSS" />
			<img src="/img/icons/html48.png" alt="HTML" />
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/code.png" alt="Code" />
		</div>
		<span class="label">Web development</span>
	</div>

	<div class="rubricsMask"></div>
</div>
