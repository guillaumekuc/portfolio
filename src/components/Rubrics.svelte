<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { stores } from '../stores.js';
	import { Navigation } from '../utils/navigation.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import { debugLog } from '../utils/debuglog.js';

	// Extract the store for reactive access
	const rubricFocusedStore = stores.navigation.rubricFocused;
	$: rubricFocused = $rubricFocusedStore;

	// Reactive statement to update header nav focus and folio visibility
	$: {
		const rubricFocused = get(stores.navigation.rubricFocused);
		// Update header nav focus (cross-component, acceptable querySelector)
		const target = '#hnBtn' + rubricFocused;
		document.querySelectorAll('.headerNav button').forEach((btn) => {
			btn.classList.remove('focus');
		});
		const headerNavLink = document.querySelector(target);
		if (headerNavLink) headerNavLink.classList.add('focus');
		
		// Update folio visibility
		const rubricClass = Navigation.getRubricClass(rubricFocused);
		Navigation.hideIrrelevantFolios(rubricClass);
	}

	function selectNextRubric() {
		const rubricFocused = get(stores.navigation.rubricFocused);
		const newRubricFocused = rubricFocused === 5 ? 1 : rubricFocused + 1;
		stores.navigation.rubricFocused.set(newRubricFocused);
		debugLog('Rubric changed:', newRubricFocused);
	}

	function selectPreviousRubric() {
		const rubricFocused = get(stores.navigation.rubricFocused);
		const newRubricFocused = rubricFocused === 1 ? 5 : rubricFocused - 1;
		stores.navigation.rubricFocused.set(newRubricFocused);
		debugLog('Rubric changed:', newRubricFocused);
	}

	function goToSplashscreen() {
		document.querySelector('#splashscreen')?.scrollIntoView();
	}

	function goToFolios() {
		// Ensure filtering is applied based on current rubric focus before navigation
		const rubricFocused = get(stores.navigation.rubricFocused);
		const rubricClass = Navigation.getRubricClass(rubricFocused);
		Navigation.hideIrrelevantFolios(rubricClass);
		
		const currentScreen = get(stores.navigation.currentScreen);
		Navigation.goToFolios(currentScreen);
	}

	onMount(() => {
		shortcuts.addScreenShortcut('rubrics', 'ArrowRight', selectNextRubric);
		shortcuts.addScreenShortcut('rubrics', 'ArrowLeft', selectPreviousRubric);
		shortcuts.addScreenShortcut('rubrics', 'ArrowUp', goToSplashscreen);
		shortcuts.addScreenShortcut('rubrics', 'Enter', goToFolios);
		shortcuts.addScreenShortcut('rubrics', 'ArrowDown', goToFolios);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('rubrics');
	});

	const rubrics = [
		{
			id: 'rBtn1',
			focused: 1,
			backgroundImage: '/img/panorama1.jpg',
			label: '3D & Animation',
			softwareIcons: [
				{ src: '/img/icons/blender48.png', alt: 'Blender' },
				{ src: '/img/icons/maya48.png', alt: 'Maya' },
				{ src: '/img/icons/3ds48.png', alt: '3ds Max' }
			],
			bigLogo: { src: '/img/icons/3D.png', alt: '3D' },
			extraClass: ''
		},
		{
			id: 'rBtn2',
			focused: 2,
			backgroundImage: '/img/panorama2.jpg',
			label: 'Illustration',
			softwareIcons: [
				{ src: '/img/icons/photoshop48.png', alt: 'Photoshop' },
				{ src: '/img/icons/tablet58.png', alt: 'Tablet' }
			],
			bigLogo: { src: '/img/icons/painting.png', alt: 'Painting' },
			extraClass: 'IllustrationrBtn'
		},
		{
			id: 'rBtn3',
			focused: 3,
			backgroundImage: '/img/panorama3.jpg',
			label: 'All',
			softwareIcons: [
				{ src: '/img/icons/leftArrow.png', alt: 'Left arrow' },
				{ src: '/img/icons/rightArrow.png', alt: 'Right arrow' }
			],
			bigLogo: { src: '/img/icons/asterisk.png', alt: 'All' },
			extraClass: '',
			showNavClues: true
		},
		{
			id: 'rBtn4',
			focused: 4,
			backgroundImage: '/img/panorama4.jpg',
			label: 'Music',
			softwareIcons: [
				{ src: '/img/icons/reaper48.png', alt: 'Reaper' },
				{ src: '/img/icons/guitar48.png', alt: 'Guitar' },
				{ src: '/img/icons/piano48.png', alt: 'Piano' }
			],
			bigLogo: { src: '/img/icons/music.png', alt: 'Music' },
			extraClass: ''
		},
		{
			id: 'rBtn5',
			focused: 5,
			backgroundImage: '/img/panorama5.jpg',
			label: 'Web development',
			softwareIcons: [
				{ src: '/img/icons/stext48.png', alt: 'Text' },
				{ src: '/img/icons/js48.png', alt: 'JavaScript' },
				{ src: '/img/icons/css48.png', alt: 'CSS' },
				{ src: '/img/icons/html48.png', alt: 'HTML' }
			],
			bigLogo: { src: '/img/icons/code.png', alt: 'Code' },
			extraClass: ''
		}
	];

	function handleRubricHover(focused) {
		stores.navigation.rubricFocused.set(focused);
		const rubricClass = Navigation.getRubricClass(focused);
		Navigation.hideIrrelevantFolios(rubricClass);
		debugLog('Rubric hover:', focused, 'class:', rubricClass);
	}

	function handleRubricClick() {
		// Ensure filtering is applied based on current rubric focus
		const rubricFocused = get(stores.navigation.rubricFocused);
		const rubricClass = Navigation.getRubricClass(rubricFocused);
		Navigation.hideIrrelevantFolios(rubricClass);
		debugLog('Rubric click - filtering for:', rubricClass, 'rubric:', rubricFocused);
		Navigation.goToFolios('rubrics');
	}
</script>

<style>
	.rubrics {  font-size: var(--fs2o3); }
	@media (max-height: 432px) { .rubrics { font-size: var(--fs1o2); } }

	.rubrics {
		position: relative;
		display : flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.rubric {
		position: relative;
		z-index : 70;
		width : 20%;
		height : 80%;
		max-height: calc(100% - 4 * var(--safeMargin));
		overflow: hidden;
		background-position : center;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: scroll; 
		border-radius: 15px;
		margin : 4px;
		user-select: none;
	}

	.bigRubricLogo {
		position : absolute;
		top : 50%;
		left : 50%;
		transform: translate(-50%, -50%);
		display : block;
		opacity: 0%;
		z-index : 101;
		pointer-events: none;
	}

	.rubric.focus .bigRubricLogo {
		display : block;
		opacity: 100%;
	}

	.rubric .label {
		display : block;
		text-align: center;
		height : 100%;
		margin : auto;
		padding-top : 60vh;
		color : var(--shadeWhite);
		font-size: 100%;
		font-family: var(--ff2);
		font-variant: small-caps;
		transition : background-color 0.25s ease-in;
	}

	.rubric:after {
		content: '\A';
		position: absolute;
		width: 100%; 
		height:100%;
		top:0; 
		left:0;
		background:rgba(0,0,0,0.60);
		z-index : -1;
		opacity: 1;
	}
	.rubric.focus:after {
		opacity: 0;
	}

	.rubric .label:hover {
		cursor : pointer;
	}

	.rubric.focus .label {
		transition : none;
	}

	.rubric.focus .label::after {
		content : " —";
	}
	.rubric.focus .label::before {
		content : "— ";
	}

	.softwareIcons {
		position: absolute;
		display : none;
		top : 0;
		left : 0;
		width : 100%;
		display : visible;
		margin-top : calc(var(--safeMargin) / 2);
		margin-bottom : calc(var(--safeMargin) / 2);
	}

	.softwareIcons img {
		-webkit-filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
					drop-shadow(-1px 1px 0 var(--iconBorderColor))
					drop-shadow(1px -1px 0 var(--iconBorderColor))
					drop-shadow(-1px -1px 0 var(--iconBorderColor));

		filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor))
			drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));
		height : 1.5em;
		width : 1.5em;
		vertical-align: middle;
	}

	.rubric.focus .softwareIcons{
		display : block;
		z-index: 101;
	}

	.rubricEnter {
		display : inline-block;
		height : 1.5em;
		font-size: 1em;
		box-sizing: border-box;
		padding-left: 0.4em;
		padding-right: 0.4em;
		border : 1px solid var(--shadeWhite);
		border-radius: 5px;
		font-family : var(--ff3);
		text-transform: uppercase;
		vertical-align: middle;
		-webkit-filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
					drop-shadow(-1px 1px 0 var(--iconBorderColor))
					drop-shadow(1px -1px 0 var(--iconBorderColor))
					drop-shadow(-1px -1px 0 var(--iconBorderColor));
		filter: drop-shadow(1px 1px 0 var(--iconBorderColor))
			drop-shadow(-1px 1px 0 var(--iconBorderColor))
			drop-shadow(1px -1px 0 var(--iconBorderColor))
			drop-shadow(-1px -1px 0 var(--iconBorderColor));
	}
</style>

<div id="rubrics" class="rubrics fullPage">
	{#each rubrics as rubric}
		<div 
			id={rubric.id} 
			class="rubric {rubric.extraClass}"
			class:focus={rubricFocused === rubric.focused}
			style="background-image : url('{rubric.backgroundImage}');"
			on:mousemove={() => handleRubricHover(rubric.focused)}
			on:click={handleRubricClick}
		>
			<div class="softwareIcons" class:navClues={rubric.showNavClues}>
				{#if rubric.showNavClues}
					<img src="/img/icons/leftArrow.png" alt="Left arrow" />
					<span class='rubricEnter'>Enter</span>
					<img src="/img/icons/rightArrow.png" alt="Right arrow" />
				{:else}
					{#each rubric.softwareIcons as icon}
						<img src={icon.src} alt={icon.alt} />
					{/each}
				{/if}
			</div>
			<div class="bigRubricLogo">
				<img src={rubric.bigLogo.src} alt={rubric.bigLogo.alt} />
			</div>
			<span class="label">{rubric.label}</span>
		</div>
	{/each}

	<div class="rubricsMask"></div>
</div>
