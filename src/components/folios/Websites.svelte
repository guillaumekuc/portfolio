<style>
	.folioWeb .siteLabel {
		background-color: var(--shade2);
		border-radius: 5px;
		vertical-align: middle;
	}

	.folioWeb .websiteLink {
		display : inline-block;
		width : 90%;
		text-align: center;
		transition: 0.25s ease-out;
		color : var(--shadeWhite);
	}

	.folioWeb .websiteLink.focus {
		transform : scale(1.05);
	}

	.folioWeb .websiteLink .screenshot{
		border: 1px solid var(--shade2);
		border-radius: 15px;
	}

	.folioWeb .websiteLink.focus .screenshot{
		border: 2px solid var(--shadeWhite);
	}

	.redirection {
		width : 32px;
		height : 32px;
		border : none ;
		border-radius: 0px ;
		vertical-align: middle;
		margin-right: calc(var(--safeMargin) / 2);
	}
</style>

<div class="twoPanes">
	<div class="siteLeft">
		<a class="websiteLink" href="http://localhost/guillaumekuc/guillaumekuc.art" target="_blank">
			<img class="screenshot" src="/img/gkartscreenshot.png" alt="GK Art Screenshot" />
			<img src="/img/icons/gotoURL.png" class="redirection" alt="Go to URL" />
			<span style="font-variant : small-caps;">Guillaume Kuc</span><span> .art</span>
		</a>
		
	</div>
	<div class="siteRight rightPane">
		<a class="websiteLink" href="http://localhost/guillaumekuc/guillaumekuc.blog" target="_blank"><img class="screenshot" src="/img/gkblogscreenshot.png" alt="GK Blog Screenshot" />
		<img src="/img/icons/gotoURL.png" class="redirection" alt="Go to URL" /><span style="font-variant : small-caps;">Guillaume Kuc</span><span> .blog</span></a>
	</div>
</div>
