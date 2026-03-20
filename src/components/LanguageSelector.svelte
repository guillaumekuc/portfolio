<div class="lang-select" bind:this={rootEl}>
	<button
		type="button"
		class="lang-select-trigger"
		aria-haspopup="listbox"
		aria-expanded={menuOpen}
		aria-label={`Language: ${selectedLabel}`}
		on:click={() => (menuOpen = !menuOpen)}
	>
		<span class="lang-select-row" aria-hidden="true">
			<svg class="lang-select-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10" />
				<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
			</svg>
			<span class="lang-select-meta">
				<span class="lang-select-short">{selectedShort}</span>
				<svg class="lang-select-chevron" class:lang-select-chevron--open={menuOpen} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="m6 9 6 6 6-6" />
				</svg>
			</span>
		</span>
	</button>
	{#if menuOpen}
		<ul class="lang-select-menu" role="listbox" aria-label="Languages">
			{#each langConfig.options as opt (opt.id)}
				<li role="none">
					<button
						type="button"
						class="lang-select-option"
						class:lang-select-option--selected={opt.id === selectedId}
						role="option"
						aria-selected={opt.id === selectedId}
						on:click={() => selectOption(opt.id)}
					>
						{opt.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<script>
	import { onMount } from 'svelte';
	import langConfig from '../config/languages.json';

	let rootEl;
	let menuOpen = false;
	const initial =
		langConfig.options.find((o) => o.id === langConfig.defaultLocale)?.id ??
		langConfig.options[0]?.id ??
		'en';
	let selectedId = initial;

	$: selectedOption = langConfig.options.find((o) => o.id === selectedId);
	$: selectedShort =
		selectedOption?.shortLabel ?? selectedId.replace(/-.*$/, '').slice(0, 2).toUpperCase();
	$: selectedLabel = selectedOption?.label ?? selectedId;

	function selectOption(id) {
		selectedId = id;
		menuOpen = false;
	}

	function onDocPointerDown(e) {
		if (rootEl && !rootEl.contains(e.target)) {
			menuOpen = false;
		}
	}

	function onKeydown(e) {
		if (e.key === 'Escape') {
			menuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('pointerdown', onDocPointerDown, true);
		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('pointerdown', onDocPointerDown, true);
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<style>
	.lang-select {
		position: relative;
		flex-shrink: 0;
	}

	.lang-select-trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin: 0;
		border: none;
		border-radius: 0;
		background: none;
		color: var(--lang-select-muted, var(--header-text-secondary, #6e6e6e));
		cursor: pointer;
		transition: color 0.18s ease;
		font-family: var(--header-font-rounded, var(--ffRounded));
		height: calc(var(--header-nav-font-size) + 10px);
	}

	.lang-select-trigger:hover {
		color: var(--lang-select-fg, var(--color-white));
	}

	.lang-select-trigger:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.lang-select-row {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.lang-select-meta {
		display: inline-flex;
		align-items: center;
		gap: 1px;
	}

	.lang-select-globe {
		width: var(--header-nav-font-size);
		height: var(--header-nav-font-size);
		display: block;
		flex-shrink: 0;
	}

	.lang-select-short {
		font-size: calc(var(--header-nav-font-size) * 0.74);
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		flex-shrink: 0;
	}

	.lang-select-chevron {
		--lang-chevron-size: calc(var(--header-nav-font-size) * 0.68);
		width: var(--lang-chevron-size);
		height: var(--lang-chevron-size);
		display: block;
		flex-shrink: 0;
		align-self: center;
		opacity: 0.85;
		transition: transform 0.2s ease;
	}

	.lang-select-chevron--open {
		transform: rotate(180deg);
	}

	.lang-select-menu {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		min-width: 11rem;
		margin: 0;
		padding: 6px;
		list-style: none;
		border: 1px solid var(--lang-select-border, var(--color-gray-dark));
		border-radius: var(--lang-select-radius, 10px);
		background-color: var(--lang-select-menu-bg, var(--color-background-secondary));
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.35);
		z-index: 110;
	}

	.lang-select-option {
		display: block;
		width: 100%;
		text-align: left;
		padding: 10px 12px;
		margin: 0;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: var(--lang-select-muted, #aaa);
		font-family: var(--header-font-rounded, var(--ffRounded));
		font-size: var(--header-nav-font-size, 15px);
		font-weight: 300;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.lang-select-option:hover {
		background-color: var(--lang-select-option-hover, rgb(255 255 255 / 0.06));
		color: var(--lang-select-fg, var(--color-white));
	}

	.lang-select-option--selected {
		background-color: var(--lang-select-option-selected-bg, var(--color-gray-medium));
		color: var(--lang-select-fg, var(--color-white));
		font-weight: 600;
	}

	.lang-select-option:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}
</style>
