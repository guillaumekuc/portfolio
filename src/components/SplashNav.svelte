<div id="splashNavPositioner">
	<div id="splashNavEmptySpace"></div>
	<div id="splashNavArea" class="splashNavArea">
		<div bind:this={navElement} id="splashNav" class="splashNav">
			<a id="blogBtn" href="http://guillaumekuc.blog" target="_blank">
				<img src="/img/.old/icons/blog.svg" alt="Blog" />
				<span class="navLabel">Blog</span>
			</a>

			<span>·</span>

			<a
				id="worksBtn"
				role="button"
				tabindex="0"
				on:click={() => {
					const categories = document.querySelector('#categories');
					if (categories) categories.scrollIntoView();
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						const categories = document.querySelector('#categories');
						if (categories) categories.scrollIntoView();
					}
				}}
			>
				<img src="/img/.old/icons/keydown2_w.svg" alt="Works" />
				<span class="navLabel">Works</span>
			</a>

			<span>·</span>

			<a
				id="contactBtn"
				class="mailTooltip"
				target="_blank"
				on:click|preventDefault={(e) => {
					Tooltip.handleMailTooltip(e);
					window.open('mailto:guillaume@guillaumekuc.com', 'mail');
				}}
				href="mailto:guillaume@guillaumekuc.com"
			>
				<img src="/img/.old/icons/contact_w.svg" alt="Contact" />
				<span class="navLabel">Contact</span>
			</a>
		</div>
		<!--#splashNav-->
	</div>
	<!--#splashNavArea-->
</div>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { Tooltip } from '../utils/tooltip.js';
	import { shortcuts } from '../utils/shortcuts.js';
	import { stores } from '../stores.js';
	import { Animation } from '../utils/animation.js';

	let navElement;

	function handleNavAnimate() {
		if (navElement) {
			navElement.style.opacity = '100%';
		}
		const navLinks = navElement?.querySelectorAll('a');
		if (navLinks) {
			navLinks.forEach((link) => {
				link.style.opacity = '100%';
			});
			setTimeout(() => {
				navLinks.forEach((link) => {
					link.style.pointerEvents = 'auto';
				});
			}, 4000);
		}
	}

	function updateSplashNavFocus() {
		document.querySelectorAll('.splashNav a').forEach((link) => {
			link.classList.remove('focus');
		});
		const selectedMenuItem = get(stores.navigation.selectedMenuItem);
		if (selectedMenuItem === 0) {
			const blogBtn = document.querySelector('#blogBtn');
			if (blogBtn) blogBtn.classList.add('focus');
		} else if (selectedMenuItem === 1) {
			const worksBtn = document.querySelector('#worksBtn');
			if (worksBtn) worksBtn.classList.add('focus');
		} else if (selectedMenuItem === 2) {
			const contactBtn = document.querySelector('#contactBtn');
			if (contactBtn) contactBtn.classList.add('focus');
		}
	}

	function goToCategories() {
		document.querySelectorAll('.splashNav a').forEach((link) => {
			link.classList.remove('focus');
		});
		stores.navigation.selectedMenuItem.set(1);
		Animation.programmaticHover(document.querySelector('#worksBtn'));
		document.querySelector('#categories')?.scrollIntoView();
	}

	function selectPreviousMenuItem() {
		const selectedMenuItem = get(stores.navigation.selectedMenuItem);
		let newSelectedMenuItem;
		if (selectedMenuItem === 1) {
			newSelectedMenuItem = 0;
		} else if (selectedMenuItem === 0) {
			newSelectedMenuItem = 2;
		} else {
			newSelectedMenuItem = 1;
		}
		stores.navigation.selectedMenuItem.set(newSelectedMenuItem);
		updateSplashNavFocus();
	}

	function selectNextMenuItem() {
		const selectedMenuItem = get(stores.navigation.selectedMenuItem);
		let newSelectedMenuItem;
		if (selectedMenuItem === 2) {
			newSelectedMenuItem = 0;
		} else if (selectedMenuItem === 1) {
			newSelectedMenuItem = 2;
		} else {
			newSelectedMenuItem = 1;
		}
		stores.navigation.selectedMenuItem.set(newSelectedMenuItem);
		updateSplashNavFocus();
	}

	function triggerSelectedMenuItem() {
		const selectedMenuItem = get(stores.navigation.selectedMenuItem);
		if (selectedMenuItem === 0) {
			const blogBtn = document.querySelector('#blogBtn');
			if (blogBtn) {
				window.open(blogBtn.getAttribute('href')).focus();
			}
			document.querySelectorAll('.splashNav a').forEach((link) => {
				link.classList.remove('focus');
			});
			stores.navigation.selectedMenuItem.set(1);
		} else if (selectedMenuItem === 1) {
			document.querySelector('#categories')?.scrollIntoView();
			document.querySelectorAll('.splashNav a').forEach((link) => {
				link.classList.remove('focus');
			});
			stores.navigation.selectedMenuItem.set(1);
		} else if (selectedMenuItem === 2) {
			window.open('mailto:guillaume@guillaumekuc.com', 'mail');
			document.querySelectorAll('.splashNav a').forEach((link) => {
				link.classList.remove('focus');
			});
			stores.navigation.selectedMenuItem.set(1);
		}
	}

	onMount(() => {
		shortcuts.addScreenShortcut('splashscreen', 'ArrowDown', goToCategories);
		shortcuts.addScreenShortcut('splashscreen', 'ArrowLeft', selectPreviousMenuItem);
		shortcuts.addScreenShortcut('splashscreen', 'ArrowRight', selectNextMenuItem);
		shortcuts.addScreenShortcut('splashscreen', 'Enter', triggerSelectedMenuItem);

		window.addEventListener('navAnimate', handleNavAnimate);
	});

	onDestroy(() => {
		shortcuts.removeScreenShortcuts('splashscreen');
		window.removeEventListener('navAnimate', handleNavAnimate);
	});
</script>

<style>
	#splashNavPositioner {
		position: absolute;
		display: block;
		width: 100%;
		top: 0;
		left: 0;
		height: 100%;
	}

	#splashNavEmptySpace {
		display: block;
		position: relative;
		visibility: hidden;
		z-index: -100;
		height: 90%;
		max-height: calc(100% - 2 * var(--safeMargin));
	}

	.splashNavArea {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 10vh;
		width: 100%;
		min-height: calc(2 * var(--safeMargin));
		background-color: rgba(09, 09, 09, 0.9);
	}

	.splashNav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: calc(100vw / 3);
		min-width: 384px;
		height: 80%;
		z-index: 200;
	}

	@media (max-width: 768px) {
		.splashNav {
			width: calc(100vw / 2);
			min-width: calc(100vw / 2);
		}
	}
	.splashNav > a,
	.splashNav > span {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		color: var(--shadeWhite);
		font-variant: small-caps;
		font-size: calc(var(--safeMargin) / 2);
		opacity: 20%;
		pointer-events: none;
		user-select: none;
	}

	#blogBtn {
		transition: opacity 1.5s ease-out 3.25s;
	}
	#worksBtn {
		transition: opacity 1.5s ease-out 3s;
	}
	#contactBtn {
		transition: opacity 1.5s ease-out 3.5s;
	}

	.splashNav img {
		width: calc(1.2 * var(--safeMargin));
		height: calc(1.2 * var(--safeMargin));
	}

	@media (max-height: 432px) {
		.splashNav img {
			width: calc(0.9 * var(--safeMargin));
			height: calc(0.9 * var(--safeMargin));
		}
	}

	@media (max-height: 864px) {
		.splashNav img {
			width: calc(1.05 * var(--safeMargin));
			height: calc(1.05 * var(--safeMargin));
		}
	}

	.splashNav > a:hover {
		transition: none !important;
		opacity: 100%;
		cursor: pointer;
	}
	:global(.splashNav > a.programmaticHover) {
		opacity: 100% !important;
		transition: none !important;
	}

	.splashNav > a:hover img {
		background-color: var(--shadePop);
		border-radius: calc(4vh / 5);
		box-sizing: border-box;
		transform: scale(1.2);
		border: calc(4vh / 10) solid var(--shadePop);
	}

	.splashNav > a.focus img {
		background-color: var(--shadePop) !important;
		border-radius: calc(4vh / 5);
		box-sizing: border-box;
		transform: scale(1.2);
		border: calc(4vh / 10) solid var(--shadePop);
		transition: 0s linear;
	}

	.splashNav > a.programmaticHover img {
		background-color: var(--shadePop);
		border-radius: calc(4vh / 5);
		box-sizing: border-box;
		transform: scale(1.2);
		border: calc(4vh / 10) solid var(--shadePop);
	}

	:global(#contactBtn .tooltipText) {
		top: -25%;
		left: 50%;
		transform: translateX(-50%) translateY(-100%);
		font-variant: normal;
		font-family: var(--ff1);
		font-size: 90%;
	}
</style>
