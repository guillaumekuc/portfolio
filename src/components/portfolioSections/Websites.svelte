<div class="twoPanes">
	<div class="siteLeft">
		<a
			class="websiteLink"
			class:focus={websitesCurrentIndex === 0}
			href={websites[0].href}
			target="_blank"
			on:mousemove={() => handleMouseMove(0)}
		>
			<img loading="lazy" class="screenshot" src={websites[0].screenshot} alt={websites[0].screenshotAlt} />
			<img loading="lazy" src="/img/nav/gotoURL.png" class="redirection" alt="Go to URL" />
			<span style="font-variant : small-caps;">{websites[0].label}</span><span>
				{websites[0].suffix}</span
			>
		</a>
	</div>
	<div class="siteRight rightPane">
		<a
			class="websiteLink"
			class:focus={websitesCurrentIndex === 1}
			href={websites[1].href}
			target="_blank"
			on:mousemove={() => handleMouseMove(1)}
		>
			<img loading="lazy" class="screenshot" src={websites[1].screenshot} alt={websites[1].screenshotAlt} />
			<img loading="lazy" src="/img/nav/gotoURL.png" class="redirection" alt="Go to URL" />
			<span style="font-variant : small-caps;">{websites[1].label}</span><span>
				{websites[1].suffix}</span
			>
		</a>
	</div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { shortcuts } from '../../utils/shortcuts.js';
	import { getAssetUrl } from '../../utils/assets.js';

	// Website data
	const websites = [
		{
			href: 'http://localhost/guillaumekuc/guillaumekuc.art',
			screenshot: getAssetUrl('/img/portfolio/guillaumekuc_gkartscreenshot.jpg'),
			screenshotAlt: 'GK Art Screenshot',
			label: 'Guillaume Kuc',
			suffix: '.art'
		},
		{
			href: 'http://localhost/guillaumekuc/guillaumekuc.blog',
			screenshot: getAssetUrl('/img/portfolio/guillaumekuc_gkblogscreenshot.jpg'),
			screenshotAlt: 'GK Blog Screenshot',
			label: 'Guillaume Kuc',
			suffix: '.blog'
		}
	];

	// Local state for website selection (not shared across components)
	let websitesCurrentIndex = 0;

	function handleMouseMove(index) {
		websitesCurrentIndex = index;
	}

	function focusNextWebsite() {
		websitesCurrentIndex = websitesCurrentIndex < 1 ? websitesCurrentIndex + 1 : 0;
	}

	function focusPreviousWebsite() {
		websitesCurrentIndex = websitesCurrentIndex > 0 ? websitesCurrentIndex - 1 : 1;
	}

	function openSelectedWebsite() {
		const website = websites[websitesCurrentIndex];
		if (website) {
			window.open(website.href);
		}
	}

	onMount(() => {
		shortcuts.addScreenShortcut('websitesFolio', 'ArrowRight', focusNextWebsite);
		shortcuts.addScreenShortcut('websitesFolio', 'ArrowLeft', focusPreviousWebsite);
		shortcuts.addScreenShortcut('websitesFolio', 'Enter', openSelectedWebsite);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('websitesFolio');
	});
</script>

<style>
	.websiteLink {
		/* Color interface variables */
		--website-text-primary: var(--color-white);
		--website-background-secondary: var(--color-background-secondary);
		/* Border radius interface variable - map global variable to local scope */
		--website-radius: var(--radius-large);
		
		display: inline-block;
		width: 90%;
		text-align: center;
		transition: 0.25s ease-out;
		color: var(--website-text-primary);
	}

	.websiteLink.focus {
		transform: scale(1.05);
	}

	.websiteLink .screenshot {
		border: 1px solid var(--website-background-secondary);
		border-radius: var(--website-radius);
	}

	.websiteLink.focus .screenshot {
		border: 2px solid var(--website-text-primary);
	}

	.redirection {
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 0px;
		vertical-align: middle;
		margin-right: calc(var(--safeMargin) / 2);
	}
</style>
