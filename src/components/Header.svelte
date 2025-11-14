<div id="header" class="header">
	<div id="stickyHeader" class="stickyHeader">
		<HeaderLinks />
		<div id="headerBranding" class="headerBranding">
			<button type="button" class="headerTitle" on:click={handleTitleClick}>{profile.name}</button>
			<span>&nbsp;—&nbsp;</span>
			<span class="headerSubTitle">{profile.headline}</span>
		</div>
		<div id="headerNav" class="headerNav">
			{#each headerNavItems as item, index}
				<button
					type="button"
					id={item.id}
					class={item.id}
					class:focus={currentNavTarget === item.target}
					on:click={() => handleHeaderNavClick(item.target)}
				>
					{item.label}
				</button>
				{#if index < headerNavItems.length - 1}
					<span>&nbsp;·&nbsp;</span>
				{/if}
			{/each}
		</div>
	</div>
	<!--#stickyHeader-->
</div>
<!--#header-->

<script>
	import HeaderLinks from './HeaderLinks.svelte';
	import { stores } from '../stores.js';
	import { DOM } from '../utils/dom.js';
	import { Navigation } from '../utils/navigation.js';
	import navConfig from '../config/nav.json';
	import profileConfig from '../config/profile.json';

	// Get profile info from config
	const profile = profileConfig;

	// Filter navigation items to only include internal items
	// Sort so CTA items come first, then map to the format needed for the header
	const headerNavItems = navConfig.navigation
		.filter(item => item.type === 'internal' && item.target)
		.sort((a, b) => {
			// CTA items come first
			if (a.cta && !b.cta) return -1;
			if (!a.cta && b.cta) return 1;
			return 0; // Maintain original order for non-CTA items
		})
		.map(item => ({
			id: `headerNavButton-${item.id}`,
			target: item.target,
			label: item.label
		}));

	// Extract the store for reactive access
	const currentNavTargetStore = stores.navigation.currentNavTarget;
	$: currentNavTarget = $currentNavTargetStore;

	function handleHeaderNavClick(target) {
		// Update the current nav target
		stores.navigation.currentNavTarget.set(target);

		// Hide irrelevant portfolio sections using the new nav-based filtering
		Navigation.filterPortfolioSectionsByNavTarget(target);

		// Scroll to first visible portfolio section
		setTimeout(() => {
			const allPortfolioSections = document.querySelectorAll('.portfolioSection');
			for (const portfolioSection of allPortfolioSections) {
				const style = window.getComputedStyle(portfolioSection);
				if (style.display !== 'none' && style.visibility !== 'hidden') {
					portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
					break;
				}
			}
		}, 100);
	}

	function handleTitleClick() {
		const splashscreen = document.querySelector('#splashscreen');
		if (splashscreen) splashscreen.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<style>
	.header {
		font-size: var(--fs2o3);
	}
	@media (max-height: 648px) {
		.header {
			font-size: var(--fs1o2);
		}
	}
	@media (max-height: 432px) {
		.header {
			font-size: var(--fs1o2);
		}
	}

	.header {
		display: block;
		position: sticky;
		top: 0;
		height: calc(2 * var(--safeMargin));
		width: 100%;
		color: white;
		background-color: var(--shade1);
		z-index: 85;
	}

	.headerBranding {
		position: absolute;
		top: 0;
		height: var(--safeMargin);
		padding-left: var(--safeMargin);
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.headerTitle {
		color: var(--shadeWhite);
		font-size: 1em;
	}

	.headerTitle:hover {
		cursor: pointer;
		color: var(--shadeWhite);
	}

	.headerNav {
		position: absolute;
		top: var(--safeMargin);
		width: 100%;
		height: var(--safeMargin);
		padding-left: var(--safeMargin);
		padding-right: var(--safeMargin);
		display: flex;
		align-items: center;
		justify-content: left;
		color: var(--shade3);
		line-height: auto;
		user-select: none;
	}

	.headerNav button {
		color: var(--shade3);
		height: content;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font: inherit;
	}

	.headerNav button:hover {
		color: var(--shade4);
	}
	.headerNav button.focus {
		color: var(--shadeWhite);
	}
</style>
