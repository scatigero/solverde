# Regras de Negócio — Sistema Prático de Avaliação: Folha de Pagamento & RH

Este documento estabelece as especificações funcionais, regras de negócio e o **Módulo Avaliativo/Prático para Alunos** da aplicação de Folha de Pagamento e Recursos Humanos.

---

## 1. Módulo: Empresa (Cadastro e Configuração Inicial)

### 1.1 Identificação e Validações Cadastrais
- **RN-EMP-001 (Unicidade do CNPJ):** Não é permitido o cadastro de duas empresas ativas com o mesmo número de CNPJ. O formato deve ser validado via algoritmo padrão de dígitos verificadores do CNPJ.
- **RN-EMP-002 (Obrigatoriedade de Campos):** Razão Social, CNPJ, Regime Tributário e endereço completo (Logradouro, Número, Bairro, Cidade e UF) são de preenchimento obrigatório.
- **RN-EMP-003 (Regime Tributário):** O regime tributário define as alíquotas patronais e parâmetros fiscais. Valores permitidos:
  - `Simples Nacional`
  - `Lucro Presumido`
  - `Lucro Real`
  - `MEI`

---

## 2. Módulo: Colaboradores (Gestão de Pessoal e Admissão)

### 2.1 Dados Pessoais e Validações
- **RN-COL-001 (Validação de CPF):** O CPF do colaborador deve ser único no sistema e válido de acordo com o algoritmo oficial da Receita Federal.
- **RN-COL-002 (Filiação):** O campo `nome_mae` é obrigatório para cumprimento de exigências do eSocial/MTE. O campo `nome_pai` é opcional.
- **RN-COL-003 (Maioridade e Idade Mínima):** 
  - A idade mínima para contratação em regime CLT padrão é de 16 anos.
  - Menores entre 14 e 16 anos só podem ser admitidos na modalidade `Menor Aprendiz` / `Estágio`.

### 2.2 Admissão e Exames Ocupacionais
- **RN-COL-004 (Exame Médico Admissional - ASO):**
  - O exame médico admissional é obrigatório para regime CLT.
  - A `data_exame_admissional` deve ser igual ou anterior à `data_admissao` (nunca posterior).
- **RN-COL-005 (Salário Base e Cargo):**
  - O `salario_base` não pode ser inferior ao Piso Salarial da categoria ou ao Salário Mínimo vigente.
  - Todo colaborador deve estar vinculado a um cargo e a uma empresa ativa.

### 2.3 Status do Colaborador
- **RN-COL-006 (Transições de Status):**
  - `Ativo`, `Férias`, `Afastado`, `Desligado`.

---

## 3. Módulo: Folha de Pagamento (Cálculos e Descontos)

### 3.1 Proventos e Descontos Oficiais
- **RN-FOL-001 (Cálculo de Proventos):** Salário Base + Horas Extras + Adicionais (Noturno, Insalubridade, Periculosidade) + Bonificações.
- **RN-FOL-002 (Cálculo do INSS):** Aplicação correta das faixas progressivas da tabela de INSS.
- **RN-FOL-003 (Cálculo do IRRF):** Aplicação da base de cálculo deduzida (Salário Bruto - INSS - Dependentes) sobre a tabela progressiva de IRRF.
- **RN-FOL-004 (Salário Líquido):** Total de Proventos - Total de Descontos (INSS, IRRF, VT, etc.).

---

## 4. Módulo de Avaliação Prática do Aluno (Simulador / Desafio)

Este módulo rege o funcionamento das tarefas práticas executadas por alunos.

### 4.1 Regra de Tentativa Única
- **RN-AVA-001 (Tentativa Única - Sem Segunda Chance):**
  - O aluno terá **apenas 01 (uma) única oportunidade** para submeter a avaliação prática.
  - Ao iniciar a simulação prática, o sistema vincula a sessão ao `aluno_id`.
  - Uma vez clicado em **"Finalizar e Submeter Avaliação"**, o envio é bloqueado para novas tentativas e os dados são congelados.

### 4.2 Critérios de Avaliação e Pontuação (Total: 10 Pontos)
A avaliação é dividida em 3 etapas de verificação automática contra o gabarito/cenário proposto ao aluno:

| Etapa | Critérios Avaliados | Peso / Pontuação |
| :--- | :--- | :--- |
| **1. Cadastro da Empresa** | • Validade e exatidão do CNPJ<br>• Enquadramento do Regime Tributário correto<br>• Endereço completo sem divergências | **2,5 pontos** |
| **2. Cadastro do Colaborador** | • Validação de CPF e RG<br>• Filiação obrigatória correta (Nome da Mãe)<br>• Data de Admissão e coerência da Data do Exame Admissional (ASO)<br>• Cargo e Salário Base | **3,5 pontos** |
| **3. Folha de Pagamento** | • Cálculo exato do Salário Bruto<br>• Cálculo exato do desconto de INSS<br>• Cálculo exato do desconto de IRRF<br>• Cálculo exato de outros descontos (ex: VT)<br>• Salário Líquido final exato | **4,0 pontos** |

### 4.3 Relatório Final de Desempenho e Feedback
- **RN-AVA-002 (Cálculo da Nota Final):**
  $$\text{Nota Final} = \text{Soma dos Pontos dos Itens Corretos} \quad (0.0 \text{ a } 10.0)$$
- **RN-AVA-003 (Resultado Imediato ao Aluno):**
  - O sistema exibe um relatório com:
    - **Total de Itens Avaliados** vs **Total de Acertos**.
    - **Nota Final (0 a 10)**.
    - **Status de Aprovação** (ex: Aprovado se Nota $\ge 7.0$, Reprovado se Nota $< 7.0$).
    - **Detalhamento do Gabarito:** Demonstração dos campos onde o aluno acertou e onde errou, com a respectiva justificativa pedagógica e memória de cálculo.

---

## 5. Segurança, Auditoria e Multi-tenant
- **RN-SEC-001 (RLS):** Cada aluno tem acesso isolado aos seus dados simulados.
- **RN-SEC-002 (Bloqueio de Edição Pós-Envio):** Garantia via banco de dados (`status_avaliacao = 'CONCLUIDA'`) de que nenhum registro pode ser alterado após a finalização.
