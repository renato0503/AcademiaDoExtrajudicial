# 🏗️ Arquitetura e Sistema

## 🎯 Objetivo
Definir estrutura de dados, fluxo de autenticação, organização de mídias e base para customização visual, mantendo simplicidade e escalabilidade para cartórios.

---

## 🗃️ Modelagem de Dados (Firestore)

### Coleções Principais

```javascript
// Usuários
users/{userId}
├── role: 'admin'|'gestor_rh'|'instrutor'|'colaborador'
├── name, email, photoUrl, phone
├── branchId, departmentId
├── createdAt, lastLoginAt, consentLGPDAt
├── points, streakDays, streakLastAccess
├── badges: [], preferences: {}
└── status: 'active'|'blocked'

// Cursos
courses/{courseId}
├── title, description, coverUrl
├── categoryId, level: 'basic'|'intermediate'|'advanced'
├── isMandatory, deadlineDays
├── status: 'draft'|'published'|'archived'
├── instructorId, createdAt, publishedAt
├── modulesOrder: [moduleId]
├── stats: { totalStudents, completedCount, avgProgress }
└── settings: { allowDownload, showTimer, requireAcknowledgment }

// Módulos
modules/{moduleId}
├── courseId, order, title, description
├── prerequisites: [moduleId]  // módulos que devem ser concluídos antes
├── status: 'draft'|'published'
└── unlockCriteria: { type: 'sequential'|'any' }

// Aulas
lessons/{lessonId}
├── moduleId, order, title
├── type: 'video'|'pdf'|'quiz'
├── contentUrl, thumbnailUrl
├── duration: number  // segundos para vídeos
├── completionCriteria: { minSeconds, minPercentage }
└── settings: { allowDownload, showTimer }

// Matrículas
enrollments/{userId_courseId}
├── userId, courseId, branchId
├── status: 'available'|'enrolled'|'in_progress'|'completed'|'expired'
├── enrolledAt, startedAt, completedAt, deadlineAt
├── currentModuleId, currentLessonId
├── progress: { completedLessons, totalLessons, percentage }
└── certificateId

// Progresso por aula
progress/{userId_lessonId}
├── userId, lessonId, courseId
├── completed: boolean
├── watchedSeconds, lastAccessAt
├── attempts (para quizzes)
└── quizScore, quizAnswers

// Certificados
certificates/{certificateId}
├── userId, courseId, enrollmentId
├── studentName, courseName
├── issuedAt, expiresAt
├── hash (SHA-256)
├── qrCodeUrl, pdfUrl
├── status: 'valid'|'revoked'|'expired'
└── createdBy (admin/instrutor que emitiu)

// Trilhas de aprendizado
trails/{trailId}
├── title, description, coverUrl
├── coursesOrder: [courseId]
├── totalHours, totalCourses
├── rewards: { points, badgeId }
├── status: 'active'|'inactive'
└── createdAt

// Matrículas em trilhas
trail_enrollments/{userId_trailId}
├── status: 'active'|'completed'
├── progress: { completedCourses, totalCourses, percentage }
└── completedAt

// Gamificação - Rankings
leaderboard/{period}_{type}  // ex: leaderboard/2026_Q1_points
├── userId, rank, points
├── coursesCompleted, streakDays
└── displayName: boolean  // se mostra nome publicamente

// Badges
badges/{badgeId}
├── name, description, iconUrl
├── criteria: { type, value }
└── rarity: 'common'|'rare'|'epic'|'legendary'

// Notificações
notifications/{userId}/items/{notificationId}
├── type: 'deadline'|'new_course'|'certificate'|'badge'|'streak'
├── title, body, read: boolean
├── createdAt, actionUrl
└── priority: 'low'|'normal'|'high'

// Logs de Auditoria
activity_log/{logId}
├── userId, action, resource, resourceId
├── timestamp, ip, userAgent
└── details: { ... }

// Tema da instituição
themes/{branchId}
├── primaryColor, secondaryColor
├── bgColor, textColor
├── fontFamily, borderRadius
├── logoUrl, faviconUrl
└── accentColor

// Departamentos
departments/{departmentId}
├── branchId, name, managerId
└── createdAt
```

### Índices Compostos (Firestore)
```
enrollments: userId+courseId (único)
enrollments: courseId+status
enrollments: branchId+status
progress: userId+lessonId (único)
progress: userId+courseId
certificates: userId+courseId
notifications: userId+read+createdAt
activity_log: userId+timestamp
```

---

## 🔐 Autenticação e Segurança

### Firebase Auth
- **Métodos**: Email/Senha + Google
- **Verificação**: E-mail obrigatório
- **Senha**: Mínimo 8 caracteres, 1 número, 1 maiúscula
- **Magic Link**: Opcional para recuperação

### Custom Claims (via Admin SDK)
```javascript
// Ao criar/atualizar usuário
admin.auth().setCustomUserClaims(userId, {
  role: 'colaborador',
  branchId: 'branch_123'
});
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários: só leem/escrevem seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'gestor_rh']);
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Cursos: leitura pública, escrita só admin/instrutor
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role 
        in ['admin', 'instrutor'];
    }
    
    // Módulos e Aulas: herdados do curso
    match /modules/{moduleId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role 
        in ['admin', 'instrutor'];
    }
    
    // Matrículas: usuário vê as suas, admin vê todas
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null && 
        (request.auth.uid == enrollmentId.split('_')[0] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'gestor_rh']);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == enrollmentId.split('_')[0] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'gestor_rh']);
    }
    
    // Progresso: só o próprio usuário
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == progressId.split('_')[0];
    }
    
    // Certificados: leitura pública para validação
    match /certificates/{certificateId} {
      allow read: if true;  // Para validação pública
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role 
        in ['admin', 'gestor_rh'];
    }
    
    // Admin only
    match /themes/{themeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🎥 Gestão de Mídas

### Firebase Storage
```
storage/
├── courses/{courseId}/videos/{fileId}.mp4
├── courses/{courseId}/materials/{fileId}.pdf
├── courses/{courseId}/thumbnails/{fileId}.jpg
├── certificates/{certificateId}.pdf
├── avatars/{userId}.jpg
└── badges/{badgeId}.png
```

### Regras de Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /courses/{courseId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role 
        in ['admin', 'instrutor'] &&
        request.resource.contentType.matches('video/.*|application/pdf|image/.*');
    }
    
    match /certificates/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role 
        in ['admin'];
    }
    
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### URLs Assinadas
- Gerar URL com expiração de 15min para vídeos
- `getDownloadURL()` com cache no cliente

---

## 🎨 Sistema de Temas

### Estrutura CSS Variables
```css
:root {
  /* Cores principais */
  --primary: var(--theme-primary, #0B1B5E);
  --secondary: var(--theme-secondary, #39C2D7);
  --accent: var(--theme-accent, #1F9EB3);
  
  /* Backgrounds */
  --bg-main: var(--theme-bg, #F4F6FA);
  --bg-card: var(--theme-card, #FFFFFF);
  --bg-sidebar: var(--theme-sidebar, #E8ECF4);
  
  /* Textos */
  --text-primary: var(--theme-text, #0B1B5E);
  --text-secondary: var(--theme-text-secondary, #6E6E73);
  --text-light: var(--theme-text-light, #8E8E93);
  
  /* Tipografia */
  --font-main: var(--theme-font, 'Lato', sans-serif);
  --font-display: var(--theme-font-display, 'Montserrat', sans-serif);
  
  /* Bordas e raios */
  --radius-sm: var(--theme-radius, 0.5rem);
  --radius-md: var(--theme-radius-md, 1rem);
  --radius-lg: var(--theme-radius-lg, 1.5rem);
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(11, 27, 94, 0.08);
  --shadow-md: 0 4px 16px rgba(11, 27, 94, 0.12);
  --shadow-lg: 0 8px 32px rgba(11, 27, 94, 0.16);
}
```

### Injeção de Tema
```javascript
// theme-loader.js
async function loadTheme(branchId = 'default') {
  const db = getFirestore();
  const themeDoc = await getDoc(doc(db, 'themes', branchId));
  
  if (themeDoc.exists()) {
    const theme = themeDoc.data();
    const root = document.documentElement;
    
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    // ... aplicar todas as variáveis
  }
}
```

---

## 📱 Estrutura de Páginas

### Arquitetura de Rotas
```
/ (Landing Page - index.html)
├── /dashboard.html (Painel do Aluno)
/validate?hash=xxx (Validação de certificado - pública)
```

### Mapeamento de Componentes
```
index.html (Landing)
├── <main-header>
├── <landing-content> (seções)
└── <main-footer>

dashboard.html (Painel)
├── <mobile-top-header> (mobile)
├── <sidebar-navigation> (desktop)
├── <mobile-drawer>
├── <mobile-bottom-nav> (mobile)
├── <main-content>
│   ├── Dashboard widgets
│   ├── Courses list
│   ├── Lesson viewer
│   └── Certificates
└── <modal-overlay>
```

### Web Components Existentes
```javascript
// Header e Footer
<main-header></main-header>
<main-footer></main-footer>

// Dashboard (layout)
<mobile-top-header></mobile-top-header>
<mobile-drawer></mobile-drawer>
<mobile-bottom-nav></mobile-bottom-nav>

// Funcionalidade
<theme-loader theme-id="default"></theme-loader>
<search-modal></search-modal>
<certificate-modal></certificate-modal>
```

---

## ⚡ Performance e Otimização

### Estratégias
1. **Lazy Loading**: Imagens com `loading="lazy"` e IntersectionObserver
2. **Code Splitting**: Vite faz automaticamente por página
3. **Caching**: Service Worker para assets estáticos
4. **CDN**: GitHub Pages já serve via CDN

### Índices Firestore
```javascript
// Query otimizada para "meus cursos"
enrollments
  .where('userId', '==', currentUserId)
  .where('status', 'in', ['enrolled', 'in_progress'])
  .orderBy('deadlineAt', 'asc')

// Query otimizada para progresso
progress
  .where('userId', '==', currentUserId)
  .where('courseId', '==', courseId)
  .where('completed', '==', false)
```

### Bundle Size
- Meta: < 200KB JS inicial
- Tree shaking do Firebase
- Componentes lazy loaded

---

## 🔄 Sincronização e Offline

### Firebase Offline Persistence
```javascript
// firebase.js
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline não disponível: múltiplas abas');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser não suporta offline');
  }
});
```

### Estratégia de Sync
1. Escritas offline são enfileiradas
2. Reconexão faz sync automático
3. UI atualiza com dados reais

---

## ⚠️ Guardrails

1. **Nunca mescle dados** de múltiplas `branchId` sem filtro explícito.
2. **Valide todos os `type`, `status` e `order`** com enums/constantes.
3. **Prefira `limit()`, `where()`** e índices compostos para evitar leituras desnecessárias.
4. **Nunca exponha credenciais** no frontend (sempre via Firebase Security Rules).
5. **Hash de certificado** deve ser imutável após emissão.
6. **Tentativas de quiz** limitadas a 3 por padrão.

---

## 📁 Estrutura de Arquivos

```
academia-do-extrajudicial/
├── .github/workflows/deploy.yml
├── agentes/
│   ├── stack_e_padroes.md
│   ├── funcionalidades_core.md
│   ├── arquitetura_e_sistema.md
│   ├── ui_ux_e_design_system.md
│   ├── firebase_seguranca_e_dados.md
│   ├── conteudo_certificados_e_gamificacao.md
│   ├── perfil_e_comportamento.md
│   └── qa_testes_e_performance.md
├── public/
│   ├── logo_atual.png
│   ├── icone.png
│   ├── certificado_fundo.png
│   └── *.jpg (cursos)
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── theme-loader.js
│   │   ├── landing.js
│   │   ├── certificates.js
│   │   └── dashboard.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── auth.js
│   ├── styles/
│   │   ├── variables.css
│   │   ├── layout.css
│   │   └── landing.css
│   └── utils/
│       ├── constants.js
│       └── helpers.js
├── index.html (Landing Page)
├── dashboard.html (Painel do Aluno)
├── contexto.md
├── package.json
└── vite.config.js
```

---

*Documento atualizado em: 30/05/2026*
*Versão: 2.0*