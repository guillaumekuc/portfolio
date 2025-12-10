import App from './App.svelte';
import { initPerformance } from './utils/performance.js';

initPerformance();

const app = new App({
	target: document.getElementById('app')
});

export default app;
