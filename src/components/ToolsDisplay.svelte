{#if tools && tools.length > 0}
	<div class="tools-display" class:icons-only={iconsOnly} class:align-right={align === 'right'}>
		{#each tools as tool}
			{@const toolInfo = getToolInfo(tool)}
			{@const toolIcon = getToolIcon(tool)}
			{#if toolInfo}
				{#if toolIcon}
					<img 
						src={toolIcon} 
						alt={getToolLabel(tool)} 
						class="tool-icon"
						title={getToolLabel(tool)}
					/>
				{:else if !iconsOnly}
					<span class="tool-label" title={getToolLabel(tool)}>
						{getToolLabel(tool)}
					</span>
				{/if}
			{/if}
		{/each}
	</div>
{/if}

<script>
	import toolsConfig from '../config/tools.json';

	/**
	 * @param {string[]|undefined} tools - Array of tool keys to display
	 * @param {boolean} iconsOnly - If true, only show tools with icons (default: false)
	 * @param {string} align - Alignment: 'left' or 'right' (default: 'left')
	 */
	export let tools = [];
	export let iconsOnly = false;
	export let align = 'left';

	// Tool utility functions (moved from utils/tools.js)
	function getToolInfo(toolKey) {
		return toolsConfig[toolKey] || null;
	}

	function getToolIcon(toolKey) {
		const toolInfo = getToolInfo(toolKey);
		return toolInfo?.icon || null;
	}

	function getToolLabel(toolKey) {
		const toolInfo = getToolInfo(toolKey);
		return toolInfo?.label || toolKey;
	}
</script>

<style>
	.tools-display {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		align-items: center;
	}

	.tools-display.align-right {
		justify-content: flex-end;
	}

	.tool-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
		opacity: 0.9;
		border-radius: 0;
		overflow: visible;
	}

	.tool-label {
		font-size: 13px;
		color: var(--color-text, #ccc);
		padding: 2px 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}

	/* Icons-only mode - smaller icons, tighter spacing (for gallery overlays) */
	.tools-display.icons-only {
		gap: 6px;
	}

	.tools-display.icons-only .tool-icon {
		width: 18px;
		height: 18px;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
		border-radius: 0;
		overflow: visible;
	}
</style>

