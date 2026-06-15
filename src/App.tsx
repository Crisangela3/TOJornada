import { useState } from 'react';
import { academicDatabase } from './data/questions';

export default function App() {
  const [semestre, setSemestre] = useState<number | null>(null);
  const [nivel, setNivel] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [idxPergunta, setIdxPergunta] = useState<number>(0);
  const [respondido, setRespondido] = useState<boolean>(false);
  const [altSelecionada, setAltSelecionada] = useState<number | null>(null);
  const [pontos, setPontos] = useState<number>(0);

  // Filtra os dados com base no banco existente
  const dadosSemestre = semestre ? academicDatabase[semestre] : null;
  const perguntasDisponiveis = dadosSemestre ? dadosSemestre.perguntas[nivel] : [];
  const perguntaAtual = perguntasDisponiveis[idxPergunta];

  const verificarResposta = (index: number) => {
    if (respondido || !perguntaAtual) return;
    setAltSelecionada(index);
    setRespondido(true);
    if (index === perguntaAtual.c) {
      const ganho = nivel === 'facil' ? 10 : nivel === 'medio' ? 20 : 30;
      setPontos(pontos + ganho);
    }
  };

  const avancarQuiz = () => {
    setRespondido(false);
    setAltSelecionada(null);
    if (idxPergunta + 1 < perguntasDisponiveis.length) {
      setIdxPergunta(idxPergunta + 1);
    } else {
      alert(`🎉 Fantástico! Você completou o nível ${nivel.toUpperCase()}!`);
      setSemestre(null);
      setIdxPergunta(0);
    }
  };

  return (
    <div style={styles.page}>
      {/* Injeção de Animações CSS direto no componente para evitar erros no Render */}
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatAvatar {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulseCard {
          0% { box-shadow: 0 10px 30px rgba(255,106,0,0.2); }
          50% { box-shadow: 0 10px 35px rgba(0,210,255,0.4); }
          100% { box-shadow: 0 10px 30px rgba(255,106,0,0.2); }
        }
        .btn-opcao:hover {
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
      `}</style>

      <div style={styles.container}>
        {/* Topo com o Avatar Animado */}
        <header style={styles.header}>
          <div style={{ animation: 'floatAvatar 3s ease-in-out infinite', display: 'inline-block', fontSize: '4.5rem' }}>👩‍💻</div>
          <h1 style={styles.mainTitle}>TOJornada</h1>
          <p style={styles.subtitle}>Desafie seus conhecimentos em Terapia Ocupacional!</p>
        </header>

        {/* MÓDULO 1: SELEÇÃO DE SEMESTRES (TELA INICIAL VIBRANTE) */}
        {semestre === null ? (
          <div style={{ ...styles.card, animation: 'pulseCard 4s infinite' }}>
            <h2 style={styles.cardTitle}>📍 Escolha sua Próxima Parada:</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>Selecione um dos períodos acadêmicos para ativar os Flashcards e Desafios:</p>
            
            <div style={styles.gridSemestres}>
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setSemestre(num)}
                  className="btn-opcao"
                  style={styles.btnSemestre}
                >
                  <span style={{ fontSize: '1.5rem', display: 'block' }}>📚</span>
                  {num}º Semestre
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* MÓDULO 2: O JOGO ATIVO */
          <div style={{ ...styles.card, borderTop: '8px solid var(--laranja)' }}>
            <button onClick={() => setSemestre(null)} className="btn-opcao" style={styles.btnVoltar}>
              ⬅️ Voltar ao Menu Principal
            </button>

            <div style={styles.quizHeader}>
              <div>
                <label style={{ fontWeight: 'bold', marginRight: '10px', color: '#0A2540' }}>Dificuldade:</label>
                <select
                  value={nivel}
                  onChange={(e) => {
                    setNivel(e.target.value as 'facil' | 'medio' | 'dificil');
                    setIdxPergunta(0);
                    setRespondido(false);
                    setAltSelecionada(null);
                  }}
                  style={styles.selectNivel}
                >
                  <option value="facil">🟢 Nível Fácil</option>
                  <option value="medio">🟡 Nível Médio</option>
                  <option value="dificil">🔴 Nível Difícil</option>
                </select>
              </div>
              <div style={styles.scoreBadge}>🏆 {pontos} Pontos</div>
            </div>

            {perguntaAtual ? (
              <div>
                <div style={styles.progresso}>Questão {idxPergunta + 1} de {perguntasDisponiveis.length}</div>
                <h3 style={styles.perguntaTexto}>{perguntaAtual.q}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {perguntaAtual.a.map((alternativa: string, i: number) => {
                    let estiloBotao = { ...styles.btnAlternativa };
                    
                    if (respondido) {
                      if (i === perguntaAtual.c) {
                        estiloBorderAndBg(estiloBotao, '#2ECC71', '#FFFFFF'); // Correta: Verde
                      } else if (i === altSelecionada) {
                        estiloBorderAndBg(estiloBotao, '#E74C3C', '#FFFFFF'); // Errada: Vermelho
                      } else {
                        estiloBotao.opacity = '0.6';
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={respondido}
                        onClick={() => verificarResposta(i)}
                        className="btn-opcao"
                        style={estiloBotao}
                      >
                        {alternativa}
                      </button>
                    );
                  })}
                </div>

                {respondido && (
                  <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px', color: altSelecionada === perguntaAtual.c ? '#2ECC71' : '#E74C3C' }}>
                      {altSelecionada === perguntaAtual.c ? '🎉 Arrasou! Resposta exata!' : '❌ Ops! Dê uma revisada no manual básico.'}
                    </p>
                    <button onClick={avancarQuiz} className="btn-opcao" style={styles.btnAvancar}>
                      Próxima Pergunta ➡️
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#666' }}>Nenhum desafio cadastrado para este nível ainda.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper rápido para mudar cores no clique
function estiloBorderAndBg(objeto: any, cor: string, texto: string) {
  objeto.backgroundColor = cor;
  objeto.borderColor = cor;
  objeto.color = texto;
}

// Estilização Completa e Moderna via Objeto (Design Limpo e Colorido)
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #FFFDF6, #FFF5E6, #E6F9FF, #FFFDF6)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    padding: '40px 20px',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  mainTitle: {
    fontSize: '3.5rem',
    fontWeight: '900',
    background: 'linear-gradient(45deg, #FF6A00, #FFCA28)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '10px 0 5px 0',
    letterSpacing: '-1px'
  },
  subtitle: {
    color: '#0A2540',
    fontSize: '1.2rem',
    fontWeight: '600',
    opacity: 0.8
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(10,37,64,0.05)',
    border: '2px solid rgba(255,106,0,0.1)',
    transition: 'all 0.3s ease'
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: '1.8rem',
    color: '#0A2540',
    marginBottom: '10px',
    fontWeight: '800'
  },
  gridSemestres: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px'
  },
  btnSemestre: {
    padding: '30px 20px',
    backgroundColor: '#00D2FF',
    color: '#0A2540',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 10px rgba(0,210,255,0.2)'
  },
  btnVoltar: {
    background: 'none',
    border: 'none',
    color: '#FF6A00',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '25px',
    display: 'inline-block'
  },
  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: '#FFFDF6',
    padding: '15px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(0,210,255,0.2)'
  },
  selectNivel: {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #00D2FF',
    backgroundColor: '#FFFFFF',
    fontWeight: 'bold',
    color: '#0A2540',
    cursor: 'pointer'
  },
  scoreBadge: {
    backgroundColor: '#FF6A00',
    color: '#FFFFFF',
    padding: '10px 20px',
    borderRadius: '50px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    boxShadow: '0 4px 10px rgba(255,106,0,0.3)'
  },
  progresso: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#00D2FF',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  perguntaTexto: {
    fontSize: '1.4rem',
    color: '#0A2540',
    margin: '15px 0 30px 0',
    lineHeight: '1.5',
    fontWeight: '700'
  },
  btnAlternativa: {
    padding: '18px 25px',
    backgroundColor: '#FFFDF6',
    color: '#0A2540',
    border: '2px solid #00D2FF',
    borderRadius: '14px',
    textAlign: 'left',
    fontSize: '1.1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnAvancar: {
    padding: '15px 35px',
    backgroundColor: '#FF6A00',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(255,106,0,0.3)'
  }
};
