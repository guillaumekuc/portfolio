/**
 * Utility class for time-related operations
 */
export class Time {
	/**
	 * Formats seconds into MM:SS format
	 * @param {number} seconds - Time in seconds
	 * @returns {string} Formatted time string (e.g., "3:45")
	 */
	static formatTime(seconds) {
		const m = Math.floor(seconds / 60);
		let s = Math.floor(seconds % 60);
		s = (s >= 10) ? s : "0" + s;
		return m + ":" + s;
	}
}
