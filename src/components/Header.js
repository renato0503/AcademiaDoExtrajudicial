/**
 * Web Component: MainHeader
 * Header institucional (desktop) + Bottom Nav (mobile)
 */
class MainHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <!-- Desktop Header (hidden on mobile) -->
      <header class="landing-header" id="landing-header">
        <div class="header-container">
          <a href="#inicio" class="header-logo">
            <img src="./logo_atual.png" alt="Logo Academia do Extrajudicial" class="header-logo-img">
          </a>
          
          <button class="menu-toggle" id="menu-toggle" aria-label="Abrir Menu de Navegação" aria-expanded="false">
            <span class="hamburger-lines">
              <span class="line line-1"></span>
              <span class="line line-2"></span>
              <span class="line line-3"></span>
            </span>
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

      <!-- Mobile Bottom Navigation -->
      <nav class="mobile-bottom-nav" id="mobile-bottom-nav" aria-label="Navegação Mobile">
        <a href="#inicio" class="bottom-nav-item active" data-section="inicio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Início</span>
        </a>
        <a href="#cursos" class="bottom-nav-item" data-section="cursos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span>Cursos</span>
        </a>
        <a href="#trilhas" class="bottom-nav-item" data-section="trilhas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>Trilhas</span>
        </a>
        <a href="./dashboard.html" class="bottom-nav-item cta-btn" data-section="cta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </a>
        <a href="#certificados" class="bottom-nav-item" data-section="certificados">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <span>Certs</span>
        </a>
        <a href="#contato" class="bottom-nav-item" data-section="contato">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>Contato</span>
        </a>
      </nav>
      
      <div class="menu-backdrop" id="menu-backdrop"></div>
    `;

    this.setupDesktopHeader();
    this.setupMobileBottomNav();
    this.setupSmoothScroll();
  }

  setupDesktopHeader() {
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
    handleScroll();
  }

  setupMobileBottomNav() {
    const bottomNav = this.querySelector('#mobile-bottom-nav');
    const navItems = bottomNav.querySelectorAll('.bottom-nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        
        // Se não é link interno (CTA), não previne
        if (!href.startsWith('#')) return;
        
        e.preventDefault();
        const targetId = href;
        const target = document.querySelector(targetId);
        
        if (target) {
          // Remove active de todos
          navItems.forEach(nav => nav.classList.remove('active'));
          // Adiciona active ao clicado
          item.classList.add('active');
          
          // Scroll suave
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Observador para ativar item baseado na seção visível
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            if (item.dataset.section === id) {
              item.classList.add('active');
            } else if (!item.classList.contains('cta-btn')) {
              item.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  setupSmoothScroll() {
    const links = this.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
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