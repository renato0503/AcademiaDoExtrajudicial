/**
 * Componente: Landing Page (landing.js)
 * Controla os efeitos dinâmicos, lazy loading de imagens, animações ao scroll
 * e atalhos de teclado (pesquisa Ctrl+K) na página institucional.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initLazyLoading();
  initSearchModal();
  initHeaderEffects();
});

/**
 * 1. Animações de Entrada ao Scroll (Intersection Observer)
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-active');
        // Uma vez animado, não precisamos mais observar
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Selecionar elementos para observar
  const animElements = document.querySelectorAll(
    '.course-card, .beneficio-row, .sobre-card, .section-header, .cta-final-container'
  );
  
  animElements.forEach((el, index) => {
    // Adiciona classe de animação base
    el.classList.add('animate-ready');
    // Adiciona delay incremental (stagger effect) para elementos vizinhos
    const delayClass = `animate-delay-${(index % 3) + 1}`;
    el.classList.add(delayClass);
    
    scrollObserver.observe(el);
  });
}

/**
 * 2. Lazy Loading de Imagens de Fundo (Curso Thumbnails)
 */
function initLazyLoading() {
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.bg) {
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          el.classList.add('bg-loaded');
        }
        bgObserver.unobserve(el);
      }
    });
  }, {
    rootMargin: '100px' // Pré-carrega 100px antes de entrar na tela
  });

  const lazyBgs = document.querySelectorAll('.lazy-load-bg');
  lazyBgs.forEach(el => {
    bgObserver.observe(el);
  });
}

/**
 * 3. Modal de Pesquisa Rápida (Ctrl + K)
 */
function initSearchModal() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results-list');
  const btnClose = document.getElementById('btn-close-search');

  if (!modal || !input || !resultsContainer) return;

  const mockCourses = [
    { title: 'Direito Notarial e Registral', url: './dashboard.html', desc: 'A base teórica e as normas práticas essenciais para atuação no extrajudicial.' },
    { title: 'LGPD para Cartórios', url: './dashboard.html', desc: 'Adaptação de serventias extrajudiciais à Lei Geral de Proteção de Dados.' },
    { title: 'Tecnologia para Serventias', url: './dashboard.html', desc: 'Modernização, conformidade técnica e segurança da informação.' },
    { title: 'Gestão de Cartórios', url: './dashboard.html', desc: 'Liderança, eficiência operacional e governança de serventias.' }
  ];

  const openSearch = () => {
    modal.classList.add('open');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 100);
    document.body.style.overflow = 'hidden'; // Evita scroll do fundo
  };

  const closeSearch = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Atalho de Teclado Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeSearch();
    }
  });

  if (btnClose) {
    btnClose.addEventListener('click', closeSearch);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSearch();
    }
  });

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  function renderResults(query) {
    resultsContainer.innerHTML = '';
    const cleanQuery = query.toLowerCase().trim();
    const filtered = mockCourses.filter(c => c.title.toLowerCase().includes(cleanQuery));

    if (filtered.length === 0) {
      resultsContainer.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">Nenhum curso encontrado.</div>';
      return;
    }

    filtered.forEach(c => {
      const item = document.createElement('a');
      item.href = c.url;
      item.className = 'search-item-hover';
      item.style.display = 'block';
      item.style.padding = '12px var(--space-md)';
      item.style.borderRadius = 'var(--radius-sm)';
      item.style.border = '1px solid rgba(11, 27, 94, 0.06)';
      item.style.textDecoration = 'none';
      item.style.color = 'var(--text-primary)';
      item.style.transition = 'all 0.2s';
      
      item.innerHTML = `
        <div style="font-weight: 700; color: var(--blue-deep); font-size: 0.95rem; margin-bottom: 2px;">${c.title}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${c.desc}</div>
      `;
      
      resultsContainer.appendChild(item);
    });
  }
}

/**
 * 4. Efeito de Scroll no Header (compensa e otimiza o Web Component)
 */
function initHeaderEffects() {
  const header = document.querySelector('.landing-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}
