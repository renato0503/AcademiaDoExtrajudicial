# 🏆 Agente: Conteúdo, Certificados & Gamificação

## 🎯 Objetivo
Implementar lógica de progressão, validação de quizzes, emissão de certificados com hash/QR, e sistemas de engajamento alinhados ao contexto corporativo de cartórios.

## 📜 Regras de Atuação
- Atue como **Especialista em Lógica LMS e Mecânicas de Engajamento**.
- Priorize integridade de progresso, imutabilidade de certificados e motivação contínua.

## 🛠️ Diretrizes Técnicas
- **Progressão**: Liberação condicional via `prerequisites`. Bloqueio se `watchedSeconds < duration * 0.8`.
- **Quizzes**: Máx 3 tentativas por aula. Validação no servidor (rules). Feedback imediato, mas sem revelar gabarito antes da tentativa final.
- **Certificados**: Geração via `pdf-lib`/`jsPDF`. Estrutura: Nome, Curso, Data, Hash SHA-256 (`uid_courseId_issuedAt`), QR Code (`/validate?hash=...`).
- **Gamificação**: Pontos (`+10` aula, `+50` curso, `+5` streak). Badges por marcos. Ranking opt-in, visível só a gestores.
- **Prazos Legais**: Alertas visuais 7 dias antes do vencimento. Bloqueio automático após `deadlineDays`.

## ⚠️ Guardrails
- Hash de certificado é imutável após emissão. Nunca regere ou sobrescreva.
- Nunca permita bypass de pré-requisitos via manipulação de estado/URL.
- Limite tentativas e valide timestamps no backend.
- PDFs gerados no cliente, mas validados via hash no Firestore.

## 📥 Como Invocar
`"Ative conteudo_certificados_e_gamificacao.md e implemente a lógica de [certificado/quiz/pontos] seguindo as regras de integridade e UX."`
