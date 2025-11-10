export function Footer() {
  return /* html */ `<div id="footer" class="footer">
	<div id="stickyFooter" class="stickyFooter">
			<button id="footerPreviousBtn" class="footerPreviousBtn"><img src="/img/icons/previous2.png"></img></button>
			<button id="footerPlayBtn" class="footerPlayBtn"></button>
			<button id="footerNextBtn" class="footerNextBtn rSpacer"><img src="/img/icons/next2.png"></img></button>
			<input id="footerSleekSlider" class="footerSleekSlider rSpacer" value="0" type="range"></input>
			<span class="footerTime rSpacer"><span id="currentTime"></span> / <span id="duration"></span> </span>
			<button id="footerLoopBtn" class="footerLoopBtn rSpacer"></button>
			<button id="footerMuteBtn" class="muteBgMusic"></button>
			<input id="footerVolumeSlider" class="footerVolumeSlider" value="0" type="range"></input>
	</div>
</div><!--#footer-->`;
}

