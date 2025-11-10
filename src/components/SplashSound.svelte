<style>
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
</style>

<div id="splashSound" class="splashSound">
	<input id="bgVolume" value="0" type="range" />
	<button id="muteBgMusic" class="muteBgMusic"></button>
</div>

