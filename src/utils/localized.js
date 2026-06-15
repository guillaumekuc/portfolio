import { t } from './i18n.js';

/**
 * Config values can be a plain string (all locales) or { en, fr, ... }.
 */
export function L(value, locale) {
	if (value == null || value === '') return '';
	if (typeof value === 'string') return value;
	if (typeof value === 'object' && !Array.isArray(value)) {
		const v = value[locale] ?? value.en ?? value.fr;
		return v != null ? String(v) : '';
	}
	return String(value);
}

/** portfolio.json paths like chordex.md → chordex.fr.md */
export function resolveLocalizedMarkdownPath(path, locale) {
	if (!path || locale === 'en') return path;
	return path.replace(/\.md$/i, `.${locale}.md`);
}


/** "Collection #1" → translated; object {en, fr} → localized; plain string → as-is */
export function collectionDisplayName(locale, name) {
	if (!name) return '';
	if (typeof name === 'object') return L(name, locale);
	const m = name.match(/^Collection #(\d+)$/);
	if (!m) return name;
	return t(locale, 'music.collectionN', { n: m[1] });
}

