<div class="projectLayout">
	{#if layout === 'right'}
		<!-- Text on left, media on right -->
		<div class="shortLeftThirds scrollable">
			<slot name="content" />
		</div>
		<div bind:this={mediaContainer} class="wideRightThirds mediaContainer">
			<slot name="media" />
		</div>
	{:else}
		<!-- Media on left, text on right -->
		<div bind:this={mediaContainer} class="wideLeftThirds mediaContainer">
			<slot name="media" />
		</div>
		<div class="shortRightThirds scrollable">
			<slot name="content" />
		</div>
	{/if}
</div>

<script>
	export let layout = 'right'; // 'left' or 'right'
	export let mediaContainer;
</script>

<style>
	.projectLayout {
		--project-margin: calc(var(--header-footer-height) + var(--safeMargin));
		--project-font-rounded: var(--ffRounded);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		width: 100%;
		height: 100vh;
		padding-top: var(--project-margin);
		padding-bottom: var(--project-margin);
		box-sizing: border-box;
	}

	.mediaContainer {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Make slot wrapper fill container */
	.mediaContainer > :global(*) {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mediaContainer :global(.largeVideo) {
		position: relative;
		top: auto;
		left: auto;
		transform: none;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mediaContainer :global(.largeImage) {
		position: relative;
		top: auto;
		left: auto;
		transform: none;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Override fixed heights - use 100% to fill available space */
	.projectLayout :global(.wideLeftThirds),
	.projectLayout :global(.wideRightThirds),
	.projectLayout :global(.shortLeftThirds),
	.projectLayout :global(.shortRightThirds) {
		height: 100%;
		max-height: 100%;
	}

	/* Move scrollbar to left for left-side text blocks */
	.projectLayout :global(.shortLeftThirds) {
		direction: rtl;
		padding-left: calc(var(--safeMargin));
		padding-right: calc(var(--safeMargin) / 2);
		margin-left: 0;
		margin-right: calc(var(--safeMargin) / 2);
	}

	/* Keep text content reading left-to-right */
	.projectLayout :global(.shortLeftThirds > *) {
		direction: ltr;
	}

	/* Move scrollbar closer to edge for right-side text blocks */
	.projectLayout :global(.shortRightThirds) {
		padding-left: calc(var(--safeMargin) / 2);
		padding-right: calc(var(--safeMargin));
		margin-left: calc(var(--safeMargin) / 2);
		margin-right: 0;
	}
</style>

