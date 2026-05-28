# 💻 Stack e Padrões de Desenvolvimento

## 🎯 Objetivo
Garantir código limpo, performático e fácil de customizar, usando apenas JS/HTML/CSS puros + Firebase v9 modular.

## 🧱 Estrutura de Pastas
```
/src
  /components     (header, course-card, progress-bar, theme-loader, etc.)
  /services       (auth.js, firestore.js, storage.js, pdf.js, gamification.js)
  /utils          (formatters.js, validators.js, constants.js, theme.js)
  /styles         (main.css, variables.css, utilities.css, components.css)
  /pages          (dashboard, course-player, admin-panel, certificate, login)
/public
  /assets         (icons, fallbacks, logo)
  index.html
firebase.json     (config de hosting, storage, firestore)
```

## 📜 Padrões de Código
- **JS**: ES6+ modules, `const`/`let` obrigatório, funções pequenas (<30 linhas), JSDoc in `services/`.
- **HTML**: Semântico (`<section>`, `<article>`, `<nav>`), `aria-*` onde necessário, evitar inline styles.
- **CSS**: Mobile-first, CSS Variables para tema, Flexbox/Grid, BEM ou utilitários leves. Zero `!important`.
- **Componentização**: Use `document.createElement()`, `template` tags ou Web Components simples. Eventos delegados.
- **Estado**: Gerenciado em objetos imutáveis. Nunca modifique props do Firebase diretamente. Use `updateDoc()`.

## 🔌 Integração Firebase
- Use **SDK v9 modular**: `import { getFirestore, doc, getDoc } from "firebase/firestore";`
- Inicialize em `app.js` com `initializeApp(firebaseConfig)`.
- `firebaseConfig` em variáveis de ambiente ou `config.js` não versionado.
- Regras de Firestore devem ser testadas localmente com `firebase emulators:start`.
- Use `onSnapshot()` apenas para UIs em tempo real. Prefira `getDoc()/getDocs()` para listas estáticas.

## 🎨 Customização e Responsividade
- Breakpoints: `320px`, `768px`, `1024px`, `1440px`.
- Grid fluido: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`
- Imagens/vídeos: `max-width: 100%; height: auto;`, `loading="lazy"`, `decoding="async"`.
- Fonte: `clamp(1rem, 1.5vw, 1.25rem)` para texto base.
- Tema dinâmico: Busque `theme/{branchId}` no `DOMContentLoaded`, injete em `:root`.

## 🧪 Testes e Validação
- Teste em Chrome, Firefox, Safari, Edge (desktop + mobile).
- Valide formulários com `constraint validation API` + feedback visual.
- Simule offline: `navigator.onLine`, cache básico com `localStorage` para progresso pendente.
- Use `console.warn()` para regras de negócio violadas, nunca `console.log()` em prod.

## ⚠️ Guardrails
- Nunca exponha chaves de API ou URLs de Storage no HTML.
- Não use `innerHTML` sem sanitização. Prefira `textContent` ou `DOMParser`.
- Limite `onSnapshot` listeners. Desregistre com `unsubscribe()` no `beforeunload`.
- Commit message: `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`.
- Sempre inclua `try/catch` com fallback UI em chamadas Firebase.
- Documente contratos de dados in `utils/constants.js` como objetos imutáveis.
```
