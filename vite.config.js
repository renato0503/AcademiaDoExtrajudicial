import { defineConfig } from 'vite';

/**
 * 📝 Nota Tech Lead:
 * Configuração do Vite para deploy no GitHub Pages.
 * A propriedade `base` define o subcaminho do repositório no GitHub Pages.
 */
export default defineConfig({
  base: '/AcademiaDoExtrajudicial/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Garantir que o build gere arquivos semânticos organizados
    sourcemap: true
  }
});
