import { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Calculator, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Send, 
  ShieldAlert,
  ArrowRight,
  Clock,
  Briefcase
} from 'lucide-react';

interface QuestionFeedback {
  campo: string;
  esperado: string;
  preenchido: string;
  correto: boolean;
  pontos: number;
}

export default function App() {
  // Estado da Sessão e Simulação
  const [alunoNome] = useState('scatigero');
  const [etapa, setEtapa] = useState<'empresa' | 'colaborador' | 'folha' | 'resultado'>('empresa');
  const [tentativaFinalizada, setTentativaFinalizada] = useState(false);

  // Formulário - Etapa 1: Empresa
  const [empresa, setEmpresa] = useState({
    razaoSocial: '',
    cnpj: '',
    regimeTributario: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  // Formulário - Etapa 2: Colaborador
  const [colaborador, setColaborador] = useState({
    nomeCompleto: '',
    cpf: '',
    rg: '',
    nomeMae: '',
    dataNascimento: '',
    dataAdmissao: '',
    dataExameAdmissional: '',
    cargo: '',
    salarioBase: ''
  });

  // Formulário - Etapa 3: Folha
  const [folha, setFolha] = useState({
    salarioBruto: '',
    descontoInss: '',
    descontoIrrf: '',
    outrosDescontos: '',
    salarioLiquido: ''
  });

  // Gabarito do Estudo de Caso Atual
  const gabarito = {
    empresa: {
      cnpj: '12.345.678/0001-90',
      regimeTributario: 'Simples Nacional',
      cidade: 'São Paulo',
      uf: 'SP'
    },
    colaborador: {
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      nomeMae: 'Maria da Silva',
      cargo: 'Assistente Administrativo',
      salarioBase: '3000.00'
    },
    folha: {
      salarioBruto: '3000.00',
      descontoInss: '269.00',
      descontoIrrf: '61.00',
      salarioLiquido: '2670.00'
    }
  };

  // Resultado
  const [resultado, setResultado] = useState<{
    notaFinal: number;
    totalAcertos: number;
    totalItens: number;
    feedbacks: QuestionFeedback[];
  } | null>(null);

  const handleSubmeterAvaliacao = () => {
    if (tentativaFinalizada) return;

    const feedbacks: QuestionFeedback[] = [];
    let pontosAcumulados = 0;

    // 1. Validação Empresa (Peso Total: 2.5)
    const cnpjCorreto = empresa.cnpj.replace(/\D/g, '') === gabarito.empresa.cnpj.replace(/\D/g, '');
    feedbacks.push({
      campo: 'CNPJ da Empresa',
      esperado: gabarito.empresa.cnpj,
      preenchido: empresa.cnpj || 'Não preenchido',
      correto: cnpjCorreto,
      pontos: cnpjCorreto ? 1.0 : 0
    });
    if (cnpjCorreto) pontosAcumulados += 1.0;

    const regimeCorreto = empresa.regimeTributario.toLowerCase() === gabarito.empresa.regimeTributario.toLowerCase();
    feedbacks.push({
      campo: 'Regime Tributário',
      esperado: gabarito.empresa.regimeTributario,
      preenchido: empresa.regimeTributario || 'Não preenchido',
      correto: regimeCorreto,
      pontos: regimeCorreto ? 1.5 : 0
    });
    if (regimeCorreto) pontosAcumulados += 1.5;

    // 2. Validação Colaborador (Peso Total: 3.5)
    const cpfCorreto = colaborador.cpf.replace(/\D/g, '') === gabarito.colaborador.cpf.replace(/\D/g, '');
    feedbacks.push({
      campo: 'CPF do Colaborador',
      esperado: gabarito.colaborador.cpf,
      preenchido: colaborador.cpf || 'Não preenchido',
      correto: cpfCorreto,
      pontos: cpfCorreto ? 1.0 : 0
    });
    if (cpfCorreto) pontosAcumulados += 1.0;

    const maeCorreta = colaborador.nomeMae.trim().toLowerCase() === gabarito.colaborador.nomeMae.toLowerCase();
    feedbacks.push({
      campo: 'Filiação Obrigatória (Nome da Mãe)',
      esperado: gabarito.colaborador.nomeMae,
      preenchido: colaborador.nomeMae || 'Não preenchido',
      correto: maeCorreta,
      pontos: maeCorreta ? 1.0 : 0
    });
    if (maeCorreta) pontosAcumulados += 1.0;

    // Exame Admissional <= Admissao
    const asoValido = colaborador.dataExameAdmissional && colaborador.dataAdmissao && (colaborador.dataExameAdmissional <= colaborador.dataAdmissao);
    feedbacks.push({
      campo: 'Coerência ASO vs Admissão (Exame ≤ Admissão)',
      esperado: 'ASO realizado antes ou na data da admissão',
      preenchido: asoValido ? `ASO: ${colaborador.dataExameAdmissional} | Admissão: ${colaborador.dataAdmissao}` : 'ASO posterior à admissão ou inválido',
      correto: !!asoValido,
      pontos: asoValido ? 1.5 : 0
    });
    if (asoValido) pontosAcumulados += 1.5;

    // 3. Validação Folha de Pagamento (Peso Total: 4.0)
    const inssCorreto = Math.abs(parseFloat(folha.descontoInss || '0') - parseFloat(gabarito.folha.descontoInss)) < 1.0;
    feedbacks.push({
      campo: 'Cálculo de Desconto INSS',
      esperado: `R$ ${gabarito.folha.descontoInss}`,
      preenchido: `R$ ${folha.descontoInss || '0.00'}`,
      correto: inssCorreto,
      pontos: inssCorreto ? 1.5 : 0
    });
    if (inssCorreto) pontosAcumulados += 1.5;

    const irrfCorreto = Math.abs(parseFloat(folha.descontoIrrf || '0') - parseFloat(gabarito.folha.descontoIrrf)) < 1.0;
    feedbacks.push({
      campo: 'Cálculo de Desconto IRRF',
      esperado: `R$ ${gabarito.folha.descontoIrrf}`,
      preenchido: `R$ ${folha.descontoIrrf || '0.00'}`,
      correto: irrfCorreto,
      pontos: irrfCorreto ? 1.0 : 0
    });
    if (irrfCorreto) pontosAcumulados += 1.0;

    const liquidoCorreto = Math.abs(parseFloat(folha.salarioLiquido || '0') - parseFloat(gabarito.folha.salarioLiquido)) < 1.0;
    feedbacks.push({
      campo: 'Salário Líquido Final',
      esperado: `R$ ${gabarito.folha.salarioLiquido}`,
      preenchido: `R$ ${folha.salarioLiquido || '0.00'}`,
      correto: liquidoCorreto,
      pontos: liquidoCorreto ? 1.5 : 0
    });
    if (liquidoCorreto) pontosAcumulados += 1.5;

    const totalAcertos = feedbacks.filter(f => f.correto).length;

    setResultado({
      notaFinal: Number(pontosAcumulados.toFixed(2)),
      totalAcertos,
      totalItens: feedbacks.length,
      feedbacks
    });

    setTentativaFinalizada(true);
    setEtapa('resultado');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Superior Verde Sálvia */}
      <header style={{
        background: 'linear-gradient(135deg, #2f3e46 0%, #354f52 100%)',
        color: '#ffffff',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px solid #84a98c',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: '#52796f',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(132, 169, 140, 0.4)'
          }}>
            <Briefcase size={24} color="#cad2c5" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.5px' }}>RECURSOS HUMANOS</h1>
            <p style={{ fontSize: '0.8rem', color: '#cad2c5' }}>Simulador & Avaliação Prática de Folha de Pagamento</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <UserCheck size={16} color="#84a98c" />
            <span>Aluno: <strong>{alunoNome}</strong></span>
          </div>

          <div style={{
            background: tentativaFinalizada ? '#b7094c' : '#52796f',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Clock size={16} />
            <span>{tentativaFinalizada ? 'Tentativa Encerrada' : 'Tentativa 1 de 1'}</span>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem 1.5rem' }}>
        
        {/* Enunciado do Estudo de Caso */}
        <section style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #cad2c5',
          boxShadow: '0 4px 16px rgba(47, 62, 70, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#52796f', marginBottom: '0.5rem' }}>
            <Sparkles size={20} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Estudo de Caso Prático: Admissão e Fechamento Mensal</h2>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#2f3e46', lineHeight: 1.6 }}>
            Cadastre a empresa optante pelo <strong>Simples Nacional</strong> de CNPJ <code>12.345.678/0001-90</code>. Em seguida, realize o cadastro de admissão do colaborador <strong>Assistente Administrativo</strong> com salário base de <strong>R$ 3.000,00</strong> e filiação materna <strong>Maria da Silva</strong>. Por fim, calcule e registre os descontos de <strong>INSS (R$ 269,00)</strong>, <strong>IRRF (R$ 61,00)</strong> e o <strong>Salário Líquido</strong> correspondente.
          </p>
          <div style={{
            marginTop: '1rem',
            background: '#f4f6f4',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            borderLeft: '4px solid #52796f',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: '#2f3e46'
          }}>
            <ShieldAlert size={18} color="#52796f" />
            <span><strong>Atenção:</strong> Você possui <strong>apenas 01 chance</strong> de envio. Revise com atenção antes de submeter!</span>
          </div>
        </section>

        {/* Stepper de Navegação */}
        <nav style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setEtapa('empresa')}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              background: etapa === 'empresa' ? '#52796f' : '#ffffff',
              color: etapa === 'empresa' ? '#ffffff' : '#2f3e46',
              boxShadow: etapa === 'empresa' ? '0 4px 12px rgba(82, 121, 111, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
              borderBottom: etapa === 'empresa' ? '3px solid #354f52' : '1px solid #cad2c5'
            }}
          >
            <Building2 size={18} />
            1. Empresa
          </button>

          <button
            onClick={() => setEtapa('colaborador')}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              background: etapa === 'colaborador' ? '#52796f' : '#ffffff',
              color: etapa === 'colaborador' ? '#ffffff' : '#2f3e46',
              boxShadow: etapa === 'colaborador' ? '0 4px 12px rgba(82, 121, 111, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
              borderBottom: etapa === 'colaborador' ? '3px solid #354f52' : '1px solid #cad2c5'
            }}
          >
            <UserCheck size={18} />
            2. Colaborador
          </button>

          <button
            onClick={() => setEtapa('folha')}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              background: etapa === 'folha' ? '#52796f' : '#ffffff',
              color: etapa === 'folha' ? '#ffffff' : '#2f3e46',
              boxShadow: etapa === 'folha' ? '0 4px 12px rgba(82, 121, 111, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
              borderBottom: etapa === 'folha' ? '3px solid #354f52' : '1px solid #cad2c5'
            }}
          >
            <Calculator size={18} />
            3. Folha de Pagamento
          </button>

          <button
            onClick={() => tentativaFinalizada && setEtapa('resultado')}
            disabled={!tentativaFinalizada}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: tentativaFinalizada ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: etapa === 'resultado' ? '#2f3e46' : '#ffffff',
              color: etapa === 'resultado' ? '#ffffff' : (tentativaFinalizada ? '#2f3e46' : '#a0aec0'),
              boxShadow: etapa === 'resultado' ? '0 4px 12px rgba(47, 62, 70, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
              borderBottom: etapa === 'resultado' ? '3px solid #84a98c' : '1px solid #cad2c5',
              opacity: tentativaFinalizada ? 1 : 0.6
            }}
          >
            <Award size={18} />
            4. Resultado & Nota
          </button>
        </nav>

        {/* Formulário: 1. Empresa */}
        {etapa === 'empresa' && (
          <div className="animate-fade-in" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid #cad2c5',
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f3e46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 color="#52796f" /> Cadastro Inicial da Empresa
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Razão Social *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="text"
                  placeholder="Ex: Solverde Soluções Empresariais LTDA"
                  value={empresa.razaoSocial}
                  onChange={(e) => setEmpresa({ ...empresa, razaoSocial: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem', outlineColor: '#52796f' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>CNPJ *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={empresa.cnpj}
                  onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem', outlineColor: '#52796f' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Regime Tributário *</label>
                <select
                  disabled={tentativaFinalizada}
                  value={empresa.regimeTributario}
                  onChange={(e) => setEmpresa({ ...empresa, regimeTributario: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem', outlineColor: '#52796f', background: '#fff' }}
                >
                  <option value="">Selecione o Regime...</option>
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
                  <option value="MEI">MEI</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Cidade / UF *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    disabled={tentativaFinalizada}
                    type="text"
                    placeholder="Cidade"
                    value={empresa.cidade}
                    onChange={(e) => setEmpresa({ ...empresa, cidade: e.target.value })}
                    style={{ flex: 3, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                  />
                  <input
                    disabled={tentativaFinalizada}
                    type="text"
                    placeholder="UF"
                    maxLength={2}
                    value={empresa.uf}
                    onChange={(e) => setEmpresa({ ...empresa, uf: e.target.value.toUpperCase() })}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem', textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEtapa('colaborador')}
                style={{
                  background: '#52796f',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Próximo: Cadastrar Colaborador <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Formulário: 2. Colaborador */}
        {etapa === 'colaborador' && (
          <div className="animate-fade-in" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid #cad2c5',
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f3e46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck color="#52796f" /> Cadastro Completo do Colaborador
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Nome Completo *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="text"
                  placeholder="Nome do colaborador"
                  value={colaborador.nomeCompleto}
                  onChange={(e) => setColaborador({ ...colaborador, nomeCompleto: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>CPF *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="text"
                  placeholder="000.000.000-00"
                  value={colaborador.cpf}
                  onChange={(e) => setColaborador({ ...colaborador, cpf: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>RG *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="text"
                  placeholder="Número do RG"
                  value={colaborador.rg}
                  onChange={(e) => setColaborador({ ...colaborador, rg: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Nome da Mãe (Obrigatório eSocial) *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="text"
                  placeholder="Nome completo da mãe"
                  value={colaborador.nomeMae}
                  onChange={(e) => setColaborador({ ...colaborador, nomeMae: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Data do Exame Admissional (ASO) *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="date"
                  value={colaborador.dataExameAdmissional}
                  onChange={(e) => setColaborador({ ...colaborador, dataExameAdmissional: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Data de Admissão *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="date"
                  value={colaborador.dataAdmissao}
                  onChange={(e) => setColaborador({ ...colaborador, dataAdmissao: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Cargo *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="text"
                  placeholder="Ex: Assistente Administrativo"
                  value={colaborador.cargo}
                  onChange={(e) => setColaborador({ ...colaborador, cargo: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Salário Base (R$) *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="number"
                  step="0.01"
                  placeholder="3000.00"
                  value={colaborador.salarioBase}
                  onChange={(e) => setColaborador({ ...colaborador, salarioBase: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setEtapa('empresa')}
                style={{
                  background: '#f4f6f4',
                  color: '#2f3e46',
                  border: '1px solid #cad2c5',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Voltar: Empresa
              </button>

              <button
                onClick={() => setEtapa('folha')}
                style={{
                  background: '#52796f',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Próximo: Folha de Pagamento <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Formulário: 3. Folha de Pagamento */}
        {etapa === 'folha' && (
          <div className="animate-fade-in" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid #cad2c5',
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f3e46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator color="#52796f" /> Cálculos da Folha de Pagamento
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Salário Bruto (Proventos) *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="number"
                  step="0.01"
                  placeholder="Ex: 3000.00"
                  value={folha.salarioBruto}
                  onChange={(e) => setFolha({ ...folha, salarioBruto: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Desconto INSS (Tabela Progressiva) *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="number"
                  step="0.01"
                  placeholder="Ex: 269.00"
                  value={folha.descontoInss}
                  onChange={(e) => setFolha({ ...folha, descontoInss: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Desconto IRRF (Dedução Oficial) *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="number"
                  step="0.01"
                  placeholder="Ex: 61.00"
                  value={folha.descontoIrrf}
                  onChange={(e) => setFolha({ ...folha, descontoIrrf: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cad2c5', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3e46', marginBottom: '0.4rem' }}>Salário Líquido Final *</label>
                <input
                  disabled={tentativaFinalizada}
                  type="number"
                  step="0.01"
                  placeholder="Ex: 2670.00"
                  value={folha.salarioLiquido}
                  onChange={(e) => setFolha({ ...folha, salarioLiquido: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #52796f', fontWeight: 700, fontSize: '1rem', background: '#f4f6f4' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setEtapa('colaborador')}
                style={{
                  background: '#f4f6f4',
                  color: '#2f3e46',
                  border: '1px solid #cad2c5',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Voltar: Colaborador
              </button>

              {!tentativaFinalizada ? (
                <button
                  onClick={handleSubmeterAvaliacao}
                  style={{
                    background: 'linear-gradient(135deg, #2d6a4f 0%, #52796f 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.85rem 2rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 4px 16px rgba(45, 106, 79, 0.4)'
                  }}
                >
                  <Send size={18} /> Finalizar e Submeter Avaliação (Única Chance)
                </button>
              ) : (
                <button
                  onClick={() => setEtapa('resultado')}
                  style={{
                    background: '#2f3e46',
                    color: '#fff',
                    border: 'none',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Ver Relatório da Avaliação <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. Resultado e Nota Final */}
        {etapa === 'resultado' && resultado && (
          <div className="animate-fade-in" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '1px solid #cad2c5',
            boxShadow: '0 8px 30px rgba(47, 62, 70, 0.1)'
          }}>
            {/* Card da Nota */}
            <div style={{
              background: resultado.notaFinal >= 7 ? 'linear-gradient(135deg, #2d6a4f 0%, #52796f 100%)' : 'linear-gradient(135deg, #b7094c 0%, #890620 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
            }}>
              <Award size={48} style={{ margin: '0 auto 0.5rem', color: '#cad2c5' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {resultado.notaFinal >= 7 ? 'Parabéns! Avaliação Aprovada' : 'Avaliação Concluída'}
              </h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, margin: '0.5rem 0', letterSpacing: '-1px' }}>
                {resultado.notaFinal.toFixed(1)} <span style={{ fontSize: '1.5rem', fontWeight: 500, color: '#cad2c5' }}>/ 10.0</span>
              </div>
              <p style={{ fontSize: '1.05rem', opacity: 0.95 }}>
                Você acertou <strong>{resultado.totalAcertos}</strong> de <strong>{resultado.totalItens}</strong> critérios avaliados.
              </p>
            </div>

            {/* Detalhamento Pedagógico Campo a Campo */}
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f3e46', marginBottom: '1rem' }}>
              Detalhamento dos Critérios e Gabarito
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resultado.feedbacks.map((fb, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: fb.correto ? 'rgba(45, 106, 79, 0.05)' : 'rgba(183, 9, 76, 0.05)',
                  border: `1px solid ${fb.correto ? '#84a98c' : '#f4978e'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {fb.correto ? (
                      <CheckCircle2 size={24} color="#2d6a4f" />
                    ) : (
                      <XCircle size={24} color="#b7094c" />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2f3e46' }}>{fb.campo}</div>
                      <div style={{ fontSize: '0.85rem', color: '#5c6b65' }}>
                        Preenchido: <strong>{fb.preenchido}</strong> | Gabarito: <strong>{fb.esperado}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: fb.correto ? '#2d6a4f' : '#b7094c'
                  }}>
                    {fb.pontos > 0 ? `+${fb.pontos.toFixed(1)} pts` : '0.0 pts'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
