<script>
	import { onMount } from 'svelte';
	import { stores } from '../../stores.js';

	let websiteLinks = [];

	onMount(() => {
		websiteLinks = Array.from(document.querySelectorAll('.websiteLink'));
		
		// Handle hover
		websiteLinks.forEach((link, index) => {
			link.addEventListener('mousemove', () => {
				websiteLinks.forEach(l => l.classList.remove('focus'));
				link.classList.add('focus');
				stores.navigation.websitesCurrentIndex.set(index);
			});
			
			link.addEventListener('mouseout', () => {
				websiteLinks.forEach(l => l.classList.remove('focus'));
			});
		});
	});
</script>

<style>
	.websiteLink {
		display : inline-block;
		width : 90%;
		text-align: center;
		transition: transform 0.25s ease-out, color 0.25s ease-out;
		color : var(--shadeWhite);
	}

	.websiteLink:global(.focus) {
		transform : scale(1.05);
	}

	.websiteLink .screenshot{
		border: 1px solid var(--shade2);
		border-radius: 15px;
		transition: transform 0.25s ease-out, border 0.25s ease-out;
	}

	.websiteLink:global(.focus) .screenshot {
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
