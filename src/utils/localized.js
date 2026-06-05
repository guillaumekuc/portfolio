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

const CATEGORY_SLUG = {
	'Card Design': 'cardDesign',
	'Character Design': 'characterDesign',
	'Character Lineup': 'characterLineup',
	'Character Model': 'characterModel',
	'Character Model & Rig': 'characterModelRig',
	'Character Portrait': 'characterPortrait',
	'Character Sheet': 'characterSheet',
	'Color Study': 'colorStudy',
	'Cover Art': 'coverArt',
	'Creature Sheet': 'creatureSheet',
	'Expression Sheet': 'expressionSheet',
	'Form & Value Study': 'formValueStudy',
	'Graduation Short Film': 'graduationShortFilm',
	'Hard-surface Model': 'hardSurfaceModel',
	'Interior Model': 'interiorModel',
	'Keyframe Illustration': 'keyframeIllustration',
	'Keyframe Line Art': 'keyframeLineArt',
	'Landscape Illustration': 'landscapeIllustration',
	'Perspective Study': 'perspectiveStudy'
};

export function categoryLabel(locale, englishCategory) {
	if (!englishCategory) return '';
	if (locale === 'en') return englishCategory;
	const slug = CATEGORY_SLUG[englishCategory];
	if (!slug) return englishCategory;
	const key = `portfolio.category.${slug}`;
	const translated = t(locale, key);
	return translated !== key ? translated : englishCategory;
}

/** "Collection #1" → translated; leaves other names unchanged */
export function collectionDisplayName(locale, name) {
	if (!name) return '';
	const m = name.match(/^Collection #(\d+)$/);
	if (!m) return name;
	return t(locale, 'music.collectionN', { n: m[1] });
}

export function miscellaneousSubtitle(locale, subtitle) {
	if (subtitle === 'Miscellaneous') {
		return t(locale, 'music.miscellaneous');
	}
	return subtitle;
}
