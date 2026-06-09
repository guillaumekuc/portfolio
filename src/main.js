import App from './App.svelte';
import { initPerformance } from './utils/performance.js';
import './utils/i18n.js';

initPerformance();

history.scrollRestoration = 'manual';
document.documentElement.scrollTop = 0;

const app = new App({
	target: document.getElementById('app')
});

export default app;
