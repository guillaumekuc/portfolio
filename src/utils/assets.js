/**
 * Simple asset URL resolver
 * If baseUrl is set, prepends it to paths starting with /sound/, /vid/, or /img/portfolio/
 */
import assetsConfig from '../config/assets.json';

export function getAssetUrl(path) {
	if (!path || path.startsWith('http://') || path.startsWith('https://')) return path;
	if (!assetsConfig.baseUrl) return path;
	const base = assetsConfig.baseUrl.replace(/\/$/, '');
	if (path.startsWith('/sound/') || path.startsWith('/vid/') || path.startsWith('/img/portfolio/') || path.startsWith('/img/guillaumekuc_')) {
		return base + path;
	}
	return path;
}

