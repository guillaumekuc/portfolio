import App from './App.svelte';
import { initPerformance } from './utils/performance.js';
import './utils/i18n.js';

initPerformance();

const app = new App({
	target: document.getElementById('app')
});

export default app;
