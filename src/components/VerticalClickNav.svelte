<style>
	.topArrow {
		position : fixed;
		top : calc(2 * var(--safeMargin) + 2px);
		left : calc((100% - 17px)/2);
		transform: translateX(-50%);
		z-index: 100;
		color:  var(--shadeWhite);
		background-color: var(--shade1);
		width : 4vh;
		min-width : 25px;
		height : 4vh;
		min-height: 25px;
		box-sizing: content-box;
		border : 7.5px solid var(--shade1);
		border-radius: 7.5px;
	}

	.bottomArrow {
		position : fixed;
		bottom : calc(2 * var(--safeMargin) + 2px);
		left : calc((100% - 17px) / 2);
		transform: translateX(-50%);
		z-index: 100;
		color:  var(--shadeWhite);
		background-color: var(--shade1);
		width : 4vh;
		min-width : 25px;
		height : 4vh;
		min-height: 25px;
		box-sizing: content-box;
		border : 7.5px solid var(--shade1);
		border-radius: 7.5px;
		margin-bottom: 2px;
	}

	.topArrow:hover {
		cursor: pointer;
		background-color: var(--shadePop);
		border : 7.5px solid var(--shadePop);
	}

	.bottomArrow:hover{  
		cursor: pointer;
		background-color: var(--shadePop);
		border : 7.5px solid var(--shadePop);
	}
</style>

<div id="topArrow" class="topArrow hidden"><img src="/img/icons/upArrow.png" alt="Up arrow" /></div>
<div id="bottomArrow" class="bottomArrow hidden"><img src="/img/icons/downArrow.png" alt="Down arrow" /></div>

