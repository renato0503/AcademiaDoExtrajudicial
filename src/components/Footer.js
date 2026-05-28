/**
 * Web Component: MainFooter
 * Define o rodapé institucional estruturado em 4 colunas com copyright e links de conformidade.
 */
class MainFooter extends HTMLElement {
  connectedCallback() {
    const currentYear = new Date().getFullYear();
    
    this.innerHTML = `
      <footer class="landing-footer">
        <div class="footer-container">
          <!-- Coluna 1: Marca e Redes Sociais -->
          <div class="footer-col col-brand">
            <img src="./logo.png" alt="Logo Academia do Extrajudicial" class="footer-logo-img">
            <p class="footer-description">
              Plataforma definitiva de capacitação, conformidade e gestão de conhecimento especializada para serventias extrajudiciais brasileiras.
            </p>
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="Acessar LinkedIn" title="LinkedIn">
                <span aria-hidden="true">🔗</span>
              </a>
              <a href="#" class="social-link" aria-label="Acessar Instagram" title="Instagram">
                <span aria-hidden="true">📸</span>
              </a>
              <a href="#" class="social-link" aria-label="Acessar Canal do YouTube" title="YouTube">
                <span aria-hidden="true">🎥</span>
              </a>
            </div>
          </div>
          
          <!-- Coluna 2: Navegação -->
          <div class="footer-col">
            <h3 class="footer-title">Navegação</h3>
            <ul class="footer-links">
              <li><a href="#inicio">Início</a></li>
              <li><a href="#sobre">Sobre a Academia</a></li>
              <li><a href="#cursos">Cursos Disponíveis</a></li>
              <li><a href="#beneficios">Benefícios</a></li>
              <li><a href="#depoimentos">Depoimentos</a></li>
            </ul>
          </div>
          
          <!-- Coluna 3: Conformidade e LGPD -->
          <div class="footer-col">
            <h3 class="footer-title">Segurança e LGPD</h3>
            <ul class="footer-links">
              <li><a href="#" id="link-terms">Termos de Uso</a></li>
              <li><a href="#" id="link-privacy">Política de Privacidade</a></li>
              <li><a href="#" id="link-lgpd">Conformidade LGPD</a></li>
              <li><a href="#" id="link-security">Normas de Segurança</a></li>
            </ul>
          </div>
          
          <!-- Coluna 4: Contatos e Endereço -->
          <div class="footer-col">
            <h3 class="footer-title">Fale Conosco</h3>
            <address class="footer-address">
              <p class="contact-item">
                <span class="contact-icon" aria-hidden="true">📧</span>
                <a href="mailto:contato@academiadoextrajudicial.com.br">contato@academiadoextrajudicial.com.br</a>
              </p>
              <p class="contact-item">
                <span class="contact-icon" aria-hidden="true">📞</span>
                <a href="tel:+551140030000">(11) 4003-0000</a>
              </p>
              <p class="contact-item">
                <span class="contact-icon" aria-hidden="true">📍</span>
                Av. Paulista, 1000 - Bela Vista<br>São Paulo - SP, CEP 01310-100
              </p>
            </address>
          </div>
        </div>
        
        <!-- Direitos Reservados e Detalhe Visual (Diamante Sutil) -->
        <div class="footer-bottom">
          <div class="footer-bottom-container">
            <p class="copyright">
              &copy; ${currentYear} Academia do Extrajudicial. Todos os direitos reservados. CNPJ: 00.000.000/0001-00.
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
