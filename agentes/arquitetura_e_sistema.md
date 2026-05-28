# 🏗️ Arquitetura e Sistema

## 🎯 Objetivo
Definir estrutura de dados, fluxo de autenticação, organização de mídias e base para customização visual, mantendo simplicidade e escalabilidade para cartórios.

## 🗃️ Modelagem de Dados (Firestore)
- `users/{userId}`: `{ role, name, email, branchId, avatar, createdAt, lastLogin, consentLGPD }`
- `courses/{courseId}`: `{ title, description, coverUrl, categoryId, isMandatory, deadlineDays, publishedAt }`
- `modules/{moduleId}`: `{ courseId, order, title, prerequisites: [moduleId], status: 'draft'|'published' }`
- `lessons/{lessonId}`: `{ moduleId, type: 'video'|'pdf'|'quiz', contentUrl, duration, order }`
- `enrollments/{userId_courseId}`: `{ status: 'enrolled'|'completed'|'expired', startedAt, completedAt }`
- `progress/{userId_lessonId}`: `{ watchedSeconds, completed: boolean, lastAccess, attempts }`
- `certificates/{certificateId}`: `{ userId, courseId, issuedAt, hash, qrCodeUrl, pdfUrl }`
- `theme/{branchId}`: `{ primary, secondary, bg, text, fontFamily, borderRadius, logoUrl, accent }`

## 🔐 Autenticação e Segurança
- Use Firebase Auth (email/senha ou magic link). Ative verificação de e-mail obrigatória.
- Custom Claims: `{ role: 'admin'|'gestor'|'instrutor'|'aluno' }` via Firebase Functions ou Admin SDK.
- Firestore Security Rules:
  - Alunos só leem/escritam seus próprios dados.
  - Gestores leem/escrevem da sua `branchId`.
  - Admin tem acesso total, mas com auditoria implícita.
- LGPD: Consentimento registrado em `users.consentLGPD`. Log de acesso/alteração em campo `auditLog` (opcional via Cloud Logging).

## 🎥 Gestão de Mídias
- Firebase Storage para vídeos e materiais.
- URLs assinadas (`getDownloadURL()`) com expiração de 15min.
- Regra de Storage: `allow read: if request.auth != null && request.resource.contentType.matches('video/.*|application/pdf');`
- Não armazene vídeos públicos. Use `metadata: { authorized: [branchId] }` para controle futuro.

## 🎨 Sistema de Temas e Customização
- Todas as cores, fontes e raios são controlados por CSS Variables injetadas via `theme/{branchId}`.
- Estrutura de injeção:
  ```css
  :root {
    --primary: #0F172A;
    --secondary: #3B82F6;
    --bg: #F8FAFC;
    --text: #0F172A;
    --radius: 0.5rem;
    --font-main: 'Inter', system-ui, sans-serif;
  }
  ```
- Agente deve gerar componente `<theme-loader>` que busca `theme` no Firestore e aplica em `document.documentElement`.

## ⚠️ Guardrails
- Nunca mescle dados de múltiplas `branchId` sem filtro explícito.
- Valide todos os `type`, `status` e `order` com enums/constantes.
- Prefira `limit()`, `where()`, e índices compostos para evitar leituras desnecessárias.
