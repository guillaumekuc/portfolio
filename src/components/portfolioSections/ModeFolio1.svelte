<div class="gallery">
	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/anim/guillaumekuc_encyclo2cover.jpg">
			<source src="/vid/anim/guillaumekuc_encyclo2_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/anim/guillaumekuc_encyclo5cover.jpg">
			<source src="/vid/anim/guillaumekuc_encyclo5_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/anim/guillaumekuc_encyclo1cover.jpg">
			<source src="/vid/anim/guillaumekuc_encyclo1_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/mode/guillaumekuc_guitar2Cover.jpg">
			<source src="/vid/mode/guillaumekuc_guitar2_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video
			preload="none"
			loop
			muted
			on:click={handleVideoClick}
			poster="/vid/mode/guillaumekuc_musicroomCover.jpg"
		>
			<source src="/vid/mode/guillaumekuc_musicroom_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/mode/guillaumekuc_DanturnCover.jpg">
			<source src="/vid/mode/guillaumekuc_Danturn_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/mode/guillaumekuc_robotCover.jpg">
			<source src="/vid/mode/guillaumekuc_robot_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/mode/guillaumekuc_cubeCover.jpg">
			<source src="/vid/mode/guillaumekuc_cube_XLQ.mp4" type="video/mp4" />
		</video>
	</div>

	<div>
		<video preload="none" loop muted on:click={handleVideoClick} poster="/vid/anim/guillaumekuc_encyclo4cover.jpg">
			<source src="/vid/anim/guillaumekuc_encyclo4_XLQ.mp4" type="video/mp4" />
		</video>
	</div>
</div>

<script>
	function handleVideoClick(event) {
		event.currentTarget.play();
	}
</script>
