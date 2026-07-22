import { defineConfig } from 'vite';

// Для GitHub Pages: имя репозитория (workflow подставляет автоматически)
const REPO_NAME = process.env.GITHUB_PAGES_BASE || '/rezume/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_NAME : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
}));
