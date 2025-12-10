// Simple performance measurement utility
export function initPerformance() {
	window.addEventListener('load', () => {
		// Capture navigation timing (starts from page navigation)
		const navTiming = performance.getEntriesByType('navigation')[0];
		const legacyTiming = performance.timing;

		// Total load time
		let totalLoadTimeMs = performance.now(); // fallback: since navigation start
		if (navTiming && navTiming.loadEventEnd > 0) {
			totalLoadTimeMs = navTiming.loadEventEnd;
		} else if (legacyTiming && legacyTiming.loadEventEnd > 0) {
			totalLoadTimeMs = legacyTiming.loadEventEnd - legacyTiming.navigationStart;
		}
		console.log(`⚡ Page loaded in ${(totalLoadTimeMs / 1000).toFixed(2)}s`);

		if (navTiming && navTiming.loadEventEnd > 0) {
			console.log('⏱️ Breakdown:');
			console.log(`   DNS: ${((navTiming.domainLookupEnd - navTiming.domainLookupStart) / 1000).toFixed(2)}s`);
			console.log(`   TCP: ${((navTiming.connectEnd - navTiming.connectStart) / 1000).toFixed(2)}s`);
			console.log(`   TTFB: ${((navTiming.responseStart - navTiming.requestStart) / 1000).toFixed(2)}s`);
			console.log(`   Download: ${((navTiming.responseEnd - navTiming.responseStart) / 1000).toFixed(2)}s`);
			console.log(`   DOM Processing: ${((navTiming.domComplete - navTiming.domInteractive) / 1000).toFixed(2)}s`);
			console.log(`   JS Execution: ${((navTiming.domInteractive - navTiming.responseEnd) / 1000).toFixed(2)}s`);
		} else if (legacyTiming && legacyTiming.loadEventEnd > 0) {
			console.log('⏱️ Breakdown (legacy timing):');
			console.log(`   DNS: ${((legacyTiming.domainLookupEnd - legacyTiming.domainLookupStart) / 1000).toFixed(2)}s`);
			console.log(`   TCP: ${((legacyTiming.connectEnd - legacyTiming.connectStart) / 1000).toFixed(2)}s`);
			console.log(`   TTFB: ${((legacyTiming.responseStart - legacyTiming.requestStart) / 1000).toFixed(2)}s`);
			console.log(`   Download: ${((legacyTiming.responseEnd - legacyTiming.responseStart) / 1000).toFixed(2)}s`);
			console.log(`   DOM Processing: ${((legacyTiming.domComplete - legacyTiming.domInteractive) / 1000).toFixed(2)}s`);
			console.log(`   JS Execution: ${((legacyTiming.domInteractive - legacyTiming.responseEnd) / 1000).toFixed(2)}s`);
		} else {
			console.log('⏱️ Breakdown not available (navigation timings missing)');
		}

		// Show largest resources
		const resources = performance.getEntriesByType('resource');
		const sorted = resources
			.filter((r) => r.transferSize > 0)
			.sort((a, b) => b.transferSize - a.transferSize)
			.slice(0, 5);

		console.log('📦 Top 5 largest resources:');
		sorted.forEach((r) => {
			const size = (r.transferSize / 1024).toFixed(1);
			const time = (r.duration / 1000).toFixed(2);
			const name = r.name.split('/').pop();
			console.log(`   ${size} KB - ${time}s - ${name}`);
		});

		// Show slowest resources (by duration, not size)
		const slowest = resources
			.filter((r) => r.duration > 0)
			.sort((a, b) => b.duration - a.duration)
			.slice(0, 3);
		
		if (slowest.length > 0) {
			console.log('🐢 Slowest resources (by time):');
			slowest.forEach((r) => {
				const time = (r.duration / 1000).toFixed(2);
				const name = r.name.split('/').pop();
				console.log(`   ${time}s - ${name}`);
			});
		}
	});
}
