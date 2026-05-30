# 🎨 Agente: UI/UX & Design System

## 🎯 Objetivo
Garantir interface premium, altamente customizável, responsiva e acessível, alinhada à identidade visual da instituição e às diretrizes de UX corporativa.

---

## 📱 Design System Implementado

### Cores (CSS Variables)
```css
:root {
  --blue-deep: #0B1B5E;      /* Primary - azul escuro */
  --blue-medium: #172B7A;     /* Header mobile mais claro */
  --teal: #39C2D7;           /* Accent - azul Tiffany */
  --teal-light: #7DD3E0;      /* Teal hover state */
  --teal-gradient: linear-gradient(135deg, #39C2D7 0%, #7DD3E0 100%);
  
  --bg-white: #FFFFFF;
  --bg-light: #F4F6FA;
  --bg-card: #FFFFFF;
  
  --text-primary: #0B1B5E;
  --text-secondary: #6E6E73;
  --text-light: #8E8E93;
  --text-white: #FFFFFF;
}
```

### Tipografia
- **Display:** Montserrat (400, 500, 600, 700, 800)
- **Body:** Lato (300, 400, 700, italic)
- **Fallback:** system-ui, sans-serif

### Breakpoints Responsivos
| Dispositivo | Largura | Comportamento |
|-------------|---------|---------------|
| Mobile | < 768px | Layout vertical, menu flutuante losango |
| Tablet | 768px - 1023px | Layout simplificado |
| Desktop | ≥ 1024px | Header glassmorphism, layout completo |

---

## 🎯 Princípios de Design

### 1. Mobile-First
- Estilos base são mobile
- Media queries para desktop (`min-width`)
- Touch targets de 44px mínimo

### 2. Contraste para Logo
- Header mobile usa `--blue-medium` (mais claro) para contrastar com logo sem fundo
- Evita saturação excessiva

### 3. Componentização
- Web Components para reutilização
- CSS Variables para theming
- Sem bibliotecas externas (CSS puro)

---

## 🎨 Componentes UI

### Botão Flutuante Mobile (Losango)
```css
.floating-menu-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 56px;
  height: 56px;
  background: var(--teal);  /* Azul Tiffany #39C2D7 */
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(57, 194, 215, 0.4);
}
```
- Rotação de 45° para parecer losango
- Ícone com `transform: rotate(-45deg)` para ficar reto
- Fecha ao clicar fora ou no próprio botão

### Menu Expandido Mobile
- Centralizado acima do botão
- Border-radius grande (16px)
- Sombra suave
- Alça decorativa no topo

### Header Desktop (Glassmorphism)
```css
.landing-header {
  position: fixed;
  background: rgba(244, 246, 250, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(30, 42, 90, 0.08);
}
```

---

## ⚠️ Guardrails

1. **Zero `!important`** - usar especificidade corretamente
2. **Zero cores hardcoded** - usar CSS Variables
3. **Zero `px` para espaçamentos** - usar `rem`/`em`
4. **Lighthouse > 90** em Performance, Accessibility, Best Practices
5. **Nunca usar frameworks CSS** - CSS puro + variáveis
6. **Testar em Chrome, Firefox, Safari, Edge**

---

## 📥 Como Invocar
`"Ative ui_ux_e_design_system.md e gere o componente [nome] seguindo as diretrizes de tema e responsividade."`

---

*Documento atualizado em: 30/05/2026*
*Versão: 2.0*