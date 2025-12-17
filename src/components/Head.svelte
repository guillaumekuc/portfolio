<div bind:this={loadElement} id="load"></div>

<StartScreen />

<script>
	import { onMount } from 'svelte';
	import { Loading } from '../utils/loading.js';
	import StartScreen from './StartScreen.svelte';

	let loadElement;

	onMount(() => {
		// Initialize loading screen
		if (loadElement) {
			Loading.initLoadingScreen(loadElement);
		}
	});
</script>

<style>
	:global(body) {
		--head-accent-color: var(--accentColor);
	}

	#load {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 101;
		background: rgba(0, 0, 0, 1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#load::before {
		content: '';
		width: 40px;
		height: 40px;
		border: 4px solid var(--shade3);
		border-top-color: var(--shadeWhite);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	:global(#load.active) {
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}
</style>

