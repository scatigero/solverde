# Prompt 2 — Autenticação e Acesso do Aluno (Neon Auth + Frontend)

Agora vamos criar o módulo de autenticação e controle de acesso do sistema de **Folha de Pagamento & Recursos Humanos**. O sistema deve permitir que o **aluno** crie uma conta e faça login para acessar os estudos de caso e avaliações práticas. Use a autenticação integrada com o Neon Auth configurado no projeto **"Recursos Humano"**.

---

## 1. Tela de Login (`/login`)
- Campo de e-mail institucional/pessoal
- Campo de senha
- Botão "Entrar no Sistema"
- Link "Não tem cadastro de aluno? Crie sua conta"

---

## 2. Tela de Cadastro do Aluno (`/cadastro` ou `/register`)
- Campo de nome completo do aluno
- Campo de matrícula (opcional ou identificador acadêmico)
- Campo de e-mail
- Campo de senha
- Campo de confirmação de senha
- Botão "Criar Conta de Aluno"
- Link "Já possui cadastro? Faça login"

---

## 3. Regras de Negócio e Comportamento
- **Sincronização no Banco:** Após o cadastro bem-sucedido no Neon Auth, salvar/vincular os dados do aluno (`nome`, `email`, `matricula`) na tabela `alunos` do banco de dados Neon.
- **Redirecionamento:**
  - Após login bem-sucedido, redirecionar para o painel principal (`/dashboard` ou `/avaliacao`).
  - Se o usuário já estiver autenticado e tentar acessar `/login` ou `/cadastro`, redirecionar automaticamente para o painel.
  - Rotas internas protegidas: redirecionar para `/login` caso não haja sessão ativa.
- **Segurança e Senha:**
  - Senha com no mínimo 8 caracteres (com feedback visual de força de senha).
  - Validação de correspondência entre senha e confirmação de senha.
- **Persistência de Sessão:** Manter a sessão ativa (persistência segura de token/cookies) para que o aluno continue conectado entre recarregamentos de página.
- **Tratamento de Erros:** Exibir mensagens claras e acessíveis via toasts/alertas (ex.: credenciais inválidas, e-mail já em uso, erro de rede).

---

## 4. Stack Tecnológica
- **Framework:** React + Vite
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Shadcn/UI (ou Vanilla CSS com design tokens modernos)
- **Ícones:** Lucide React
- **Autenticação & Banco:** Neon Auth / Neon Postgres

---

## 5. Identidade Visual e Design
- **Estilo:** Interface limpa, profissional, moderna e focada em produtividade corporativa/educacional.
- **Paleta de Cores:**
  - Tom principal: Verde Sálvia (Sage Green) elegante e profissional (remetendo a equilíbrio, modernidade e sofisticação para o departamento de Recursos Humanos).
  - Fundo neutro com tons de branco/cinza claro e modo escuro sutil.
  - Cores semânticas para validação e status (sucesso, alerta, erro).
- **Branding:** Cabeçalho elegante com logotipo e texto **"RECURSOS HUMANOS"** ou **"RH & FOLHA DE PAGAMENTO - AVALIAÇÃO PRÁTICA"**.
