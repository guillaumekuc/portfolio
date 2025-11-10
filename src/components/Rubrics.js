export function Rubrics() {
  return `<div id="rubrics" class="rubrics fullPage">
	<div id="rBtn1" class="rubric" 
	style="background-image : url('/img/panorama1.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/blender48.png">
			<img src="/img/icons/maya48.png">
			<img src="/img/icons/3ds48.png">
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/3D.png">
		</div>
		<span class="label">3D & Animation</span>
	</div>

	<div id="rBtn2" class="rubric IllustrationrBtn" 
	style="background-image : url('/img/panorama2.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/photoshop48.png">
			<img src="/img/icons/tablet58.png">
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/painting.png">
		</div>
		<span class="label">Illustration</span>
	</div>

	<div id="rBtn3" class="rubric focus" 
	style="background-image : url('/img/panorama3.jpg');">
		<div class="softwareIcons navClues">
			<img src="/img/icons/leftArrow.png"></img>
			<span class='rubricEnter'>
				Enter
			</span>
			<img src="/img/icons/rightArrow.png"></img>
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/asterisk.png">
		</div>
		<span class="label">All</span>
	</div>
	<div id="rBtn4" class="rubric" 
	style="background-image : url('/img/panorama4.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/reaper48.png">
			<img src="/img/icons/guitar48.png">
			<img src="/img/icons/piano48.png">
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/music.png">
		</div>
		<span class="label">Music</span>
	</div>
	<div id="rBtn5" class="rubric" 
	style="background-image : url('/img/panorama5.jpg');">
		<div class='softwareIcons'>
			<img src="/img/icons/stext48.png">
			<img src="/img/icons/js48.png">
			<img src="/img/icons/css48.png">
			<img src="/img/icons/html48.png">
		</div>
		<div class="bigRubricLogo">
			<img src="/img/icons/code.png">
		</div>
		<span class="label">Web development</span>
	</div>

	<div class="rubricsMask"></div>
</div>`;
}

