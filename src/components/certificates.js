/**
 * Componente: Certificados (certificates.js)
 * Controla a lógica de alternância de abas do painel, visualização do certificado em modal e download do PDF via jsPDF.
 * 
 * Abordagem: Usa a imagem de template do certificado como plano de fundo e
 * sobrepõe apenas os dados dinâmicos (nome, curso, datas, QR code, número).
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCertificatesModal();
  initMobileDrawer();
  initQuickSearch();
  initPullToRefresh();
  initSkeletonLoaders();
  initProgressBars();
  initRippleEffects();
  initDirectDownload();
});

/**
 * 1. Gerenciamento de Abas do Painel
 */
function initTabs() {
  const links = document.querySelectorAll('.nav-link, .bottom-nav-link, .drawer-link');
  const tabContents = document.querySelectorAll('.tab-content');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const linkId = link.getAttribute('id') || '';
      let targetTabId = '';

      if (linkId.includes('dashboard')) {
        targetTabId = 'tab-dashboard-content';
      } else if (linkId.includes('courses')) {
        targetTabId = 'tab-courses-content';
      } else if (linkId.includes('certificates')) {
        targetTabId = 'tab-certificates-content';
      } else if (linkId.includes('progress')) {
        targetTabId = 'tab-progress-content';
      } else if (linkId.includes('favorites')) {
        targetTabId = 'tab-favorites-content';
      } else if (linkId.includes('history')) {
        targetTabId = 'tab-history-content';
      } else if (linkId.includes('settings')) {
        targetTabId = 'tab-settings-content';
      }

      if (targetTabId) {
        // Sincroniza estado ativo em todos os menus (sidebar, bottom-nav e drawer)
        links.forEach(l => {
          const lId = l.getAttribute('id') || '';
          const getBaseName = (id) => id.replace('nav-', '').replace('bottom-nav-', '').replace('drawer-', '');
          if (getBaseName(lId) === getBaseName(linkId)) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });

        // Alterna a visibilidade das abas
        tabContents.forEach(tab => {
          tab.classList.remove('active');
          if (tab.getAttribute('id') === targetTabId) {
            tab.classList.add('active');
          }
        });

        // Fecha o drawer mobile se estivesse aberto
        if (window.closeMobileDrawer) {
          window.closeMobileDrawer();
        }

        // Se voltar para a aba de painel, reinicia a animação das barras
        if (targetTabId === 'tab-dashboard-content') {
          triggerProgressBarAnimation();
        }

        // Exibe o esqueleto de carregamento temporário para fidelidade de UX
        showTabSkeleton(targetTabId);
      }
    });
  });
}

/**
 * 2. Gerenciamento do Modal de Certificados
 */
let currentCertData = null; // Guarda os dados do certificado selecionado
let qrcodeBase64 = null;    // Guarda o base64 do QR code para download offline
let templateBase64 = null;  // Guarda o base64 da imagem de template para o PDF

function initCertificatesModal() {
  const modal = document.getElementById('certificate-modal');
  const btnViewCerts = document.querySelectorAll('.btn-view-cert');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCloseModalX = document.getElementById('btn-close-modal-x');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  if (!modal) return;

  // Pré-carregar imagem do template para uso no PDF
  loadTemplateImage();

  // Abertura do modal ao clicar em Visualizar Certificado
  btnViewCerts.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Extrair informações do botão
      const courseId = btn.getAttribute('data-course-id');
      const courseTitle = btn.getAttribute('data-course-title');
      const workload = btn.getAttribute('data-workload');
      const teacherName = btn.getAttribute('data-teacher-name');
      const teacherSignature = btn.getAttribute('data-teacher-signature');
      const startDate = btn.getAttribute('data-start-date');
      const endDate = btn.getAttribute('data-end-date');

      // Gerar IDs e hashes únicos fictícios para validação (boas práticas de auditoria)
      const randomIdSuffix = Math.floor(10000 + Math.random() * 90000);
      const certificateId = `AE-2026-${randomIdSuffix}`;
      const mockHash = generateSHA256Mock(certificateId + courseId);
      const validationUrl = `https://renato0503.github.io/AcademiaDoExtrajudicial/validate?hash=${mockHash}`;

      currentCertData = {
        studentName: 'Renato Rosa', // Aluno logado default
        courseTitle,
        workload,
        teacherName,
        teacherSignature,
        startDate,
        endDate,
        certificateId,
        hash: mockHash,
        validationUrl,
        issueDate: '29 de Maio de 2026'
      };

      // Atualizar campos dinâmicos sobrepostos à imagem de fundo
      const studentOverlay = document.querySelector('#cert-student-overlay div');
      if (studentOverlay) studentOverlay.innerText = currentCertData.studentName.toUpperCase();

      document.getElementById('cert-course-title-text').innerText = courseTitle;
      document.getElementById('cert-workload-text').innerText = workload;
      document.getElementById('cert-period-text').innerText = startDate;
      document.getElementById('cert-period-end-text').innerText = endDate;
      document.getElementById('cert-teacher-name').innerText = teacherName;
      document.getElementById('cert-code-text').innerText = `Certificado nº ${certificateId}`;
      document.getElementById('cert-city-date-text').innerText = `Cuiabá – Mato Grosso, ${currentCertData.issueDate}.`;

      // Carregar QR Code Dinâmico
      const qrcodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(validationUrl)}`;
      const qrcodeImg = document.getElementById('cert-qrcode-img');
      qrcodeImg.src = qrcodeApiUrl;

      // Abrir o modal com animação
      modal.classList.add('open');

      // Converter QR Code para Base64 em segundo plano para o PDF
      qrcodeBase64 = null;
      try {
        qrcodeBase64 = await getBase64ImageFromUrl(qrcodeApiUrl);
      } catch (err) {
        console.warn('Não foi possível obter o Base64 do QR Code para o PDF (Offline/CORS):', err);
      }
    });
  });

  // Fechamento do modal
  const closeModalFunc = () => {
    modal.classList.remove('open');
  };

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModalFunc);
  if (btnCloseModalX) btnCloseModalX.addEventListener('click', closeModalFunc);

  // Fechar clicando no fundo escuro (overlay)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalFunc();
    }
  });

  // Lógica de Geração do PDF
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      if (!currentCertData) return;
      generatePDF(currentCertData);
    });
  }
}

/**
 * Pré-carrega a imagem de template do certificado para uso no PDF
 */
function loadTemplateImage() {
  const templateImg = document.querySelector('#certificate-print-area > img');
  if (templateImg && templateImg.src) {
    getBase64ImageFromUrl(templateImg.src)
      .then(base64 => {
        templateBase64 = base64;
      })
      .catch(err => {
        console.warn('Não foi possível pré-carregar o template do certificado:', err);
      });
  }
}

/**
 * 3. Geração de PDF via jsPDF (Template de Imagem + Texto Sobreposto)
 * 
 * Usa a imagem de template como fundo do PDF e sobrepõe apenas os dados dinâmicos
 * nas coordenadas exatas correspondentes às posições dos placeholders.
 */
function generatePDF(data) {
  const { jsPDF } = window.jspdf;
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = 297;
  const pageH = 210;
  const centerX = pageW / 2;

  const rgbPrimary = [11, 27, 94];
  const rgbCyan = [42, 171, 184];
  const rgbDark = [51, 51, 51];

  if (templateBase64) {
    try {
      doc.addImage(templateBase64, 'PNG', 0, 0, pageW, pageH);
    } catch (e) {
      console.warn('Erro ao inserir template no PDF:', e);
    }
  }

  doc.setFillColor(255, 255, 255);

  doc.rect(55, 24, 187, 14, 'F');
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(11, 27, 94);
  doc.text('CERTIFICADO', centerX, 35, { align: 'center' });

  doc.setDrawColor(11, 27, 94);
  doc.setLineWidth(0.2);
  doc.line(centerX - 35, 41, centerX - 10, 41);
  doc.line(centerX + 10, 41, centerX + 35, 41);
  
  doc.setFillColor(42, 171, 184);
  doc.triangle(centerX - 5, 41, centerX - 3, 39.2, centerX - 3, 42.8, 'F');
  doc.triangle(centerX - 1, 41, centerX - 3, 39.2, centerX - 3, 42.8, 'F');
  
  doc.setFillColor(11, 27, 94);
  doc.triangle(centerX - 2, 41, centerX, 38.0, centerX, 44.0, 'F');
  doc.triangle(centerX + 2, 41, centerX, 38.0, centerX, 44.0, 'F');
  
  doc.setFillColor(42, 171, 184);
  doc.triangle(centerX + 1, 41, centerX + 3, 39.2, centerX + 3, 42.8, 'F');
  doc.triangle(centerX + 5, 41, centerX + 3, 39.2, centerX + 3, 42.8, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 106, 158);
  doc.text('Certificamos que', centerX, 61, { align: 'center' });

  doc.rect(50, 64, 197, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(rgbPrimary[0], rgbPrimary[1], rgbPrimary[2]);
  doc.text(data.studentName.toUpperCase(), centerX, 72, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 106, 158);
  doc.text('concluiu com aproveitamento o curso de', centerX, 87, { align: 'center' });

  doc.rect(50, 94, 197, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(rgbCyan[0], rgbCyan[1], rgbCyan[2]);
  doc.text(data.courseTitle.toUpperCase(), centerX, 101, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(rgbDark[0], rgbDark[1], rgbDark[2]);
  
  const descLine1 = `com carga horária de ${data.workload} horas, realizado no período de ${data.startDate} a ${data.endDate},`;
  const descLine2 = 'abrangendo conteúdos teóricos e práticos voltados à qualificação';
  const descLine3 = 'profissional no âmbito dos serviços extrajudiciais.';
  
  doc.text(descLine1, centerX, 119, { align: 'center' });
  doc.text(descLine2, centerX, 124, { align: 'center' });
  doc.text(descLine3, centerX, 129, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(rgbDark[0], rgbDark[1], rgbDark[2]);
  doc.text(`Cuiabá – Mato Grosso, ${data.issueDate}.`, centerX, 152, { align: 'center' });

  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.35);
  doc.line(65, 174, 73, 170);
  doc.line(73, 170, 78, 177);
  doc.line(78, 177, 88, 169);
  doc.line(88, 169, 93, 174);
  doc.line(84, 172, 102, 171);
  
  doc.setDrawColor(11, 27, 94);
  doc.setLineWidth(0.15);
  doc.line(62, 181, 108, 181);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(17, 17, 17);
  doc.text('Larissa Águida', 85, 185, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(rgbDark[0], rgbDark[1], rgbDark[2]);
  doc.text('Diretora Executiva', 85, 188, { align: 'center' });

  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.35);
  doc.line(195, 172, 201, 170);
  doc.line(201, 170, 206, 178);
  doc.line(206, 178, 214, 168);
  doc.line(214, 168, 221, 173);
  doc.line(209, 172, 228, 171);
  
  doc.setDrawColor(11, 27, 94);
  doc.setLineWidth(0.15);
  doc.line(189, 181, 235, 181);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(17, 17, 17);
  doc.text(data.teacherName, 212, 185, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(rgbDark[0], rgbDark[1], rgbDark[2]);
  doc.text('Professor Responsável', 212, 188, { align: 'center' });

  if (qrcodeBase64) {
    try {
      doc.addImage(qrcodeBase64, 'PNG', 16, 166, 18, 18);
    } catch (e) {
      console.warn('Erro ao inserir QR Code no PDF:', e);
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.setTextColor(rgbDark[0], rgbDark[1], rgbDark[2]);
  const qrText = "Verifique a autenticidade deste certificado escaneando o QR Code ou acessando: academiodoextrajudicial.com.br/validar";
  const qrTextLines = doc.splitTextToSize(qrText, 22);
  doc.text(qrTextLines, 35, 170);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(rgbPrimary[0], rgbPrimary[1], rgbPrimary[2]);
  doc.text(`Certificado nº ${data.certificateId}`, centerX, 201, { align: 'center' });

  const pdfFilename = `certificado-${data.courseTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  doc.save(pdfFilename);
}

/**
 * Utilitário: Helper para converter URL de Imagem em Base64 (CORS habilitado)
 */
function getBase64ImageFromUrl(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); // Evita problemas de CORS na leitura do Canvas
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = imageUrl;
  });
}

/**
 * Utilitário: Gera um mock de hash SHA-256 simples e determinístico para representação
 */
function generateSHA256Mock(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Converte para inteiro de 32 bits
  }
  
  // Converter para hexadecimal legível com tamanho de SHA-256 (64 caracteres)
  let hexString = Math.abs(hash).toString(16).repeat(8);
  if (hexString.length > 64) {
    hexString = hexString.substring(0, 64);
  } else {
    hexString = hexString.padEnd(64, 'a');
  }
  return hexString;
}

/**
 * 4. Menu Gaveta (Drawer) Mobile
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('btn-close-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (overlay) {
      overlay.style.display = 'block';
      setTimeout(() => overlay.classList.add('open'), 10);
    }
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (overlay) {
      overlay.classList.remove('open');
      setTimeout(() => {
        if (!drawer.classList.contains('open')) {
          overlay.style.display = 'none';
        }
      }, 300);
    }
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  window.closeMobileDrawer = closeDrawer; // Torna acessível globalmente
}

/**
 * 5. Busca Rápida de Cursos (Ctrl + K)
 */
const mockCoursesDb = [
  { id: 'direito-notarial', title: 'Direito Notarial e Registral', workload: 60, progress: '75%' },
  { id: 'gestao-cartorios', title: 'Gestão de Cartórios', workload: 40, progress: '42%' },
  { id: 'tecnologia-serventias', title: 'Tecnologia para Serventias', workload: 40, progress: '100%' },
  { id: 'lgpd-cartorios', title: 'LGPD e Segurança Documental', workload: 30, progress: '0%' },
  { id: 'conformidade-extrajudicial', title: 'Conformidade e Compliance no Extrajudicial', workload: 50, progress: '0%' }
];

function initQuickSearch() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results-list');

  if (!modal || !input || !resultsContainer) return;

  const openSearch = () => {
    modal.classList.add('open');
    input.value = '';
    renderSearchResults('');
    setTimeout(() => input.focus(), 100);
  };

  const closeSearch = () => {
    modal.classList.remove('open');
  };

  // Atalho Ctrl+K ou Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeSearch();
    }
  });

  // Fecha no clique do overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSearch();
    }
  });

  input.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  function renderSearchResults(query) {
    resultsContainer.innerHTML = '';
    const cleanQuery = query.toLowerCase().trim();
    const filtered = mockCoursesDb.filter(c => c.title.toLowerCase().includes(cleanQuery));

    if (filtered.length === 0) {
      resultsContainer.innerHTML = '<div class="search-no-results">Nenhum curso encontrado.</div>';
      return;
    }

    filtered.forEach(c => {
      const item = document.createElement('div');
      item.className = 'search-result-item ripple-trigger';
      item.innerHTML = `
        <span class="search-result-title">${c.title}</span>
        <span class="search-result-meta">Carga Horária: ${c.workload} horas | Progresso: ${c.progress}</span>
      `;
      item.addEventListener('click', () => {
        closeSearch();
        const coursesTabLink = document.getElementById('nav-courses') || document.getElementById('bottom-nav-courses');
        if (coursesTabLink) coursesTabLink.click();
      });
      resultsContainer.appendChild(item);
    });
  }
}

/**
 * 6. Pull-to-Refresh (Mobile)
 */
function initPullToRefresh() {
  const container = document.getElementById('tab-dashboard-content');
  const indicator = document.getElementById('pull-to-refresh-indicator');

  if (!container || !indicator) return;

  let startY = 0;
  let currentY = 0;
  let isPulling = false;

  container.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].pageY;
      isPulling = true;
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isPulling) return;
    currentY = e.touches[0].pageY;
    const diff = currentY - startY;

    if (diff > 0) {
      if (diff < 80) {
        indicator.classList.add('visible');
        indicator.querySelector('span').innerText = 'Deslize para atualizar...';
      } else {
        indicator.querySelector('span').innerText = 'Solte para atualizar!';
      }
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    if (!isPulling) return;
    isPulling = false;
    const diff = currentY - startY;

    if (diff > 80) {
      indicator.querySelector('span').innerText = 'Atualizando...';
      refreshDashboardData();
    } else {
      indicator.classList.remove('visible');
    }
    startY = 0;
    currentY = 0;
  });

  function refreshDashboardData() {
    const cards = document.querySelectorAll('#tab-dashboard-content .widget-card, #tab-dashboard-content .card-container-box, #tab-dashboard-content .cert-promo-card');
    cards.forEach(card => card.classList.add('skeleton-active'));

    setTimeout(() => {
      indicator.classList.remove('visible');
      cards.forEach(card => card.classList.remove('skeleton-active'));
      triggerProgressBarAnimation();
    }, 1200);
  }
}

/**
 * 7. Skeleton Loading Temporário
 */
function initSkeletonLoaders() {
  const cards = document.querySelectorAll('#tab-dashboard-content .widget-card, #tab-dashboard-content .card-container-box, #tab-dashboard-content .cert-promo-card');
  cards.forEach(card => card.classList.add('skeleton-active'));

  setTimeout(() => {
    cards.forEach(card => card.classList.remove('skeleton-active'));
    triggerProgressBarAnimation();
  }, 800);
}

function showTabSkeleton(tabId) {
  const tab = document.getElementById(tabId);
  if (!tab) return;

  const cards = tab.querySelectorAll('.widget-card, .card-container-box, .cert-promo-card, .course-card');
  if (cards.length === 0) return;

  cards.forEach(card => card.classList.add('skeleton-active'));
  setTimeout(() => {
    cards.forEach(card => card.classList.remove('skeleton-active'));
  }, 600);
}

/**
 * 8. Animação de Barras de Progresso
 */
function initProgressBars() {
  triggerProgressBarAnimation();
}

function triggerProgressBarAnimation() {
  const bars = document.querySelectorAll('.progress-fill.animated-bar');
  bars.forEach(bar => {
    const target = bar.getAttribute('data-target') || '0%';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = target;
    }, 60);
  });
}

/**
 * 9. Micro-interações: Efeito de Clique Ripple
 */
function initRippleEffects() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.ripple-trigger');
    if (!target) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    const currentPos = window.getComputedStyle(target).position;
    if (currentPos !== 'absolute' && currentPos !== 'fixed' && currentPos !== 'relative') {
      target.style.position = 'relative';
    }

    target.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
}

/**
 * 10. Ações Rápidas: Download Direto de PDF
 */
function initDirectDownload() {
  const directBtns = document.querySelectorAll('.btn-download-cert-direct');
  directBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const courseId = btn.getAttribute('data-course-id');
      const courseTitle = btn.getAttribute('data-course-title');
      const workload = btn.getAttribute('data-workload');
      const teacherName = btn.getAttribute('data-teacher-name');
      const teacherSignature = btn.getAttribute('data-teacher-signature');
      const startDate = btn.getAttribute('data-start-date');
      const endDate = btn.getAttribute('data-end-date');

      const randomIdSuffix = Math.floor(10000 + Math.random() * 90000);
      const certificateId = `AE-2026-${randomIdSuffix}`;
      const mockHash = generateSHA256Mock(certificateId + courseId);
      const validationUrl = `https://renato0503.github.io/AcademiaDoExtrajudicial/validate?hash=${mockHash}`;

      const directCertData = {
        studentName: 'Renato Rosa',
        courseTitle,
        workload,
        teacherName,
        teacherSignature,
        startDate,
        endDate,
        certificateId,
        hash: mockHash,
        validationUrl,
        issueDate: '29 de Maio de 2026'
      };

      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerText = 'Gerando PDF...';

      Promise.all([
        templateBase64 ? Promise.resolve(templateBase64) : loadTemplateImagePromise(),
        getBase64ImageFromUrl(qrcodeApiUrlForDirect(validationUrl)).catch(() => null)
      ]).then(([tplBase64, qrBase64]) => {
        templateBase64 = tplBase64;
        qrcodeBase64 = qrBase64;

        generatePDF(directCertData);
        
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }).catch(err => {
        console.error('Erro ao baixar certificado diretamente:', err);
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        alert('Erro ao gerar certificado. Tente visualizar primeiro.');
      });
    });
  });
}

function qrcodeApiUrlForDirect(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
}

function loadTemplateImagePromise() {
  const templateImg = document.querySelector('#certificate-print-area > img');
  if (templateImg && templateImg.src) {
    return getBase64ImageFromUrl(templateImg.src);
  }
  return Promise.reject(new Error('Imagem de template não encontrada no DOM'));
}
