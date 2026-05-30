/**
 * Web Component: MainHeader
 * Header institucional com menu responsivo e navegação fluida.
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
      <div class="menu-backdrop" id="menu-backdrop"></div>
    `;

    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  }

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
    handleScroll();
  }

  setupMobileMenu() {
    const toggle = this.querySelector('#menu-toggle');
    const nav = this.querySelector('#header-nav');
    const backdrop = this.querySelector('#menu-backdrop');
    
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove('open');
      backdrop.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      nav.classList.add('open');
      backdrop.classList.add('active');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    // Fecha menu ao clicar em link
    const links = nav.querySelectorAll('.menu-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        closeMenu();
        
        setTimeout(() => {
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    });
  }

  setupSmoothScroll() {
    // Observador para marcar link ativo durante scroll
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