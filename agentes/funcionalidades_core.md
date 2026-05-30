# 🧩 Funcionalidades Core

## 🎯 Objetivo
Implementar regras de negócio essenciais para uma universidade corporativa de cartórios: acesso, progressão, gamificação, certificados e relatórios.

---

## 👥 Controle de Acessos (RBAC)

| Perfil | Descrição | Permissões |
|--------|-----------|------------|
| **admin** | Administrador da plataforma | CRUD total, gestão de temas, configuração de prazos, exportação de dados, gestão de usuários |
| **gestor_rh** | Responsável pelo RH dos cartórios | Atribuição de cursos, visão de progresso por departamento, relatórios |
| **instrutor** | Criador de conteúdo | Criação de módulos/aulas, correção de quizzes, upload de materiais |
| **colaborador** | Profissional do cartório | Consumo de conteúdo, progresso pessoal, visualização de certificados |

### Implementação
- Use Firebase Auth (email/senha ou magic link). Ative verificação de e-mail obrigatória.
- Custom Claims: `{ role: 'admin'|'gestor_rh'|'instrutor'|'colaborador' }` via Firebase Functions ou Admin SDK.
- Middleware de rota/visibilidade deve checar `user.role` antes de renderizar componentes ou permitir ações.

### Estrutura de Roles
```javascript
const ROLES = {
  ADMIN: 'admin',
  GESTOR_RH: 'gestor_rh',
  INSTRUTOR: 'instrutor',
  COLABORADOR: 'colaborador'
};
```

---

## 📚 Trilhas e Progressão

### Estrutura de Dados
```
users/{userId}
├── name, email, role, branchId, avatar
├── createdAt, lastLogin, consentLGPD
├── points, badges[], streakDays
└── enrolledCourses[]

courses/{courseId}
├── title, description, coverUrl, categoryId
├── isMandatory, deadlineDays, publishedAt
├── status: 'draft'|'published'|'archived'
└── instructorId, modulesOrder[]

modules/{moduleId}
├── courseId, order, title, description
├── prerequisites: [moduleId]
├── status: 'draft'|'published'
└── unlockCriteria

lessons/{lessonId}
├── moduleId, order, title, type: 'video'|'pdf'|'quiz'
├── contentUrl, duration, thumbnailUrl
└── completionCriteria: { minSeconds, minPercentage }

enrollments/{userId_courseId}
├── status: 'enrolled'|'completed'|'expired'
├── startedAt, completedAt, deadlineAt
├── currentModuleId, currentLessonId
└── progress: { completedLessons, totalLessons, percentage }

progress/{userId_lessonId}
├── completed: boolean
├── watchedSeconds, lastAccess
├── attempts (para quizzes)
└── quizScore (se quiz)
```

### Regras de Progressão
1. Sempre condicione liberação do Módulo B à conclusão do Módulo A (`prerequisites` array).
2. Calcule progresso em tempo real: `(aulas_concluidas / total_aulas) * 100`. Arredonde para inteiro.
3. Permita que gestor defina `deadlineDays`. Se `now > startedAt + deadlineDays * 86400000`, mude status para `expired` e trave progresso.
4. Bloqueie avanço se `progress.watchedSeconds < lesson.duration * 0.8` (exceto PDFs).
5. Para PDFs: mínimo 30 segundos para marcar como concluído.

### Fluxo de Matrícula
```
Disponível → Matriculado → Em andamento → Completo → Certificado
                    ↓
              (se prazo expirar) → Expirado → (reativar)
```

---

## 🏆 Gamificação

### Sistema de Pontos
| Ação | Pontos |
|------|--------|
| Concluir aula | +10 |
| Concluir módulo | +20 |
| Concluir curso | +50 |
| Acesso diário consecutive (streak) | +5/dia |
| Primeira semana completa | +25 |
| Primeiro curso concluído | +100 |

### Sistema de Streak
- Contador de dias consecutivos de acesso
- Bônus de streak: 7 dias = 1.5x, 30 dias = 2x
- Reset ao perder um dia (sem acesso)

### Badges
| Badge | Critério | Ícone |
|-------|----------|-------|
| primeiro_curso | Primeiro curso concluído | 🎓 |
| conformidade_total | 100% conformidade LGPD | ✅ |
|速度快 | 5 cursos em 30 dias | ⚡ |
| top_10_trimestre | Top 10% ranking trimestral | 🏅 |
|贤 | 30 dias de streak | 🔥 |
| consistencia_mensal | 20 dias de acesso no mês | 📅 |

### Ranking
- Visível para `gestor_rh` e `admin`
- Opt-in para alunos (mostrar/não mostrar nome)
- Divisão: Trimestral, Mensal, Semanal
- Métricas: Pontos, Cursos concluídos, Streak

### Armazenamento
```javascript
users.points       // número
users.badges[]      // ['primeiro_curso', 'conformidade_total', ...]
users.streakDays   // número
users.streakLastAccess // timestamp

leaderboard/{quarter}  // Coleção com rankings
```

---

## 📜 Emissão de Certificados

### Estrutura do Certificado
```
certificates/{certificateId}
├── userId, courseId
├── studentName, courseName
├── issuedAt, expiresAt
├── hash (SHA-256: userId_courseId_issuedAt)
├── qrCodeUrl
├── pdfUrl
└── status: 'valid'|'revoked'|'expired'

Validation URL: /validate?hash={hash}
```

### Geração do PDF (jsPDF)
1. Template base (fundo PNG ou desenhado)
2. Máscaras brancas para textos
3. Texto dinâmico: Nome, Curso, Data, Código
4. QR Code com URL de validação
5. Hash SHA-256 para segurança

### Técnica de Renderização
```javascript
// Antes de inserir texto, desenhe máscara branca
doc.rect(x, y, w, h, 'F');  // Fundo branco
doc.text('Texto', x, y);
```

### Validação Pública
- Rota: `/validate?hash=XXXXX`
- Exibe: Válido/Inválido, Nome, Curso, Data

### Envio por E-mail
- Firebase Functions com nodemailer/SendGrid
- Dispara após `progress.completed = true`
- Anexo: PDF do certificado

---

## 📊 Relatórios e Dashboards

### Métricas (Admin/Gestor)
| Métrica | Descrição | Cálculo |
|---------|-----------|---------|
| Taxa de conclusão | % alunos que terminaram | completed / enrolled * 100 |
| Tempo médio | Horas por curso | sum(watchedSeconds) / completed |
| Cursos atrasados | Alunos com prazo vencido | count(status='expired') |
| Engajamento | Acessos únicos no período | count(unique userId) |

### Filtros
- `branchId` (obrigatório para gestores)
- `dateRange` (período)
- `courseId` (curso específico)
- `status` (enrolled/completed/expired)

### Exportação
- CSV via PapaParse
- Excel via SheetJS
- Relatório em PDF

### Logs de Auditoria
```javascript
activity_log/{logId}
├── userId, action, resource, timestamp
├── ip, userAgent
└── details: { ... }
```

---

## ⚖️ Contexto Cartórios (Diferencial)

### Cursos Obrigatórios
| Código | Nome | Prazo Legal |
|--------|------|-------------|
| lgpd_cartorio | LGPD para Cartórios | 60 dias |
| normas_notariais | Normas Notariais | 30 dias |
| seguranca_documental | Segurança Documental | 45 dias |

### Alertas Visuais
- Banner "Curso obrigatório" com prazo
- Badge vermelho "Vence em X dias"
- Notificação push 7 dias antes

### Aceite de Termos
- Cursos sensíveis exigem aceite (`acknowledgment: true`)
- Log de aceite com timestamp
- Não permite avançar sem aceitar

---

## 📱 Tipos de Aula

### Vídeo
- Player nativo HTML5
- Velocidade: 0.5x, 1x, 1.25x, 1.5x, 2x
- Legendagem (se disponível)
- Marcação automática: 80% assistido = concluído

### PDF/Documento
- Viewer embedado ou download
- Scroll tracking (50% scroll = concluído)
- Tempo mínimo: 30 segundos
- Botão: "Baixar material"

### Quiz
- Tipos: Múltipla escolha, verdadeiro/falso, associações
- Timer configurável (opcional)
- Máximo 3 tentativas (configurável)
- Feedback imediato por questão
- Nota mínima: 70% (configurável)

### Estrutura do Quiz
```javascript
quiz: {
  questions: [
    {
      id, text, type: 'single'|'multiple'|'boolean'|'match',
      options: [{ id, text, isCorrect }],
      points, feedback
    }
  ],
  timeLimit, maxAttempts, passingScore
}
```

---

## ⚠️ Guardrails

1. **Nunca permita pular pré-requisitos** via manipulação de URL ou estado local.
2. **Valide no servidor** (`Firestore Security Rules`) todos os `deadlineDays` e `acknowledgment`.
3. **Limite tentativas de quiz** a 3 por aula (configurável).
4. **Hash de certificado** deve ser imutável após emissão.
5. **Nunca mescle dados** de múltiplas `branchId` sem filtro explícito.
6. **Valide todos os `type`, `status` e `order`** com enums/constantes.
7. **Prefira `limit()`, `where()`** e índices compostos para evitar leituras desnecessárias.

---

## 🔔 Sistema de Notificações

### Tipos
| Tipo | Canal | Gatilho |
|------|-------|---------|
| prazo_vencendo | In-app, E-mail | 7 dias antes do deadline |
| novo_curso | In-app | Admin publica curso |
| certificado_emitido | E-mail | Completion |
| badge_desbloqueado | In-app | Conquista |
| streak_breaking | In-app | 24h sem acesso |

### Implementação
```javascript
notifications/{userId}/items/{notificationId}
├── type, title, body, read
├── createdAt, actionUrl
└── priority: 'low'|'normal'|'high'
```

---

## 🎨 Estados de UI

### Loading
- Skeleton screens para cards
- Spinner para ações
- Progress bar para uploads

### Empty States
| Contexto | Mensagem | Ação |
|----------|----------|------|
| Sem cursos | "Você ainda não tem cursos" | "Explorar cursos" |
| Sem certificados | "Nenhum certificado ainda" | "Continue estudando" |
| Sem notificações | "Tudo em dia!" | - |

### Error States
- Toast para erros simples
- Modal para erros críticos
- Retry button quando aplicável

---

*Documento atualizado em: 30/05/2026*
*Versão: 2.0*