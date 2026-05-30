/**
 * Web Component: MainHeader
 * Define um header institucional responsivo com efeito translúcido no scroll e menu mobile hamburger.
 */
class MainHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="landing-header" id="landing-header">
        <div class="header-container">
          <a href="#inicio" class="header-logo">
            <img src="./logo_atual.png" alt="Logo Academia do Extrajudicial" class="header-logo-img">
          </a>
          
          <button class="menu-toggle" id="menu-toggle" aria-label="Abrir Menu de Navegação" aria-expanded="false">
            <!-- Menu Mobile (Hambúrguer) -->
            <svg class="hamburger-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <!-- Ícone Fechar (X) -->
            <svg class="close-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <nav class="header-nav" id="header-nav" aria-label="Navegação do Site">
            <ul class="header-menu">
              <li><a href="#inicio" class="menu-link active">Início</a></li>
              <li><a href="#cursos" class="menu-link">Cursos</a></li>
              <li><a href="#trilhas" class="menu-link">Trilhas</a></li>
              <li><a href="#certificados" class="menu-link">Certificados</a></li>
              <li><a href="#institucional" class="menu-link">Institucional</a></li>
              <li><a href="#contato" class="menu-link">Contato</a></li>
            </ul>
            <div class="header-actions">
              <a href="./dashboard.html" class="btn btn-outline">Entrar</a>
              <a href="./dashboard.html" class="btn btn-filled">Cadastrar</a>
            </div>
          </nav>
        </div>
      </header>
      <div class="menu-backdrop" id="menu-backdrop"></div>
    `;

    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  }

  /**
   * Altera o estilo do Header quando o scroll da página é ativado (transparente -> sólido)
   */
  setupScrollEffect() {
    const header = this.querySelector('#landing-header');
    if (!header) return;
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('solid');
      } else {
        header.classList.remove('solid');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Executa uma vez no início para caso a página já carregue com scroll
    handleScroll();
  }

  /**
   * Gerencia a abertura e fechamento do menu hamburger em dispositivos móveis
   */
  setupMobileMenu() {
    const toggle = this.querySelector('#menu-toggle');
    const nav = this.querySelector('#header-nav');
    const backdrop = this.querySelector('#menu-backdrop');
    const hamburgerIcon = this.querySelector('.hamburger-icon');
    const closeIcon = this.querySelector('.close-icon');
    
    if (!toggle || !nav) return;

    const toggleMenu = (forceClose = null) => {
      const isOpen = forceClose !== null ? !forceClose : nav.classList.contains('open');
      const expanded = !isOpen;
      
      toggle.setAttribute('aria-expanded', expanded);
      nav.classList.toggle('open', expanded);
      toggle.classList.toggle('active', expanded);
      
      if (backdrop) {
        backdrop.classList.toggle('active', expanded);
      }
      
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.style.display = expanded ? 'none' : 'block';
        closeIcon.style.display = expanded ? 'block' : 'none';
      }
      
      document.body.style.overflow = expanded ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => toggleMenu());

    if (backdrop) {
      backdrop.addEventListener('click', () => toggleMenu(true));
    }

    // Fecha o menu móvel ao selecionar qualquer link de âncora
    const links = this.querySelectorAll('.menu-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(true);
      });
    });
  }

  /**
   * Configura o comportamento de Scroll Suave nas âncoras da página e marca links ativos
   */
  setupSmoothScroll() {
    const links = this.querySelectorAll('.menu-link');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Atualiza o estado ativo
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });

    // Observador de interseção para ativar dinamicamente os links durante o scroll
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Aciona quando a seção está no meio da tela
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

customElements.define('main-header', MainHeader);
export { MainHeader };
