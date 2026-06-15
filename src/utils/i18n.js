import { writable } from 'svelte/store';
import { Storage, STORAGE_KEYS } from './storage.js';
import languagesConfig from '../config/languages.json';
import siteConfig from '../config/site.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

const catalogs = { en, fr };

const allowedLocales = new Set(languagesConfig.options.map((o) => o.id));

/**
 * Read persisted or configured locale; must be one of languages.json options.
 */
export function getInitialLocale() {
	if (typeof localStorage === 'undefined') {
		const fallback = siteConfig.lang;
		return allowedLocales.has(fallback) ? fallback : languagesConfig.defaultLocale;
	}
	const saved = Storage.get(STORAGE_KEYS.LOCALE, null);
	if (saved && allowedLocales.has(saved)) {
		return saved;
	}
	const site = siteConfig.lang;
	if (site && allowedLocales.has(site)) {
		return site;
	}
	return languagesConfig.defaultLocale;
}

function lookup(locale, key) {
	const cat = catalogs[locale] || catalogs.en;
	const primary = cat[key];
	if (primary !== undefined && primary !== null) {
		return String(primary);
	}
	const fb = catalogs.en[key];
	return fb !== undefined && fb !== null ? String(fb) : key;
}

/**
 * @param {string} locale
 * @param {string} key
 * @param {Record<string, string | number>} [vars] - e.g. { label: 'English' } for "Hello {label}"
 */
export function t(locale, key, vars) {
	let str = lookup(locale, key);
	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			str = str.replaceAll(`{${k}}`, String(v));
		}
	}
	return str;
}

export const locale = writable(getInitialLocale());

locale.subscribe((value) => {
	if (typeof document !== 'undefined') {
		document.documentElement.lang = value;
	}
	if (typeof localStorage !== 'undefined') {
		Storage.set(STORAGE_KEYS.LOCALE, value);
	}
});
