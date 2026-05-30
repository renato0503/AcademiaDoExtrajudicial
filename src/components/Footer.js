/**
 * Web Component: MainFooter
 * Define o rodapé institucional estruturado em colunas com copyright e links de conformidade.
 */
class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="landing-footer">
        <div class="footer-container">
          <!-- Coluna 1: Marca e Slogan -->
          <div class="footer-col col-brand">
            <div class="footer-logo-container">
              <img src="./logo_atual.png" alt="Logo Academia do Extrajudicial" class="footer-logo-img">
            </div>
            <p class="footer-description">
              Conhecimento que transforma a prática. Capacitação completa para profissionais do extrajudicial com cursos, trilhas e certificações.
            </p>
          </div>
          
          <!-- Coluna 2: Institucional -->
          <div class="footer-col">
            <h3 class="footer-title">Institucional</h3>
            <ul class="footer-links">
              <li><a href="#institucional">Sobre</a></li>
              <li><a href="#institucional">Missão</a></li>
              <li><a href="#institucional">Política de Privacidade</a></li>
            </ul>
          </div>
          
          <!-- Coluna 3: Cursos -->
          <div class="footer-col">
            <h3 class="footer-title">Cursos</h3>
            <ul class="footer-links">
              <li><a href="#cursos">Cursos Livres</a></li>
              <li><a href="#cursos">Capacitações</a></li>
              <li><a href="#certificados">Certificados</a></li>
            </ul>
          </div>
          
          <!-- Coluna 4: Contato -->
          <div class="footer-col">
            <h3 class="footer-title">Contato</h3>
            <ul class="footer-links">
              <li>
                <a href="https://wa.me/551140030000" target="_blank" rel="noopener" class="contact-link-item">
                  <svg class="contact-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/academiaextrajudicial" target="_blank" rel="noopener" class="contact-link-item">
                  <svg class="contact-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="mailto:contato@academiadoextrajudicial.com.br" class="contact-link-item">
                  <svg class="contact-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>E-mail</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Direitos Reservados -->
        <div class="footer-bottom">
          <div class="footer-bottom-container">
            <p class="copyright">
              © 2026 Academia do Extrajudicial. Todos os direitos reservados.
            </p>
            <div class="footer-diamond-mark" aria-hidden="true"></div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('main-footer', MainFooter);
export { MainFooter };
