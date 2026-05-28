# 🧩 Funcionalidades Core

## 🎯 Objetivo
Implementar regras de negócio essenciais para uma universidade corporativa de cartórios: acesso, progressão, gamificação, certificados e relatórios.

## 👥 Controle de Acessos (RBAC)
- `admin`: CRUD total, gestão de temas, configuração de prazos, exportação de dados.
- `gestor_rh`: Atribuição de cursos, visão de progresso por departamento, relatórios.
- `instrutor`: Criação de módulos/aulas, correção de quizzes, upload de materiais.
- `colaborador`: Consumo de conteúdo, progresso pessoal, visualização de certificados.
- Regra: Middleware de rota/visibilidade deve checar `user.role` antes de renderizar componentes ou permitir ações.

## 📚 Trilhas e Progressão
- Sempre condicione liberação do Módulo B à conclusão do Módulo A (`prerequisites` array).
- Calcule progresso em tempo real: `(aulas_concluidas / total_aulas) * 100`. Arredonde para inteiro.
- Permita que gestor defina `deadlineDays`. Se `Date.now() > startedAt + deadlineDays * 86400000`, mude status para `expired` e trave progresso.
- Bloqueie avanço se `progress.watchedSeconds < lesson.duration * 0.8` (exceto PDFs).

## 🏆 Gamificação
- Pontos: `+10` por aula concluída, `+50` por curso finalizado, `+5` por acesso diário consecutivo (streak).
- Badges: Desbloqueie por marcos (`primeiro_curso`, `conformidade_100`, `top_10_trimestre`).
- Ranking: Visível apenas para `gestor_rh` e `admin`. Opt-in para alunos.
- Armazene em `users.points`, `users.badges: []`, `leaderboard/{quarter}`.

## 📜 Emissão de Certificados
- Gere PDF via `jsPDF` ou `pdf-lib` no cliente.
- Estrutura: Nome do colaborador, título do curso, data de conclusão, hash SHA-256 (`userId_courseId_issuedAt`), QR Code com URL de validação.
- Armazene `pdfUrl` e `hash` no Firestore. Validação pública via rota `/validate?hash=...` que consulta `certificates/{id}`.
- Envio por e-mail via Firebase Functions (`nodemailer` ou SendGrid) após `progress.completed`.

## 📊 Relatórios e Dashboards (RH/Admin)
- Métricas: Taxa de conclusão, tempo médio de tela, cursos atrasados, engajamento por departamento.
- Filtros: `branchId`, `dateRange`, `courseId`, `status`.
- Exportação: CSV/Excel via `PapaParse` ou `SheetJS`.
- Armazene logs de acesso in `activity_log/{logId}` para auditoria.

## ⚖️ Contexto Cartórios (Diferencial)
- Cursos obrigatórios de conformidade: `lei_geral_protecao_dados`, `normas_notariais`, `seguranca_documental`.
- Alertas visuais para prazos legais vencendo.
- Termo de ciência obrigatório antes de iniciar módulos sensíveis (`acknowledgment: true`).

## ⚠️ Guardrails
- Nunca permita pular pré-requisitos via manipulação de URL ou estado local.
- Valide `deadlineDays` e `acknowledgment` no servidor (Firebase Security Rules).
- Limite tentativas de quiz a 3 por aula (configurável).
- Hash de certificado deve ser imutável após emissão.
