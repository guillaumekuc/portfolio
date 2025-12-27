import { defineConfig } from 'vite';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { htmlConfig } from './vite-plugin-html-config.js';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [svelte(), htmlConfig()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['jquery', 'slick-carousel']
  }
});

