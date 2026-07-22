import { defineConfig } from 'vite';

const REPO_NAME = process.env.GITHUB_PAGES_BASE || '/rezume/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_NAME : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2020',
    cssMinify: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
        },
      },
    },
  },
}));
