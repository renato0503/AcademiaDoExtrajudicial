import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase.js";

/**
 * Theme Loader - Injeta variáveis CSS dinâmicas baseadas no Firestore.
 * Segue as diretrizes de UI/UX e Design System do projeto.
 */
class ThemeLoader {
  constructor() {
    this.root = document.documentElement;
    this.defaultTheme = {
      primary: '#1E2A5A',
      secondary: '#87CECA',
      background: '#F4F6FA',
      text: '#FFFFFF'
    };
  }

  /**
   * Sanitiza a cor hex para evitar injeções arbitrárias de código CSS.
   * @param {string} color 
   * @returns {boolean}
   */
  isValidHexColor(color) {
    return typeof color === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(color);
  }

  async loadTheme(branchId) {
    // Caso o banco de dados do Firebase não esteja inicializado (modo de demonstração)
    if (!db) {
      console.warn('⚠️ Firebase não inicializado. Aplicando tema padrão.');
      this.applyTheme(this.defaultTheme);
      return;
    }

    try {
      const themeRef = doc(db, 'theme', branchId);
      const docSnap = await getDoc(themeRef);

      if (docSnap.exists()) {
        const theme = docSnap.data();
        this.applyTheme(theme);
      } else {
        console.info('ℹ️ Tema customizado não encontrado no Firestore. Usando fallback padrão.');
        this.applyTheme(this.defaultTheme);
      }
    } catch (error) {
      console.warn('⚠️ Falha ao buscar tema do Firestore. Fallback para tema padrão:', error);
      this.applyTheme(this.defaultTheme);
    }
  }

  applyTheme(theme) {
    // Sanitização e validação das cores injetadas
    const primaryColor = this.isValidHexColor(theme.primary) ? theme.primary : this.defaultTheme.primary;
    const secondaryColor = this.isValidHexColor(theme.secondary) ? theme.secondary : this.defaultTheme.secondary;

    // Cores principais no root
    this.root.style.setProperty('--primary', primaryColor);
    this.root.style.setProperty('--secondary', secondaryColor);

    // Gradientes dinâmicos calculados com segurança
    this.root.style.setProperty('--blue-gradient', 
      `linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor}E6 50%, ${primaryColor}A3 100%)`
    );
    
    // Teal sempre mantido como marca registrada decorativa
    this.root.style.setProperty('--teal', secondaryColor);

    console.log('✅ Tema configurado com sucesso.');
  }
}

// Inicialização segura após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ThemeLoader();
  loader.loadTheme('branch_main');
});

export { ThemeLoader };
