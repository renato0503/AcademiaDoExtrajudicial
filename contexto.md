# 📋 Workflow Completo da Plataforma Academia do Extrajudicial

Este documento mapeia todos os fluxos de usuário, funcionalidades, botões e comportamentos da plataforma, tanto para o **Aluno** quanto para o **Admin/Gestor**.

---

## 🎭 Personas e Perfis de Acesso

| Perfil | Descrição | Permissões |
|--------|-----------|------------|
| **Admin** | Administrador da plataforma | CRUD total, gestão de temas, configuração de prazos, exportação de dados, gestão de usuários |
| **Gestor RH** | Responsável pelo RH dos cartórios | Atribuição de cursos, visão de progresso por departamento, relatórios |
| **Instrutor** | Criador de conteúdo | Criação de módulos/aulas, correção de quizzes, upload de materiais |
| **Colaborador/Aluno** | Profissional do cartório | Consumo de conteúdo, progresso pessoal, visualização de certificados |

---

## 👤 FLUXO DO ALUNO/COLABORADOR

### 1. Tela Inicial (Landing Page - index.html)
```
[Visitação Anônima]
├── Header: Logo | Navegação (Início, Cursos, Trilhas, Certificados, Institucional, Contato) | Botões: Entrar / Cadastrar
├── Hero: Título + Subtítulo + CTA (Explorar Cursos / Conhecer Trilhas)
├── Seção Sobre: Grid de cards (Missão, Visão, Valores)
├── Seção Cursos em Destaque: Cards de cursos com thumbnail, badge, título, botão
├── Seção Benefícios: Linhas alternadas (ícone + texto) para cada benefício
├── Seção Stats: Números (estudantes, cursos, certificações, horas)
├── Seção Diferenciais: Cards com ícone, título, descrição
├── CTA Final: Título + Descrição + Botões (Começar Agora / Falar com Consultor)
└── Footer: Logo, Links Institucionais, Cursos, Contato, Copyright
```

### 2. Autenticação (Modal/Página)
```
[Tela de Login]
├── Campos: E-mail | Senha
├── Botão: "Entrar"
├── Links: "Esqueci minha senha" | "Criar conta"
└── Separador: "Ou continue com Google"
```
```
[Tela de Cadastro]
├── Campos: Nome Completo | E-mail | Senha | Confirmar Senha
├── Checkbox: Termos de uso e política de privacidade
├── Botão: "Criar Conta"
└── Link: "Já tem conta? Entrar"
```
```
[Recuperação de Senha]
├── Campo: E-mail
├── Botão: "Enviar link de recuperação"
└── Feedback: "Verifique seu e-mail para redefinir senha"
```

### 3. Dashboard do Aluno (dashboard.html)
```
[Header Logado]
├── Logo + Nome do Usuário (dropdown com avatar)
├── Navegação: Início | Meus Cursos | Certificados | Ranking (opcional)
└── Ações: Busca (Ctrl+K) | Notificações | Sair
```

#### 3.1 Widgets Iniciais (Cards de Status)
```
├── Card "Cursos em Andamento": Número + Barra de progresso + "Continuar"
├── Card "Certificados": Número + "Ver certificados"
├── Card "Pontos/Streak": Número + Ícone de fogo + Dias consecutivos
└── Card "Próximo prazo": Nome do curso + Dias restantes + "Acessar"
```

#### 3.2 Seção "Meus Cursos" (Cursos em Andamento)
```
[Carrossel/Horizontal Scroll]
├── Card do Curso: Thumbnail + Badge Nível + Título + Progresso (%) + Barra +Última aula + Botão "Continuar"
└── Botão: "Ver todos os cursos" → Expandir grid
```

#### 3.3 Seção "Certificados"
```
[Cards de Certificados Recentes]
├── Card: Badge + Título do Curso + Data de emissão + Botão "Visualizar" + Botão "Baixar PDF"
└── Botão: "Ver todos os certificados" → Modal com lista completa
```

#### 3.4 Modal de Certificado (ao clicar em "Visualizar")
```
├── Preview do certificado (imagem/template)
├── Dados: Nome do aluno, curso, data emissão, código de validação
├── QR Code: Link para validação online
├── Botões: "Baixar PDF" | "Compartilhar" | "Fechar"
└── Link: "Validar certificado" → abre nova aba com validação
```

#### 3.5 Área do Curso (ao clicar em "Continuar")
```
[Tela de Conteúdo do Curso]
├── Sidebar: Título do curso + Módulos collapsáveis
│   ├── Módulo 1 (liberado/trancado) → Aulas
│   │   ├── Aula 1 ✓/○ → Título + Duração + Status
│   │   ├── Aula 2 ✓/○ → Título + Duração + Status
│   │   └── Quiz do Módulo → Status
│   ├── Módulo 2 (liberado/trancado) → ...
│   └── Indicador: Progresso geral do curso
├── Área Principal: Video Player / PDF Viewer / Quiz
│   ├── Toolbar:play/pause, volume, fullscreen, velocidade
│   ├── Barra de progresso do video
│   └── Botão: "Marcar como concluída" / "Próxima aula"
└── Footer: Botão "Voltar ao curso" | "Emitir certificado" (se concluído)
```

#### 3.6 Tipos de Aula
```
[Vídeo]
├── Player com controles nativos
├── Barra de progresso (clique para pular)
├── Marcação automática ao assistir 80%
└── Botão: "Próxima aula"

[PDF/Documento]
├── Visualizador de PDF embedado
├── Botão: "Marcar como lido" (mínimo 30 segundos)
└── Botão: "Baixar material"

[Quiz/Questionário]
├── Pergunta + Alternativas (radio/checkbox)
├── Timer (se configurado)
├── Botão: "Próxima" / "Finalizar"
├── Feedback: Acerto/Erro por questão
└── Resultado: Nota + % + "Tentar novamente" ou "Continuar"
```

#### 3.7 Menu do Aluno (Drawer Mobile)
```
├── Meu Perfil → Editar perfil
├── Meus Cursos → Lista de cursos
├── Certificados → Lista de certificados
├── Configurações → Preferências
├── Sair → Logout
└── Tema (Claro/Escuro) → Toggle
```

---

## 👨‍💼 FLUXO DO ADMIN/GESTOR

### 1. Tela de Login (mesma autenticação, mas redireciona para Admin)
```
[Redirect automático]
├── Se role = admin/gestor → Painel Admin
└── Se role = aluno → Dashboard normal
```

### 2. Dashboard Admin (admin.html ou área restrita)
```
[Sidebar Admin]
├── Logo + Nome Admin
├── Menu: Dashboard | Cursos | Usuários | Trilhas | Certificados | Relatórios | Configurações
└── Footer: Versão do sistema | Sair
```

### 3. Dashboard Visão Geral
```
[Widgets de Métricas]
├── Total de alunos ativos | Crescimento mensal
├── Taxa de conclusão geral | Cursos mais populares
├── Alunos em atraso | Ranking de desempenho
└── Gráfico: Matrículas por mês | Conclusões por mês

[Lista de Alertas]
├── Cursos com prazo vencendo | Novos alunos sem acesso | Revisões pendentes
└── Botão: "Ver todos os alertas"
```

### 4. Gestão de Cursos (CRUD)
```
[Listagem de Cursos]
├── Tabela/Filtros: Busca | Status (rascunho/publicado) | Categoria | Ordenação
├── Card: Thumbnail + Título + Módulos + Alunos + Status + Ações
└── Botão: "+ Novo Curso"

[Modal/Formulário de Curso]
├── Campos: Título | Descrição | Capa (upload) | Categoria | Nível
├── Configuração: Obrigatório? | Prazo dias | Aceite termos?
├── Botões: "Salvar rascunho" | "Publicar" | "Cancelar"
└── Preview: Como fica para o aluno
```

### 5. Gestão de Módulos e Aulas
```
[Estrutura do Curso]
├── Sidebar: TreeView dos módulos e aulas
├── Área: Editor do módulo/aula selecionada
│   ├── Módulo: Título | Descrição | Ordem | Pré-requisitos
│   └── Aula: Título | Tipo (video/pdf/quiz) | Upload | Duração | Conteúdo
├── Botões: "+ Adicionar módulo" | "+ Adicionar aula" | "Reordenar"
└── Botão: "Preview do curso"
```

### 6. Upload de Vídeos/Materiais
```
[Upload de Mídia]
├── Arrastar arquivo ou clicar para selecionar
├── Tipos aceitos: MP4, PDF, PNG, JPG (com validação)
├── Barra de progresso do upload
├── Configuração: "Permitir download?" | "Exibir em popup?"
├── Feedback: "Upload concluído" + Preview
└── Botão: "Inserir no curso"
```

### 7. Gestão de Usuários
```
[Listagem de Usuários]
├── Filtros: Nome | E-mail | Perfil | Status | Departamento
├── Tabela: Avatar | Nome | E-mail | Perfil | Cursos | Último acesso | Status
├── Ações: Editar | Atribuir curso | Bloquear | Excluir
└── Botão: "+ Novo usuário" / "Importar CSV"

[Modal Atribuir Curso]
├── Busca: Nome do curso
├── Selecionar: Aluno(s) ou grupo
├── Configuração: Data limite
└── Botão: "Atribuir"
```

### 8. Gestão de Trilhas
```
[Trilhas de Aprendizado]
├── Listagem: Nome | Cursos | Duração estimada | Alunos
├── Botão: "+ Nova Trilha"

[Formulário Trilha]
├── Campos: Nome | Descrição | Disciplinas
├── Seletor: Adicionar cursos à trilha (ordem)
├── Configuração: Recompensa (pontos/badge)
└── Botão: "Criar Trilha"
```

### 9. Emissão de Certificados (Admin)
```
[Listagem de Certificados Emitidos]
├── Filtros: Aluno | Curso | Data | Status
├── Tabela: Aluno | Curso | Data | Código | Status | Ações
├── Ações: Visualizar | Baixar | Revogar | Enviar por e-mail

[Emitir Manualmente]
├── Selecionar: Aluno | Curso
├── Data de emissão
├── Botão: "Emitir certificado"
└── Feedback: "Certificado emitido com sucesso"
```

### 10. Relatórios e Exportação
```
[Relatórios]
├── Seletor: Tipo de relatório
│   ├── Progresso por aluno
│   ├── Progresso por curso
│   ├── Taxa de conclusão
│   ├── Tempo médio de estudo
│   └── Ranking de pontos
├── Filtros: Período | Departamento | Curso
├── Visualização: Tabela + Gráficos
└── Botão: "Exportar CSV" | "Exportar Excel"

[Relatório Individual do Aluno]
├── Dados: Nome | E-mail | Departamento | Perfil
├── Cursos: Andamento | Concluídos | Pendentes
├── Progresso: Gráfico de barras por curso
├── Certificados emitidos
├── Pontos e badges
└── Botões: "Editar usuário" | "Atribuir curso" | "Gerar relatório PDF"
```

### 11. Configurações (Admin)
```
[Tabs de Configuração]
├── Geral: Nome da instituição | Logo | Cores | Tipografia
├── Prazos: Dias padrão para conclusão | Avisos
├── Gamificação: Pontos por ação | Badges | Rankings
├── Notificações: E-mail | Push | In-app
├── Segurança: Autenticação | LGPD | Termos
├── Integrações: Webhooks | API
└── Backup: Exportar dados | Restaurar
```

---

## 🔘 MAPA COMPLETO DE BOTÕES E AÇÕES

### ALUNO

| Local | Botão | Ação | Feedback |
|-------|-------|------|----------|
| Landing | "Entrar" | Abre modal de login | Modallogin |
| Landing | "Cadastrar" | Abre modal de cadastro | Modalcadastro |
| Landing | "Explorar cursos" | Scroll para seção de cursos | Animação scroll |
| Landing | "Conhecer trilhas" | Scroll para seção de trilhas | Animação scroll |
| Landing Header | Item menu | Scroll suave para seção | Animação scroll |
| Dashboard | "Continuar" (curso) | Abre área do curso | Navega para conteúdo |
| Dashboard | "Ver certificados" | Abre lista de certificados | Modal listagem |
| Dashboard | "Ver todos os cursos" | Expande grid de cursos | Anima grid |
| Curso | "Marcar como concluída" | Registra conclusão + próxima aula | Toast + auto-avança |
| Curso | "Emitir certificado" | Gera PDF do certificado | Download PDF |
| Curso | "Baixar material" | Download do PDF | Browser download |
| Quiz | "Próxima" | Avança pergunta | Feedback visual |
| Quiz | "Finalizar" | Calcula nota | Mostra resultado |
| Certificado | "Visualizar" | Abre modal preview | Modal preview |
| Certificado | "Baixar PDF" | Download do certificado | Browser download |
| Certificado | "Compartilhar" | Copia link ou share social | Toast "Link copiado" |
| Perfil | "Editar" | Abre form de edição | Modal edição |
| Perfil | "Salvar" | Salva alterações | Toast "Salvo" |

### ADMIN

| Local | Botão | Ação | Feedback |
|-------|-------|------|----------|
| Sidebar | "Dashboard" | Volta para visão geral | Navega |
| Sidebar | "Cursos" | Abre gestão de cursos | Lista cursos |
| Sidebar | "Usuários" | Abre gestão de usuários | Lista usuários |
| Sidebar | "Trilhas" | Abre gestão de trilhas | Lista trilhas |
| Sidebar | "Certificados" | Abre gestão de certificados | Lista certificados |
| Sidebar | "Relatórios" | Abre módulo de relatórios | Show relatórios |
| Sidebar | "Configurações" | Abre painel de configurações | Show config |
| Cursos | "+ Novo Curso" | Abre modal de criação | Modal form |
| Cursos | "Salvar rascunho" | Salva como rascunho | Toast "Rascunho salvo" |
| Cursos | "Publicar" | Publica curso | Toast "Publicado" + atualiza status |
| Cursos | "Editar" | Abre form de edição | Modal edição |
| Cursos | "Excluir" | Confirmação + exclui | Modal confirmação |
| Módulos | "+ Adicionar módulo" | Cria novo módulo | Toast "Módulo criado" |
| Módulos | "+ Adicionar aula" | Abre seletor de tipo | Modal tipo aula |
| Módulos | "Upload" | Abre dialog de upload | Progresso upload |
| Módulos | "Preview" | Abre preview do curso | Nova aba/window |
| Usuários | "+ Novo usuário" | Abre form de criação | Modal form |
| Usuários | "Atribuir curso" | Abre modal de atribuição | Modal atribuir |
| Usuários | "Bloquear" | Bloqueia acesso do usuário | Toast "Usuário bloqueado" |
| Usuários | "Exportar CSV" | Exporta tabela | Download arquivo |
| Certificados | "Emitir" | Emite certificado manual | Toast "Emitido" |
| Certificados | "Revogar" | Confirma + revoga | Modal confirmação |
| Certificados | "Enviar e-mail" | Reenvia por e-mail | Toast "E-mail enviado" |
| Relatórios | "Exportar" | Exporta dados | Download arquivo |
| Config | "Salvar" | Salva configurações | Toast "Salvo" |

---

## 🔄 FLUXO DE ESTADOS E TRANSIÇÕES

### Fluxo de Matrícula
```
Disponível → Matriculado → Em andamento → Completo → Certificado
                    ↓
              (se prazo expirar) → Expirado
```

### Fluxo de Aula
```
Trancada → Disponível → Em andamento → Concluída
                ↓                    ↓
         (se pré-requisito      (avança para
          não cumprido)          próxima ou
                               emite certificado)
```

### Fluxo de Quiz
```
Não iniciado → Em andamento → Finalizado → Aprovado/Reprovado
                           ↓
                    (até 3 tentativas)
```

---

## ⚠️ REGRAS DE NEGÓCIO CRÍTICAS

1. **Pré-requisitos**: Módulo B só libera se Módulo A concluído (validado em Security Rules)
2. **Progresso mínimo**: Video precisa 80% assistido; PDF mínimo 30 segundos
3. **Prazos**: Status muda para `expired` se `now > startedAt + deadlineDays`
4. **Certificados**: Hash imutável após emissão; validação pública por `/validate?hash=...`
5. **Tentativas de Quiz**: Máximo 3 (configurável)
6. **Consentimento LGPD**: Obrigatório antes de acessar conteúdo

---

## 📱 RESPONSIVIDADE

| Tela | Layout | Comportamentos |
|------|--------|----------------|
| Desktop (>1024px) | Sidebar fixa + conteúdo | Navegação horizontal no header |
| Tablet (768-1023px) | Sidebar colapsável | Menu hamburger |
| Mobile (<768px) | Bottom nav ou drawer | Menu drawer da esquerda |

---

## 🚦 TOASTS E FEEDBACKS

| Tipo | Uso | Duração |
|------|-----|---------|
| Sucesso | Ação completada | 3s |
| Erro | Ação falhou | 5s |
| Info | Aviso geral | 3s |
| Loading | Processando | Spinner |
| Confirm | Ação destrutiva | Await |

---

*Documento criado em: 30/05/2026*
*Versão: 1.0*