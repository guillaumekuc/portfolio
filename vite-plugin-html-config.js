import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Simple asset URL resolver for build-time
 */
function getAssetUrl(path) {
	if (!path || path.startsWith('http://') || path.startsWith('https://')) return path;
	try {
		const assetsConfigPath = resolve(__dirname, 'src/config/assets.json');
		const assetsConfig = JSON.parse(readFileSync(assetsConfigPath, 'utf-8'));
		if (!assetsConfig.baseUrl) return path;
		const base = assetsConfig.baseUrl.replace(/\/$/, '');
		if (path.startsWith('/sound/') || path.startsWith('/vid/') || path.startsWith('/img/portfolio/') || path.startsWith('/img/guillaumekuc_')) {
			return base + path;
		}
	} catch (error) {
		console.warn('⚠️  Could not load assets config:', error.message);
	}
	return path;
}

/**
 * Vite plugin to inject site configuration into index.html
 */
export function htmlConfig() {
	return {
		name: 'html-config',
		transformIndexHtml(html) {
			try {
				// Load site configuration
				const configPath = resolve(__dirname, 'src/config/site.json');
				const siteConfig = JSON.parse(readFileSync(configPath, 'utf-8'));

				// Replace placeholders with config values
				let transformedHtml = html;

				// Replace title
				if (siteConfig.title) {
					transformedHtml = transformedHtml.replace(
						/<title>.*?<\/title>/s,
						`<title>${escapeHtml(siteConfig.title)}</title>`
					);
				}

				// Replace meta description
				if (siteConfig.description) {
					transformedHtml = transformedHtml.replace(
						/<meta\s+name="description"\s+content="[^"]*">/,
						`<meta name="description" content="${escapeHtml(siteConfig.description)}">`
					);
				}

				// Replace favicon
				if (siteConfig.favicon) {
					const faviconType = siteConfig.faviconType || 'image/svg+xml';
					transformedHtml = transformedHtml.replace(
						/<link\s+rel="icon"\s+href="[^"]*"\s+type="[^"]*">/,
						`<link rel="icon" href="${escapeHtml(siteConfig.favicon)}" type="${escapeHtml(faviconType)}">`
					);
				}

				// Replace lang attribute
				if (siteConfig.lang) {
					transformedHtml = transformedHtml.replace(
						/<html\s+lang="[^"]*">/,
						`<html lang="${escapeHtml(siteConfig.lang)}">`
					);
				}

				// Replace preload images
				if (siteConfig.preloadImages && Array.isArray(siteConfig.preloadImages)) {
					// Remove all existing preload image links (handle multiple)
					transformedHtml = transformedHtml.replace(
						/<link\s+rel="preload"\s+as="image"\s+href="[^"]*">\s*/g,
						''
					);

					// Add new preload images after the comment (resolve asset URLs)
					const preloadLinks = siteConfig.preloadImages
						.map(image => {
							const resolvedUrl = getAssetUrl(image);
							return `\t<link rel="preload" as="image" href="${escapeHtml(resolvedUrl)}">`;
						})
						.join('\n');

					// Insert after the comment (or at the end of head if comment not found)
					if (transformedHtml.includes('<!-- Preload critical images -->')) {
						transformedHtml = transformedHtml.replace(
							/(<!--\s*Preload critical images\s*-->)/,
							`$1\n${preloadLinks}`
						);
					} else {
						// Insert before closing head tag
						transformedHtml = transformedHtml.replace(
							/(<\/head>)/,
							`\t<!-- Preload critical images -->\n${preloadLinks}\n$1`
						);
					}
				}

				return transformedHtml;
			} catch (error) {
				console.warn('⚠️  Failed to load site config, using default values:', error.message);
				return html;
			}
		}
	};
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, m => map[m]);
}

