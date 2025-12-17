/**
 * Email obfuscation utility
 * Assembles email address at runtime to protect from bot scrapers
 */

/**
 * Assembles the email address at runtime
 * @returns {string} The complete email address
 */
export function getEmail() {
	const parts = ['guillaume', 'guillaumekuc', 'com'];
	return `${parts[0]}@${parts[1]}.${parts[2]}`;
}

/**
 * Generates a mailto URL with the email
 * @returns {string} The mailto URL
 */
export function getMailtoUrl() {
	return `mailto:${getEmail()}`;
}

/**
 * Opens the email client with the assembled email
 */
export function openEmail() {
	window.open(getMailtoUrl(), 'mail');
}

