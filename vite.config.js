import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * 📝 Nota Tech Lead:
 * Configuração do Vite para deploy no GitHub Pages com suporte a Multi-Page App (MPA).
 * Define index.html (Landing Page) e dashboard.html (Painel de Cursos) como entradas.
 */
export default defineConfig({
  base: '/AcademiaDoExtrajudicial/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html')
      }
    }
  }
});
