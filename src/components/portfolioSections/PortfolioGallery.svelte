<div class="gallery">
	{#each items as item}
		<div class="gallery-item">
			{#if item.video}
				<video 
					preload="none" 
					loop 
					muted 
					on:click={handleVideoClick} 
					poster={item.poster}
				>
					<source src={item.video} type="video/mp4" />
				</video>
			{:else if item.url}
				<img loading="lazy" src={item.url} alt={displayTitle(item)} />
			{/if}
			<div class="gallery-overlay">
				<div class="gallery-metadata">
					{#if item.title}
						<div class="metadata-title">{displayTitle(item)}</div>
					{/if}
					{#if item.category}
						<div class="metadata-category">{displayCategory(item)}</div>
					{/if}
					{#if item.client}
						<div class="metadata-client">{clientPrefix}{item.client}</div>
					{/if}
					{#if item.role}
						<div class="metadata-role">{rolePrefix}{item.role}</div>
					{/if}
					{#if item.tools && item.tools.length > 0}
						<div class="metadata-tools">
							<ToolsDisplay tools={item.tools} iconsOnly={true} align="right" />
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
<!--gallery-->

<script>
	import ToolsDisplay from '../ToolsDisplay.svelte';
	import { getAssetUrl } from '../../utils/assets.js';
	import { stores } from '../../stores.js';
	import { L } from '../../utils/localized.js';
	import { t } from '../../utils/i18n.js';

	export let sectionConfig;

	const localeStore = stores.i18n.locale;

	function displayTitle(item) {
		return L(item.title, $localeStore);
	}

	function displayCategory(item) {
		return L(item.category, $localeStore);
	}

	$: clientPrefix = `${t($localeStore, 'portfolio.meta.client')} `;
	$: rolePrefix = `${t($localeStore, 'portfolio.meta.role')} `;

	$: items = (sectionConfig?.items || []).map(item => ({
		...item,
		url: item.url ? getAssetUrl(item.url) : item.url,
		video: item.video ? getAssetUrl(item.video) : item.video,
		poster: item.poster ? getAssetUrl(item.poster) : item.poster
	}));
	
	function handleVideoClick(event) {
		const video = event.currentTarget;
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	}
</script>

<style>
	.gallery {
		/* Font interface variables - map global variables to local scope */
		--gallery-font-rounded: var(--ffRounded);
		--gallery-font-primary: var(--ffCrimson);
		/* Border radius interface variable - map global variable to local scope */
		--gallery-radius: var(--radius-large);
	}

	.gallery-item {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 100%;
		overflow: hidden;
		border-radius: var(--gallery-radius);
		cursor: pointer;
		display: flex;
		align-items: stretch;
	}

	/* Centered item shows grab cursor since it can be dragged */
	:global(.slick-center) .gallery-item {
		cursor: grab;
	}

	:global(.slick-center) .gallery-item:active {
		cursor: grabbing;
	}

	.gallery-item > img {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 80vh;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin)));
		object-fit: cover;
		flex: 1;
		display: block;
		border-radius: var(--gallery-radius);
	}

	.gallery-item > video {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 80vh;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin)));
		object-fit: cover;
		flex: 1;
		display: block;
		border-radius: var(--gallery-radius);
	}

	.gallery-overlay {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		padding: 20px 15px 15px 15px;
		/* background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 40%, transparent 100%); */
		z-index: 2;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		min-height: 120px;
	}

	/* Only show overlay when the slide is centered AND hovered */
	:global(.slick-center) .gallery-item:hover .gallery-overlay,
	:global(.slick-current.slick-center) .gallery-item:hover .gallery-overlay {
		opacity: 1;
	}

	.gallery-metadata {
		text-align: right;
		color: var(--color-white);
		font-size: 13px;
		line-height: 1.5;
		max-width: 80%;
		font-family: var(--gallery-font-primary);
	}

	.metadata-title {
		font-family: var(--gallery-font-rounded);
		font-weight: bold;
		font-size: 15px;
		margin-bottom: 5px;
		text-shadow: 
			-1px -1px 0 rgba(0, 0, 0, 0.8),
			1px -1px 0 rgba(0, 0, 0, 0.8),
			-1px 1px 0 rgba(0, 0, 0, 0.8),
			1px 1px 0 rgba(0, 0, 0, 0.8),
			0 -1px 0 rgba(0, 0, 0, 0.8),
			-1px 0 0 rgba(0, 0, 0, 0.8),
			1px 0 0 rgba(0, 0, 0, 0.8),
			0 1px 0 rgba(0, 0, 0, 0.8);
	}

	.metadata-category {
		font-family: var(--gallery-font-primary);
		font-style: italic;
		margin-bottom: 5px;
		opacity: 0.95;
		text-shadow: 
			-1px -1px 0 rgba(0, 0, 0, 0.8),
			1px -1px 0 rgba(0, 0, 0, 0.8),
			-1px 1px 0 rgba(0, 0, 0, 0.8),
			1px 1px 0 rgba(0, 0, 0, 0.8),
			0 -1px 0 rgba(0, 0, 0, 0.8),
			-1px 0 0 rgba(0, 0, 0, 0.8),
			1px 0 0 rgba(0, 0, 0, 0.8),
			0 1px 0 rgba(0, 0, 0, 0.8);
	}

	.metadata-client,
	.metadata-role {
		font-family: var(--gallery-font-primary);
		font-size: 11px;
		margin-bottom: 4px;
		opacity: 0.85;
		text-shadow: 
			-1px -1px 0 rgba(0, 0, 0, 0.8),
			1px -1px 0 rgba(0, 0, 0, 0.8),
			-1px 1px 0 rgba(0, 0, 0, 0.8),
			1px 1px 0 rgba(0, 0, 0, 0.8),
			0 -1px 0 rgba(0, 0, 0, 0.8),
			-1px 0 0 rgba(0, 0, 0, 0.8),
			1px 0 0 rgba(0, 0, 0, 0.8),
			0 1px 0 rgba(0, 0, 0, 0.8);
	}

	.metadata-tools {
		justify-content: flex-end;
		margin-top: 10px;
		pointer-events: auto;
	}

	/* Responsive breakpoints for smaller screens */
	@media (max-height: 950px) {
		.gallery-metadata {
			font-size: 12px;
			line-height: 1.4;
		}
		.metadata-title {
			font-size: 14px;
			margin-bottom: 4px;
		}
		.metadata-category {
			margin-bottom: 4px;
		}
		.metadata-client,
		.metadata-role {
			font-size: 10px;
			margin-bottom: 3px;
		}
		.metadata-tools {
			gap: 5px;
			margin-top: 8px;
		}
		.metadata-tools :global(.tool-icon) {
			width: 20px;
			height: 20px;
		}
		.gallery-overlay {
			padding: 16px 12px 12px 12px;
			min-height: 100px;
		}
	}

	@media (max-height: 750px) {
		.gallery-metadata {
			font-size: 11px;
			line-height: 1.3;
		}
		.metadata-title {
			font-size: 13px;
			margin-bottom: 3px;
		}
		.metadata-category {
			margin-bottom: 3px;
		}
		.metadata-client,
		.metadata-role {
			font-size: 9px;
			margin-bottom: 2px;
		}
		.metadata-tools {
			gap: 4px;
			margin-top: 6px;
		}
		.metadata-tools :global(.tool-icon) {
			width: 18px;
			height: 18px;
		}
		.gallery-overlay {
			padding: 12px 10px 10px 10px;
			min-height: 85px;
		}
	}

	@media (max-height: 500px) {
		.gallery-metadata {
			font-size: 10px;
			line-height: 1.2;
		}
		.metadata-title {
			font-size: 12px;
			margin-bottom: 2px;
		}
		.metadata-category {
			margin-bottom: 2px;
		}
		.metadata-client,
		.metadata-role {
			font-size: 8px;
			margin-bottom: 2px;
		}
		.metadata-tools {
			gap: 3px;
			margin-top: 5px;
		}
		.metadata-tools :global(.tool-icon) {
			width: 16px;
			height: 16px;
		}
		.gallery-overlay {
			padding: 10px 8px 8px 8px;
			min-height: 70px;
		}
	}

	/* Slick carousel slide styles */
	:global(.gallery .slick-slide) {
		background-color: black;
		border-radius: var(--gallery-radius);
		margin-left: 2px;
		margin-right: 2px;
		height: 80vh !important;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin))) !important;
		overflow: hidden;
		display: flex;
		align-items: stretch;
		justify-content: center;
	}

	/* Anim and Mode portfolio sections - 100% height */
	:global(#animFolio1 .gallery .slick-slide),
	:global(#modeFolio1 .gallery .slick-slide) {
		height: 100% !important;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin))) !important;
	}

	/* Non-current slides - reduced opacity and original sizing */
	:global(.gallery .slick-slide img) {
		opacity: 0.25;
		transition: opacity 0.1s linear;
		width: 100%;
		height: 80vh;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin)));
		object-fit: cover;
		display: block;
		border-radius: var(--gallery-radius);
	}

	:global(.gallery .slick-slide video) {
		opacity: 0.25;
		transition: opacity 0.1s linear;
		width: 100%;
		height: 80vh;
		max-height: calc(100vh - (2 * var(--header-footer-height) + 2 * var(--safeMargin)));
		object-fit: cover;
		display: block;
		border-radius: var(--gallery-radius);
	}

	/* Current slide - full opacity */
	:global(.gallery .slick-current img),
	:global(.gallery .slick-current video) {
		opacity: 1;
		transition: opacity 0s linear;
	}
</style>

