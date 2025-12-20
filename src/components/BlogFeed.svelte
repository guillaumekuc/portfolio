<div class="blogFeed">
	<div 
		class="feedHeader" 
		on:click={toggleCollapse} 
		on:keydown={(e) => e.key === 'Enter' && toggleCollapse()} 
		role="button" 
		tabindex="0"
	>
		<svg 
			class="chevron" 
			class:collapsed={isCollapsed}
			viewBox="0 0 24 24" 
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
		</svg>
		<span class="feedTitle">blog</span>
	</div>
	
	{#if !isCollapsed}
		<div class="feedContent">
			{#if loading}
				<div class="loadingMessage">Loading...</div>
			{:else if error}
				<div class="errorMessage">Unable to load posts</div>
			{:else}
				<!-- Pinned posts -->
				{#if pinnedPosts.length > 0}
					{#each pinnedPosts as post}
						<a href={post.url} target="_blank" rel="noopener noreferrer" class="postItem pinnedItem">
							<div class="postMeta">
								<svg class="pinIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" fill="currentColor"/>
								</svg>
								<div class="postDate">{post.date || ''}</div>
							</div>
							<div class="postTitle">"{post.title}"</div>
						</a>
					{/each}
				{/if}
				
				<!-- Latest posts -->
				{#if posts.length > 0}
					{#each posts as post}
						<a href={post.link} target="_blank" rel="noopener noreferrer" class="postItem">
							<div class="postDate">{post.date}</div>
							<div class="postTitle">"{post.title}"</div>
						</a>
					{/each}
				{/if}
			{/if}
		</div>
	{/if}
</div>

<script>
	import { onMount } from 'svelte';
	import { debugLog } from '../utils/debuglog.js';
	import pinnedPostsConfig from '../config/pinnedPosts.json';

	let posts = [];
	let loading = true;
	let error = false;
	let isCollapsed = false;
	let pinnedPosts = pinnedPostsConfig.pinnedPosts || [];

	/**
	 * Decode HTML entities using the browser's built-in decoder
	 * @param {string} html - String with HTML entities
	 * @returns {string} - Decoded string
	 */
	function decodeHTML(html) {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	}

	/**
	 * Format date to YYYY-MM-DD
	 * @param {string} dateString - ISO date string
	 * @returns {string} - Formatted date
	 */
	function formatDate(dateString) {
		try {
			const date = new Date(dateString);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		} catch (err) {
			debugLog('Error formatting date:', err);
			return dateString;
		}
	}

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}

	async function fetchBlogFeed() {
		try {
			debugLog('Fetching blog feed...');
			const response = await fetch('https://guillaumekuc.github.io/blog/feed.xml');
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const text = await response.text();
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(text, 'text/xml');
			
			// Check for parsing errors
			const parserError = xmlDoc.querySelector('parsererror');
			if (parserError) {
				throw new Error('XML parsing error');
			}
			
			// Parse Atom feed entries
			const entries = xmlDoc.querySelectorAll('entry');
			
			// Get pinned post URLs for filtering and date lookup
			const pinnedUrls = pinnedPosts.map(p => p.url);
			
			// Create a map of all posts for date lookup
			const allPosts = Array.from(entries).map(entry => {
				const titleEl = entry.querySelector('title');
				const linkEl = entry.querySelector('link[rel="alternate"]');
				const publishedEl = entry.querySelector('published');
				
				// Get the raw title and decode HTML entities
				const rawTitle = titleEl ? titleEl.textContent : 'Untitled';
				const decodedTitle = decodeHTML(rawTitle);
				
				// Get and format the published date
				const rawDate = publishedEl ? publishedEl.textContent : '';
				const formattedDate = rawDate ? formatDate(rawDate) : '';
				
				return {
					title: decodedTitle,
					link: linkEl ? linkEl.getAttribute('href') : '#',
					date: formattedDate
				};
			});
			
			// Add dates to pinned posts
			pinnedPosts = pinnedPosts.map(pinned => {
				const foundPost = allPosts.find(post => post.link === pinned.url);
				return {
					...pinned,
					date: foundPost?.date || ''
				};
			});
			
			// Filter out pinned posts from latest and take only 3
			const latestPosts = allPosts
				.filter(post => !pinnedUrls.includes(post.link))
				.slice(0, 3);
			
			posts = latestPosts;
			loading = false;
			debugLog('Blog feed loaded successfully', posts);
		} catch (err) {
			debugLog('Error fetching blog feed:', err);
			error = true;
			loading = false;
		}
	}

	onMount(() => {
		fetchBlogFeed();
	});
</script>

<style>
	.blogFeed {
		/* Interface variables - map global variables to local scope */
		--bp-small-desktop: var(--breakpoint-small-desktop);
		--bp-tablet: var(--breakpoint-tablet);
		--bp-mobile: var(--breakpoint-mobile);

		display: flex;
		flex-direction: column;
		gap: 0.35em;
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	.feedContent {
		display: flex;
		flex-direction: column;
		gap: 0.35em;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(170, 170, 170, 0.3) transparent;
		padding-right: 0.25em;
		flex: 1;
		min-height: 0;
	}

	.feedContent::-webkit-scrollbar {
		width: 6px;
	}

	.feedContent::-webkit-scrollbar-track {
		background: transparent;
	}

	.feedContent::-webkit-scrollbar-thumb {
		background-color: rgba(170, 170, 170, 0.3);
		border-radius: 3px;
		transition: background-color 0.2s ease;
	}

	.feedContent::-webkit-scrollbar-thumb:hover {
		background-color: rgba(170, 170, 170, 0.5);
	}

	.feedHeader {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5em;
		cursor: pointer;
		user-select: none;
		padding: 0.1em 0;
	}

	.feedHeader:hover .feedTitle {
		color: var(--about-accent-color, var(--color-accent));
	}

	.feedTitle {
		font-family: var(--about-font-rounded, var(--ffRounded));
		font-size: 16px;
		font-weight: 300;
		text-transform: lowercase;
		color: var(--about-white, #fff);
		text-align: left;
		letter-spacing: var(--about-letter-spacing, 0.05em);
		transition: color 0.2s ease;
	}

	/* Responsive font sizes for blog section */
	@media (max-height: 950px) {
		.feedTitle {
			font-size: 15px;
		}
		.postTitle {
			font-size: 12px;
		}
		.postDate {
			font-size: 9px;
		}
	}

	@media (max-height: 750px) {
		.feedTitle {
			font-size: 14px;
		}
		.postTitle {
			font-size: 11px;
		}
		.postDate {
			font-size: 9px;
		}
	}

	@media (max-height: 500px) {
		.feedTitle {
			font-size: 13px;
		}
		.postTitle {
			font-size: 10px;
		}
		.postDate {
			font-size: 8px;
		}
	}

	.chevron {
		width: 20px;
		height: 20px;
		color: var(--about-gray, var(--color-gray-light));
		transition: transform 0.25s ease, color 0.2s ease;
		transform: rotate(90deg);
		flex-shrink: 0;
	}

	.chevron.collapsed {
		transform: rotate(0deg);
	}

	.feedHeader:hover .chevron {
		color: var(--about-accent-color, var(--color-accent));
	}

	.postItem {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.2em;
		padding: 0.4em 0.75em;
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.2s ease;
		border: 1px solid transparent;
	}

	.postItem::after {
		content: '↗';
		position: absolute;
		right: 0.75em;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.8em;
		color: var(--about-gray, var(--color-gray-light));
		opacity: 0.5;
		transition: opacity 0.2s ease, color 0.2s ease;
	}

	.postItem:hover {
		background-color: rgba(255, 255, 255, 0.08);
		border-color: var(--about-accent-color, var(--color-accent));
		transform: translateX(2px);
	}

	.postItem:hover::after {
		opacity: 1;
		color: var(--about-white, #fff);
	}

	.pinnedItem {
		background-color: rgba(255, 255, 255, 0.03);
	}

	.pinnedItem:hover {
		background-color: rgba(255, 255, 255, 0.06);
	}

	.postMeta {
		display: flex;
		align-items: center;
		gap: 0.4em;
	}

	.pinIcon {
		width: 12px;
		height: 12px;
		color: var(--about-accent-color, var(--color-accent));
		flex-shrink: 0;
		opacity: 0.8;
	}

	.postDate {
		font-family: var(--about-font-rounded, var(--ffRounded));
		font-size: 10px;
		font-weight: 300;
		color: var(--about-gray, var(--color-gray-light));
		opacity: 0.6;
		text-align: left;
		letter-spacing: 0.02em;
	}

	.postTitle {
		font-family: var(--about-font-rounded, var(--ffRounded));
		font-size: 13px;
		font-weight: 400;
		color: var(--about-gray, var(--color-gray-light));
		line-height: 1.35;
		text-align: left;
		transition: color 0.2s ease;
		padding-right: 1.5em;
	}

	.postItem:hover .postTitle {
		color: var(--about-white, #fff);
	}

	.postItem:hover .postDate {
		opacity: 0.8;
	}

	.loadingMessage,
	.errorMessage {
		font-family: var(--about-font-rounded, var(--ffRounded));
		font-size: 13px;
		font-weight: 300;
		color: var(--about-gray, var(--color-gray-light));
		text-align: left;
		font-style: italic;
		padding-left: 0.4em;
	}

	.errorMessage {
		opacity: 0.7;
	}
</style>

