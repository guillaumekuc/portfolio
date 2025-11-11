<div id="categories" class="categories fullPage">
	{#each categories as category}
		<div
			id={category.id}
			class="category {category.additionalClass}"
			class:focus={categoryFocused === category.focused}
			style="background-image : url('{category.backgroundImage}');"
			role="button"
			tabindex="0"
			on:mousemove={() => handleCategoryHover(category.focused)}
			on:click={handleCategoryClick}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleCategoryClick();
				}
			}}
		>
			<div class="softwareIcons" class:showNavigationHints={category.showNavigationHints}>
				{#if category.showNavigationHints}
					<img src="/img/.old/icons/leftArrow.png" alt="Left arrow" />
					<span class="categoryEnter">Enter</span>
					<img src="/img/.old/icons/rightArrow.png" alt="Right arrow" />
				{:else}
					{#each category.softwareIcons as icon}
						<img src={icon.src} alt={icon.alt} />
					{/each}
				{/if}
			</div>
			<div class="categoryLogo">
				<img src={category.bigLogo.src} alt={category.bigLogo.alt} />
			</div>
			<span class="label">{category.label}</span>
		</div>
	{/each}

	<div class="categoriesMask"></div>
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { Navigation } from '../utils/navigation.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import { debugLog } from '../utils/debuglog.js';

	// Extract the store for reactive access
	const categoryFocusedStore = stores.navigation.categoryFocused;
	$: categoryFocused = $categoryFocusedStore;

	// Reactive statement to update header nav focus and portfolio section visibility
	$: {
		const categoryFocused = get(stores.navigation.categoryFocused);
		// Update header nav focus (cross-component, acceptable querySelector)
		const target = '#headerNavButton' + categoryFocused;
		document.querySelectorAll('.headerNav button').forEach((btn) => {
			btn.classList.remove('focus');
		});
		const headerNavLink = document.querySelector(target);
		if (headerNavLink) headerNavLink.classList.add('focus');

		// Update portfolio section visibility
		const categoryClass = Navigation.getCategoryClass(categoryFocused);
		Navigation.hideIrrelevantPortfolioSections(categoryClass);
	}

	function selectNextCategory() {
		const categoryFocused = get(stores.navigation.categoryFocused);
		const newCategoryFocused = categoryFocused === 5 ? 1 : categoryFocused + 1;
		stores.navigation.categoryFocused.set(newCategoryFocused);
		debugLog('Category changed:', newCategoryFocused);
	}

	function selectPreviousCategory() {
		const categoryFocused = get(stores.navigation.categoryFocused);
		const newCategoryFocused = categoryFocused === 1 ? 5 : categoryFocused - 1;
		stores.navigation.categoryFocused.set(newCategoryFocused);
		debugLog('Category changed:', newCategoryFocused);
	}

	function goToSplashscreen() {
		document.querySelector('#splashscreen')?.scrollIntoView();
	}

	function goToPortfolioSections() {
		// Ensure filtering is applied based on current category focus before navigation
		const categoryFocused = get(stores.navigation.categoryFocused);
		const categoryClass = Navigation.getCategoryClass(categoryFocused);
		Navigation.hideIrrelevantPortfolioSections(categoryClass);

		const currentScreen = get(stores.navigation.currentScreen);
		Navigation.goToPortfolioSections(currentScreen);
	}

	onMount(() => {
		shortcuts.addScreenShortcut('categories', 'ArrowRight', selectNextCategory);
		shortcuts.addScreenShortcut('categories', 'ArrowLeft', selectPreviousCategory);
		shortcuts.addScreenShortcut('categories', 'ArrowUp', goToSplashscreen);
		shortcuts.addScreenShortcut('categories', 'Enter', goToPortfolioSections);
		shortcuts.addScreenShortcut('categories', 'ArrowDown', goToPortfolioSections);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('categories');
	});

	const categories = [
		{
			id: 'categoryButton1',
			focused: 1,
			backgroundImage: '/img/.old/panorama1.jpg',
			label: '3D & Animation',
			softwareIcons: [
				{ src: '/img/.old/icons/blender48.png', alt: 'Blender' },
				{ src: '/img/.old/icons/maya48.png', alt: 'Maya' },
				{ src: '/img/.old/icons/3ds48.png', alt: '3ds Max' }
			],
			bigLogo: { src: '/img/.old/icons/3D.png', alt: '3D' },
			additionalClass: ''
		},
		{
			id: 'categoryButton2',
			focused: 2,
			backgroundImage: '/img/.old/panorama2.jpg',
			label: 'Illustration',
			softwareIcons: [
				{ src: '/img/.old/icons/photoshop48.png', alt: 'Photoshop' },
				{ src: '/img/.old/icons/tablet58.png', alt: 'Tablet' }
			],
			bigLogo: { src: '/img/.old/icons/painting.png', alt: 'Painting' },
			additionalClass: 'illustrationButton'
		},
		{
			id: 'categoryButton3',
			focused: 3,
			backgroundImage: '/img/.old/panorama3.jpg',
			label: 'All',
			softwareIcons: [
				{ src: '/img/.old/icons/leftArrow.png', alt: 'Left arrow' },
				{ src: '/img/.old/icons/rightArrow.png', alt: 'Right arrow' }
			],
			bigLogo: { src: '/img/.old/icons/asterisk.png', alt: 'All' },
			additionalClass: '',
			showNavigationHints: true
		},
		{
			id: 'categoryButton4',
			focused: 4,
			backgroundImage: '/img/.old/panorama4.jpg',
			label: 'Music',
			softwareIcons: [
				{ src: '/img/.old/icons/reaper48.png', alt: 'Reaper' },
				{ src: '/img/.old/icons/guitar48.png', alt: 'Guitar' },
				{ src: '/img/.old/icons/piano48.png', alt: 'Piano' }
			],
			bigLogo: { src: '/img/.old/icons/music.png', alt: 'Music' },
			additionalClass: ''
		},
		{
			id: 'categoryButton5',
			focused: 5,
			backgroundImage: '/img/.old/panorama5.jpg',
			label: 'Web development',
			softwareIcons: [
				{ src: '/img/.old/icons/stext48.png', alt: 'Text' },
				{ src: '/img/.old/icons/js48.png', alt: 'JavaScript' },
				{ src: '/img/.old/icons/css48.png', alt: 'CSS' },
				{ src: '/img/.old/icons/html48.png', alt: 'HTML' }
			],
			bigLogo: { src: '/img/.old/icons/code.png', alt: 'Code' },
			additionalClass: ''
		}
	];

	function handleCategoryHover(focused) {
		stores.navigation.categoryFocused.set(focused);
		const categoryClass = Navigation.getCategoryClass(focused);
		Navigation.hideIrrelevantPortfolioSections(categoryClass);
		debugLog('Category hover:', focused, 'class:', categoryClass);
	}

	function handleCategoryClick() {
		// Ensure filtering is applied based on current category focus
		const categoryFocused = get(stores.navigation.categoryFocused);
		const categoryClass = Navigation.getCategoryClass(categoryFocused);
		Navigation.hideIrrelevantPortfolioSections(categoryClass);
		debugLog('Category click - filtering for:', categoryClass, 'category:', categoryFocused);
		Navigation.goToPortfolioSections('categories');
	}
</script>

<style>
	.categories {
		font-size: var(--fs2o3);
	}
	@media (max-height: 432px) {
		.categories {
			font-size: var(--fs1o2);
		}
	}

	.categories {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.category {
		position: relative;
		z-index: 70;
		width: 20%;
		height: 80%;
		max-height: calc(100% - 4 * var(--safeMargin));
		overflow: hidden;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: scroll;
		border-radius: 15px;
		margin: 4px;
		user-select: none;
	}

	.categoryLogo {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: block;
		opacity: 0%;
		z-index: 101;
		pointer-events: none;
	}

	.category.focus .categoryLogo {
		display: block;
		opacity: 100%;
	}

	.category .label {
		display: block;
		text-align: center;
		height: 100%;
		margin: auto;
		padding-top: 60vh;
		color: var(--shadeWhite);
		font-size: 100%;
		font-family: var(--ff2);
		font-variant: small-caps;
		transition: background-color 0.25s ease-in;
	}

	.category:after {
		content: '\A';
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: -1;
		opacity: 1;
	}
	.category.focus:after {
		opacity: 0;
	}

	.category .label:hover {
		cursor: pointer;
	}

	.category.focus .label {
		transition: none;
	}

	.category.focus .label::after {
		content: ' —';
	}
	.category.focus .label::before {
		content: '— ';
	}

	.softwareIcons {
		position: absolute;
		display: none;
		top: 0;
		left: 0;
		width: 100%;
		display: visible;
		margin-top: calc(var(--safeMargin) / 2);
		margin-bottom: calc(var(--safeMargin) / 2);
	}

	.softwareIcons img {
		-webkit-filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor)) drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));

		filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor)) drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));
		height: 1.5em;
		width: 1.5em;
		vertical-align: middle;
	}

	.category.focus .softwareIcons {
		display: block;
		z-index: 101;
	}

	.categoryEnter {
		display: inline-block;
		height: 1.5em;
		font-size: 1em;
		box-sizing: border-box;
		padding-left: 0.4em;
		padding-right: 0.4em;
		border: 1px solid var(--shadeWhite);
		border-radius: 5px;
		font-family: var(--ff3);
		text-transform: uppercase;
		vertical-align: middle;
		-webkit-filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor)) drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));
		filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor)) drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));
	}
</style>
