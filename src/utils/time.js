// Time formatting utilities
export class Time {
	// Formats seconds into MM:SS format
	static formatTime(seconds) {
		const m = Math.floor(seconds / 60);
		let s = Math.floor(seconds % 60);
		s = s >= 10 ? s : '0' + s;
		return m + ':' + s;
	}
}
