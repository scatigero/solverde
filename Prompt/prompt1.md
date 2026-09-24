# Prompt 1 — Base do Projeto + Banco de Dados Neon (Folha de Pagamento & Avaliação de RH)

Você vai criar a estrutura do banco de dados para um **Sistema de Avaliação Prática em Folha de Pagamento e Recursos Humanos**. Você tem acesso ao Neon via MCP e o projeto já foi criado com o nome de **"RECURSOS HUMANOS"**. Portanto, crie toda a estrutura diretamente via MCP, sem necessidade de intervenção manual.

---

## Estrutura do Banco de Dados

Crie as tabelas abaixo com todos os campos e relacionamentos:

### 1. Tabela `alunos` (Identificação do Aluno)
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `nome` (text, not null)
- `email` (text, not null, unique)
- `matricula` (text, unique)
- `created_at` (timestamp with time zone, default `now()`)

---

### 2. Tabela `cenarios_avaliacao` (Gabarito / Estudo de Caso Proposto)
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `titulo` (text, not null)
- `descricao_enunciado` (text, not null)
- `gabarito_empresa` (jsonb, not null) — *(dados esperados: cnpj, regime, endereço, etc.)*
- `gabarito_colaborador` (jsonb, not null) — *(dados esperados: cpf, rg, mae, admissao, aso, salario, etc.)*
- `gabarito_folha` (jsonb, not null) — *(valores esperados: inss, irrf, descontos, salario_liquido, etc.)*
- `ativo` (boolean, default true)
- `created_at` (timestamp with time zone, default `now()`)

---

### 3. Tabela `avaliacoes_aluno` (Controle de Tentativa Única e Nota de 0 a 10)
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `aluno_id` (uuid, not null, foreign key → `alunos.id` on delete cascade)
- `cenario_id` (uuid, not null, foreign key → `cenarios_avaliacao.id`)
- `status` (text, not null, default 'EM_ANDAMENTO') — *(valores: 'EM_ANDAMENTO', 'FINALIZADA')*
- `total_questoes` (integer, default 0)
- `total_acertos` (integer, default 0)
- `nota_final` (numeric(4, 2)) — *(nota de 0.00 a 10.00)*
- `feedback_detalhado` (jsonb) — *(erros e acertos por etapa)*
- `iniciado_em` (timestamp with time zone, default `now()`)
- `finalizado_em` (timestamp with time zone)
- **Restrição**: `UNIQUE(aluno_id, cenario_id)` — *(Garante apenas **01 chance** por aluno em cada avaliação)*

---

### 4. Tabela `empresas` (Cadastro da Empresa Realizado pelo Aluno)
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `avaliacao_id` (uuid, not null, foreign key → `avaliacoes_aluno.id` on delete cascade)
- `razao_social` (text, not null)
- `nome_fantasia` (text)
- `cnpj` (text, not null)
- `regime_tributario` (text, not null)
- `inscricao_estadual` (text)
- `inscricao_municipal` (text)
- `email` (text)
- `telefone` (text)
- `cep` (text)
- `logradouro` (text, not null)
- `numero` (text, not null)
- `complemento` (text)
- `bairro` (text, not null)
- `cidade` (text, not null)
- `uf` (varchar(2), not null)
- `created_at` (timestamp with time zone, default `now()`)

---

### 5. Tabela `colaboradores` (Cadastro do Colaborador Realizado pelo Aluno)
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `avaliacao_id` (uuid, not null, foreign key → `avaliacoes_aluno.id` on delete cascade)
- `empresa_id` (uuid, not null, foreign key → `empresas.id` on delete cascade)
- `nome_completo` (text, not null)
- `cpf` (text, not null)
- `rg` (text, not null)
- `orgao_emissor_rg` (text)
- `nome_mae` (text, not null)
- `nome_pai` (text)
- `data_nascimento` (date, not null)
- `estado_civil` (text, not null)
- `sexo` (text)
- `nacionalidade` (text, default 'Brasileira')
- `email` (text)
- `telefone` (text)
- `cep` (text)
- `logradouro` (text, not null)
- `numero` (text, not null)
- `complemento` (text)
- `bairro` (text, not null)
- `cidade` (text, not null)
- `uf` (varchar(2), not null)
- `cargo` (text, not null)
- `departamento` (text)
- `salario_base` (numeric(12, 2), not null)
- `data_admissao` (date, not null)
- `data_exame_admissional` (date, not null)
- `tipo_contrato` (text, default 'CLT')
- `jornada_trabalho` (text)
- `status` (text, default 'Ativo')
- `created_at` (timestamp with time zone, default `now()`)

---

### 6. Tabela `folhas_pagamento` (Cálculo da Folha Realizado pelo Aluno)
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `avaliacao_id` (uuid, not null, foreign key → `avaliacoes_aluno.id` on delete cascade)
- `empresa_id` (uuid, not null, foreign key → `empresas.id` on delete cascade)
- `colaborador_id` (uuid, not null, foreign key → `colaboradores.id` on delete cascade)
- `competencia_mes` (integer, not null)
- `competencia_ano` (integer, not null)
- `salario_bruto` (numeric(12, 2), not null)
- `desconto_inss` (numeric(12, 2), default 0)
- `desconto_irrf` (numeric(12, 2), default 0)
- `outros_descontos` (numeric(12, 2), default 0)
- `proventos_adicionais` (numeric(12, 2), default 0)
- `salario_liquido` (numeric(12, 2), not null)
- `created_at` (timestamp with time zone, default `now()`)

---

## Regras de Segurança e Banco de Dados
1. **Tentativa Única:** Constraint `UNIQUE(aluno_id, cenario_id)` na tabela `avaliacoes_aluno`.
2. **Row Level Security (RLS):** Ativar RLS em todas as tabelas para garantir que o aluno acesse unicamente seus próprios dados.
3. **Trigger de Bloqueio Pós-Submissão:** Impedir `UPDATE` ou `INSERT` nas tabelas `empresas`, `colaboradores` e `folhas_pagamento` se a avaliação estiver com `status = 'FINALIZADA'`.
4. **Confirmação:** Listar todas as tabelas criadas e confirmar a execução via MCP.