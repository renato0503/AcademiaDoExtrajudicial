/**
 * Web Component: MainHeader
 * Header institucional (desktop) + Floating Menu Button (mobile)
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

      <!-- Mobile Floating Menu Button (hidden by default) -->
      <div class="mobile-bottom-nav" id="mobile-bottom-nav">
        <button class="floating-menu-btn" id="floating-menu-btn" aria-label="Abrir Menu" aria-expanded="false">
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="display: none;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <!-- Expanded Navigation Menu -->
        <div class="mobile-nav-expanded" id="mobile-nav-expanded">
          <button class="nav-close-btn" id="nav-close-btn" aria-label="Fechar Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <a href="#inicio" class="nav-expanded-item active" data-section="inicio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Início</span>
          </a>
          <a href="#cursos" class="nav-expanded-item" data-section="cursos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>Cursos</span>
          </a>
          <a href="#trilhas" class="nav-expanded-item" data-section="trilhas">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span>Trilhas</span>
          </a>
          <a href="#certificados" class="nav-expanded-item" data-section="certificados">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            <span>Certificados</span>
          </a>
          <a href="#institucional" class="nav-expanded-item" data-section="institucional">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Institucional</span>
          </a>
          <a href="#contato" class="nav-expanded-item" data-section="contato">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span>Contato</span>
          </a>
          <div class="nav-expanded-divider"></div>
          <a href="./dashboard.html" class="nav-expanded-item cta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Entrar</span>
          </a>
        </div>
        
        <!-- Backdrop -->
        <div class="mobile-menu-backdrop" id="mobile-menu-backdrop"></div>
      </div>
    `;

    this.setupDesktopHeader();
    this.setupMobileFloatingMenu();
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

  setupMobileFloatingMenu() {
    const menuBtn = this.querySelector('#floating-menu-btn');
    const navExpanded = this.querySelector('#mobile-nav-expanded');
    const backdrop = this.querySelector('#mobile-menu-backdrop');
    const closeBtn = this.querySelector('#nav-close-btn');
    const navItems = this.querySelectorAll('.nav-expanded-item');

    if (!menuBtn || !navExpanded) return;

    const menuIcon = menuBtn.querySelector('.menu-icon');
    const closeIcon = menuBtn.querySelector('.close-icon');

    const openMenu = () => {
      navExpanded.classList.add('open');
      backdrop.classList.add('active');
      menuBtn.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      navExpanded.classList.remove('open');
      backdrop.classList.remove('active');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', () => {
      if (navExpanded.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Handle nav item clicks
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        
        // If not an internal anchor, allow default behavior
        if (!href || !href.startsWith('#')) {
          closeMenu();
          return;
        }

        e.preventDefault();
        const targetId = href;
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