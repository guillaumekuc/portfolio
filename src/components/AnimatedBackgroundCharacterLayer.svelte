<script>
	import { onMount, onDestroy } from 'svelte';

	// Constants
	const GRID_SQUARE_SIZE = 48; // Size of each square in pixels
	const CHARACTERS = ['▣', '◇', '◉', '◈', '■']; // Easily modifiable character list
	const FONT_SIZE_RATIO = 0.6; // Font size as ratio of square size (60% of square)
	const MIN_FONT_SIZE = 12; // Minimum font size in pixels
	const MAX_FONT_SIZE = 48; // Maximum font size in pixels
	const STEP_DURATION = 50; // Game loop step duration in milliseconds
	const MAX_RING = 4; // Maximum ring distance for propagators

	let canvas;
	let ctx;
	let gridData = new Map(); // Map of "x,y" -> {character, x, y} for grid cells
	let characterColor = '#2D2D2D'; // Default, will be computed from CSS
	let propagators = []; // Array of propagator objects
	let gridBounds = { cols: 0, rows: 0, offsetX: 0, offsetY: 0 }; // Store grid bounds
	let gameLoopInterval;
	let mouseX = 0;
	let mouseY = 0;
	let isMouseOverCanvas = false;

	// Get the exact footer color from CSS variable
	function getFooterColor() {
		// Get the color from CSS variable
		const temp = document.createElement('div');
		temp.style.backgroundColor = 'var(--color-background-tertiary)';
		temp.style.position = 'absolute';
		temp.style.visibility = 'hidden';
		temp.style.width = '1px';
		temp.style.height = '1px';
		document.body.appendChild(temp);
		
		const computedColor = window.getComputedStyle(temp).backgroundColor;
		document.body.removeChild(temp);
		
		// Convert rgb() to hex if needed, or return as-is
		if (computedColor.startsWith('rgb')) {
			const rgb = computedColor.match(/\d+/g);
			if (rgb && rgb.length >= 3) {
				const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
				const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
				const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
				return `#${r}${g}${b}`;
			}
		}
		return computedColor || '#2D2D2D'; // Fallback
	}

	// Calculate centered grid bounds
	function calculateGridBounds(width, height) {
		const centerX = width / 2;
		const centerY = height / 2;
		
		// Calculate how many squares fit in each direction
		const cols = Math.ceil(width / GRID_SQUARE_SIZE) + 2; // +2 for safety
		const rows = Math.ceil(height / GRID_SQUARE_SIZE) + 2;
		
		// Calculate offset to center the middle square
		const offsetX = centerX - (Math.floor(cols / 2) * GRID_SQUARE_SIZE);
		const offsetY = centerY - (Math.floor(rows / 2) * GRID_SQUARE_SIZE);
		
		return { cols, rows, offsetX, offsetY };
	}

	// Get random character from the list
	function getRandomCharacter() {
		return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
	}

	// Get next character in the cycle
	function getNextCharacter(currentChar) {
		const currentIndex = CHARACTERS.indexOf(currentChar);
		if (currentIndex === -1) return CHARACTERS[0];
		const nextIndex = (currentIndex + 1) % CHARACTERS.length;
		return CHARACTERS[nextIndex];
	}

	// Convert grid coordinates to key string
	function getCellKey(x, y) {
		return `${x},${y}`;
	}

	// Convert screen coordinates to grid coordinates
	function screenToGrid(screenX, screenY) {
		const gridX = Math.floor((screenX - gridBounds.offsetX) / GRID_SQUARE_SIZE);
		const gridY = Math.floor((screenY - gridBounds.offsetY) / GRID_SQUARE_SIZE);
		return { x: gridX, y: gridY };
	}

	// Get cell at grid coordinates
	function getCell(x, y) {
		const key = getCellKey(x, y);
		return gridData.get(key);
	}

	// Set cell at grid coordinates
	function setCell(x, y, character) {
		const key = getCellKey(x, y);
		gridData.set(key, { character, x, y });
	}

	// Calculate Euclidean distance (ring number) between two points
	// This creates circular-shaped rings
	function calculateRing(x1, y1, x2, y2) {
		const dx = x1 - x2;
		const dy = y1 - y2;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return Math.round(distance);
	}

	// Create a propagator object at given coordinates
	function createPropagator(originX, originY) {
		const squares = [];
		
		// Iterate through all grid cells and calculate ring distance
		for (let row = 0; row < gridBounds.rows; row++) {
			for (let col = 0; col < gridBounds.cols; col++) {
				const cell = getCell(col, row);
				if (cell) {
					const ring = calculateRing(originX, originY, col, row);
					squares.push({
						...cell,
						ring: ring
					});
				}
			}
		}
		
		return {
			x: originX,
			y: originY,
			iteration: 0,
			squares: squares
		};
	}

	// Calculate appropriate font size for the square
	function calculateFontSize() {
		const baseFontSize = GRID_SQUARE_SIZE * FONT_SIZE_RATIO;
		return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, baseFontSize));
	}

	// Initialize grid data with random characters
	function initializeGridData(cols, rows) {
		gridData.clear();
		propagators = [];
		
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const character = getRandomCharacter();
				setCell(col, row, character);
			}
		}
	}

	// Setup canvas dimensions and context
	function setupCanvas() {
		if (!canvas) return;
		
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		
		ctx = canvas.getContext('2d', { willReadFrequently: false });
	}

	// Game loop step: update propagators and activate cells
	function gameStep() {
		// Only create propagators if mouse is actually over the canvas
		if (isMouseOverCanvas) {
			// Check mouse position and create new propagator if mouse is over a valid cell
			const mouseGridPos = screenToGrid(mouseX, mouseY);
			if (mouseGridPos.x >= 0 && mouseGridPos.x < gridBounds.cols &&
			    mouseGridPos.y >= 0 && mouseGridPos.y < gridBounds.rows) {
				// Check if a propagator already exists at this position
				const existingPropagator = propagators.find(p => 
					p.x === mouseGridPos.x && p.y === mouseGridPos.y
				);
				
				// Only create new propagator if one doesn't already exist at this position
				if (!existingPropagator) {
					const newPropagator = createPropagator(mouseGridPos.x, mouseGridPos.y);
					propagators.push(newPropagator);
				}
			}
		}
		
		// Process each propagator
		const propagatorsToRemove = [];
		
		for (let i = 0; i < propagators.length; i++) {
			const propagator = propagators[i];
			
			// Increment iteration
			propagator.iteration += 1;
			
			// Find all squares where ring equals current iteration
			const squaresToActivate = propagator.squares.filter(square => 
				square.ring === propagator.iteration
			);
			
			// Activate squares (cycle to next character)
			for (const square of squaresToActivate) {
				const cell = getCell(square.x, square.y);
				if (cell) {
					const nextChar = getNextCharacter(cell.character);
					setCell(square.x, square.y, nextChar);
				}
			}
			
			// Check if propagator has reached max ring value
			if (propagator.iteration >= MAX_RING) {
				// Reached max ring, mark for removal
				propagatorsToRemove.push(i);
			}
		}
		
		// Remove propagators that are done (iterate backwards to maintain indices)
		for (let i = propagatorsToRemove.length - 1; i >= 0; i--) {
			propagators.splice(propagatorsToRemove[i], 1);
		}
	}

	// Render the grid on canvas
	function renderGrid() {
		if (!ctx || !canvas) return;
		
		const width = canvas.width;
		const height = canvas.height;
		gridBounds = calculateGridBounds(width, height);
		
		// Initialize grid data if needed or on resize
		if (gridData.size === 0) {
			initializeGridData(gridBounds.cols, gridBounds.rows);
		}
		
		// Clear canvas
		ctx.clearRect(0, 0, width, height);
		
		// Set font properties
		const fontSize = calculateFontSize();
		ctx.font = `${fontSize}px monospace`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		
		// Set character color (same as footer: oklch(0.1776 0 0))
		ctx.fillStyle = characterColor;
		ctx.globalAlpha = 1.0; // Ensure full opacity
		
		// Render each grid cell
		for (let row = 0; row < gridBounds.rows; row++) {
			for (let col = 0; col < gridBounds.cols; col++) {
				const cell = getCell(col, row);
				if (cell) {
					const screenX = gridBounds.offsetX + col * GRID_SQUARE_SIZE + GRID_SQUARE_SIZE / 2;
					const screenY = gridBounds.offsetY + row * GRID_SQUARE_SIZE + GRID_SQUARE_SIZE / 2;
					
					// Only render if within viewport bounds
					if (screenX >= -GRID_SQUARE_SIZE && screenX <= width + GRID_SQUARE_SIZE &&
					    screenY >= -GRID_SQUARE_SIZE && screenY <= height + GRID_SQUARE_SIZE) {
						ctx.fillText(cell.character, screenX, screenY);
					}
				}
			}
		}
	}

	// Game loop: execute step and re-render
	function gameLoop() {
		gameStep();
		renderGrid();
	}

	// Handle mouse movement to track cursor position
	function handleMouseMove(event) {
		const rect = canvas.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	}

	// Handle mouse entering canvas
	function handleMouseEnter() {
		isMouseOverCanvas = true;
	}

	// Handle mouse leaving canvas
	function handleMouseLeave() {
		isMouseOverCanvas = false;
	}

	// Handle window resize with debouncing
	let resizeTimeout;
	function handleResize() {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			setupCanvas();
			// Reinitialize grid on resize
			gridData.clear();
			propagators = [];
			renderGrid();
		}, 150);
	}

	onMount(() => {
		// Get the exact footer color from CSS
		characterColor = getFooterColor();
		setupCanvas();
		renderGrid();
		
		// Start game loop
		gameLoopInterval = setInterval(gameLoop, STEP_DURATION);
		
		// Add event listeners
		window.addEventListener('resize', handleResize);
		if (canvas) {
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mouseenter', handleMouseEnter);
			canvas.addEventListener('mouseleave', handleMouseLeave);
		}
	});

	onDestroy(() => {
		// Clean up
		if (gameLoopInterval) {
			clearInterval(gameLoopInterval);
		}
		window.removeEventListener('resize', handleResize);
		if (canvas) {
			canvas.removeEventListener('mousemove', handleMouseMove);
			canvas.removeEventListener('mouseenter', handleMouseEnter);
			canvas.removeEventListener('mouseleave', handleMouseLeave);
		}
		clearTimeout(resizeTimeout);
	});
</script>

<canvas bind:this={canvas} class="character-layer-canvas"></canvas>

<style>
	.character-layer-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: auto; /* Enable mouse events for tracking */
	}
</style>
