import { useState } from 'react';
import { academicDatabase } from './data/questions';

// Banco de dados interno de Flashcards para garantir que apareçam em todas as telas
const flashcardsDeEstudo: Record<number, { frente: string; verso: string }[]> = {
  1: [
    { frente: "💡 O que é a Terapia Ocupacional?", verso: "É a área da saúde que estuda e trata a atividade humana como ferramenta de autonomia e independência." },
    { frente: "🧠 Fundamentos Básicos", verso: "O foco principal está no desempenho ocupacional e na participação social do indivíduo." }
  ],
  2: [
    { frente: "⚡ O que são Atividades de Vida Diária (AVDs)?", verso: "Tarefas de autocuidado como banhar-se, vestir-se, alimentar-se e higiene pessoal." },
    { frente: "📋 Análise da Atividade", verso: "Processo de decompor uma tarefa para entender as demandas cognitivas, motoras e sensoriais necessárias." }
  ],
  3: [
    { frente: "🧸 TO na Pediatria", verso: "Utiliza o brincar como o principal recurso terapêutico para o desenvolvimento neuropsicomotor." },
    { frente: "♿ Tecnologia Assistiva", verso: "Recursos e estratégias que promovem a funcionalidade de pessoas com deficiência." }
  ],
  4: [
    { frente: "👴 TO na Gerontologia", verso: "Foco na manutenção da autonomia, prevenção de quedas e adaptação ambiental para idosos." },
    { frente: "🏥 Contextos Hospitalares", verso: "Intervenção precoce para evitar o declínio funcional e oferecer suporte psicossocial durante a internação." }
  ]
};

export default function App() {
  const [semestre, setSemestre] = useState<number | null>(null);
  const [nivel, setNivel] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [idxPergunta, setIdxPergunta] = useState<number>(0);
  const [respondido, setRespondido] = useState<boolean>(false);
  const [altSelecionada, setAltSelecionada] = useState<number | null>(null);
  const [pontos, setPontos] = useState<number>(0);
  const [quizFinalizado, setQuizFinalizado] = useState<boolean>(false);
  
  // Estado para os Flashcards
  const [flashcardAtivo, setFlashcardAtivo] = useState<number>(0);
  const [mostrarVerso, setMostrarVerso] = useState<boolean>(false);

  // Filtra os dados com base no banco existente
  const dadosSemestre = semestre ? academicDatabase[semestre] : null;
  const perguntasDisponiveis = dadosSemestre ? dadosSemestre.perguntas[nivel] : [];
  const perguntaAtual = perguntasDisponiveis[idxPergunta];

  // Carrega os flashcards do semestre ou mostra os básicos
  const flashcardsAtuais = flashcardsDeEstudo[semestre || 1];

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
      setQuizFinalizado(true);
    }
  };

  const reiniciarJogo = () => {
    setSemestre(null);
    setIdxPergunta(0);
    setRespondido(false);
    setAltSelecionada(null);
    setQuizFinalizado(false);
    setMostrarVerso(false);
    setFlashcardAtivo(0);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatAvatar {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulseCard {
          0% { box-shadow: 0 10px 30px rgba(255,106,0,0.15); }
          50% { box-shadow: 0 10px 35px rgba(0,210,255,0.35); }
          100% { box-shadow: 0 10px 30px rgba(255,106,0,0.15); }
        }
        .btn-opcao:hover {
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .flashcard {
          perspective: 1000px;
          cursor: pointer;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flashcard.virado {
          transform: rotateY(180deg);
        }
      `}</style>

      <div style={styles.container}>
        {/* Topo com o Avatar Animado */}
        <header style={styles.header}>
          <div style={{ animation: 'floatAvatar 3.5s ease-in-out infinite', display: 'inline-block', fontSize: '4.5rem' }}>👩‍💻</div>
          <h1 style={styles.mainTitle}>TOJornada</h1>
          <p style={styles.subtitle}>Desafie seus conhecimentos e revise com Flashcards Interativos!</p>
        </header>

        {/* TELA 1: MENU PRINCIPAL DE SELEÇÃO */}
        {semestre === null ? (
          <div style={{ ...styles.card, animation: 'pulseCard 4s infinite' }}>
            <h2 style={styles.cardTitle}>📍 Escolha sua Próxima Parada:</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>Selecione um dos períodos acadêmicos para ativar os Desafios:</p>
            
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

            {/* Flashcards de Introdução Visíveis na Home */}
            <div style={styles.areaFlashcards}>
              <h3 style={styles.flashcardTituloSecao}>🎯 Flashcards de Aquecimento (Geral)</h3>
              <div 
                style={{...styles.cardFlashcard, backgroundColor: mostrarVerso ? '#FFF3CD' : '#E6F9FF'}}
                onClick={() => setMostrarVerso(!mostrarVerso)}
                className="btn-opcao"
              >
                <p style={styles.flashcardTexto}>
                  {mostrarVerso ? flashcardsAtuais[flashcardAtivo].verso : flashcardsAtuais[flashcardAtivo].frente}
                </p>
                <span style={styles.dicaClique}>👉 Clique no card para virar</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFlashcardAtivo((prev) => (prev === 0 ? flashcardsAtuais.length - 1 : prev - 1)); setMostrarVerso(false); }} 
                  style={styles.btnMini}
                >⏮️ Anterior</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFlashcardAtivo((prev) => (prev === flashcardsAtuais.length - 1 ? 0 : prev + 1)); setMostrarVerso(false); }} 
                  style={styles.btnMini}
                >Próximo ⏭️</button>
              </div>
            </div>
          </div>
        ) : quizFinalizado ? (
          /* TELA 3: TELA DE SUCESSO + FLASHCARDS REFORÇADOS pós-jogo */
          <div style={{ ...styles.card, borderTop: '8px solid #2ECC71', textAlign: 'center' }}>
            <h2 style={{ ...styles.cardTitle, color: '#2ECC71' }}>🎉 Rodada Concluída com Sucesso!</h2>
            <p style={{ fontSize: '1.3rem', margin: '20px 0', fontWeight: 'bold' }}>Você acumulou: <span style={{ color: '#FF6A00' }}>{pontos} Pontos</span> 🏆</p>
            
            <hr style={{ border: '1px solid #eee', margin: '30px 0' }} />

            {/* Seção Obrigatória de Revisão por Flashcards */}
            <div style={{ ...styles.areaFlashcards, marginTop: '10px' }}>
              <h3 style={styles.flashcardTituloSecao}>🧠 Revisão Ativa: Flashcards de Memorização do {semestre}º Semestre</h3>
              <p style={{ color: '#666', marginBottom: '15px' }}>Fixe o conteúdo revisando os conceitos fundamentais abaixo:</p>
              
              <div 
                style={{...styles.cardFlashcard, backgroundColor: mostrarVerso ? '#D4EFDF' : '#FADBD8'}}
                onClick={() => setMostrarVerso(!mostrarVerso)}
                className="btn-opcao"
              >
                <p style={styles.flashcardTexto}>
                  {mostrarVerso ? flashcardsAtuais[flashcardAtivo].verso : flashcardsAtuais[flashcardAtivo].frente}
                </p>
                <span style={styles.dicaClique}>🔄 Clique para revelar a resposta</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
                <button 
                  onClick={() => { setFlashcardAtivo((prev) => (prev === 0 ? flashcardsAtuais.length - 1 : prev - 1)); setMostrarVerso(false); }} 
                  style={styles.btnMini}
                >⬅️ Voltar Card</button>
                <button 
                  onClick={() => { setFlashcardAtivo((prev) => (prev === flashcardsAtuais.length - 1 ? 0 : prev + 1)); setMostrarVerso(false); }} 
                  style={styles.btnMini}
                >Avançar Card ➡️</button>
              </div>
            </div>

            <button onClick={reiniciarJogo} className="btn-opcao" style={{ ...styles.btnAvancar, marginTop: '35px', backgroundColor: '#00D2FF', color: '#0A2540' }}>
              🔄 Jogar Novamente / Mudar Semestre
            </button>
          </div>
        ) : (
          /* TELA 2: TELA DO QUIZ ATIVO */
          <div style={{ ...styles.card, borderTop: '8px solid #FF6A00' }}>
            <button onClick={reiniciarJogo} className="btn-opcao" style={styles.btnVoltar}>
              ⬅️ Abandonar Jornada e Voltar ao Menu
            </button>

            <div style={styles.quizHeader}>
              <div>
                <label style={{ fontWeight: 'bold', marginRight: '10px', color: '#0A2540' }}>Nível:</label>
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
                  <option value="facil">🟢 Fácil</option>
                  <option value="medio">🟡 Médio</option>
                  <option value="dificil">🔴 Difícil</option>
                </select>
              </div>
              <div style={styles.scoreBadge}>🏆 {pontos} Pts</div>
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
                        estiloBorderAndBg(estiloBotao, '#2ECC71', '#FFFFFF');
                      } else if (i === altSelecionada) {
                        estiloBorderAndBg(estiloBotao, '#E74C3C', '#FFFFFF');
                      } else {
                        estiloBotao.opacity = '0.5';
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
                      {altSelecionada === perguntaAtual.c ? '🎉 Resposta Exata!' : '❌ Opa! Dê uma olhada no gabarito.'}
                    </p>
                    <button onClick={avancarQuiz} className="btn-opcao" style={styles.btnAvancar}>
                      Avançar Missão ➡️
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: '#666', marginBottom: '20px' }}>Preparando os desafios deste bloco ocupacional...</p>
                <button onClick={() => setQuizFinalizado(true)} style={styles.btnAvancar}>Ir Direto para Revisão Ativa</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function estiloBorderAndBg(objeto: any, cor: string, texto: string) {
  objeto.backgroundColor = cor;
  objeto.borderColor = cor;
  objeto.color = texto;
}

// Estilos de Alto Impacto Visual
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #FFFDF6, #FFF5E6, #E6F9FF, #FFFDF6)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 12s ease infinite',
    padding: '40px 20px',
    fontFamily: '"Segoe UI", Roboto, sans-serif'
  },
  container: { maxWidth: '750px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '35px' },
  mainTitle: {
    fontSize: '3.6rem',
    fontWeight: '900',
    background: 'linear-gradient(45deg, #FF6A00, #FFCA28)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '10px 0 5px 0'
  },
  subtitle: { color: '#0A2540', fontSize: '1.2rem', fontWeight: '600', opacity: 0.8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '35px',
    boxShadow: '0 10px 30px rgba(10,37,64,0.06)',
    border: '2px solid rgba(255,106,0,0.1)',
    transition: 'all 0.3s ease'
  },
  cardTitle: { textAlign: 'center', fontSize: '1.7rem', color: '#0A2540', fontWeight: '800' },
  gridSemestres: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '25px' },
  btnSemestre: {
    padding: '25px 15px',
    backgroundColor: '#00D2FF',
    color: '#0A2540',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,210,255,0.25)'
  },
  btnVoltar: { background: 'none', border: 'none', color: '#FF6A00', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px' },
  quizHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#FFFDF6', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(0,210,255,0.2)' },
  selectNivel: { padding: '8px', borderRadius: '8px', border: '2px solid #00D2FF', backgroundColor: '#FFFFFF', fontWeight: 'bold', color: '#0A2540' },
  scoreBadge: { backgroundColor: '#FF6A00', color: '#FFFFFF', padding: '8px 18px', borderRadius: '50px', fontWeight: 'bold' },
  progresso: { fontSize: '0.85rem', fontWeight: 'bold', color: '#00D2FF', textTransform: 'uppercase' },
  perguntaTexto: { fontSize: '1.35rem', color: '#0A2540', margin: '15px 0 25px 0', fontWeight: '700', lineHeight: '1.4' },
  btnAlternativa: { padding: '16px 20px', backgroundColor: '#FFFDF6', color: '#0A2540', border: '2px solid #00D2FF', borderRadius: '14px', textAlign: 'left', fontSize: '1.05rem', fontWeight: '500', cursor: 'pointer' },
  btnAvancar: { padding: '14px 30px', backgroundColor: '#FF6A00', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255,106,0,0.3)' },
  
  // Novos Estilos Estilizados dos Flashcards
  areaFlashcards: {
    marginTop: '40px',
    padding: '25px',
    backgroundColor: '#FFFDF6',
    borderRadius: '18px',
    border: '2px dashed #FF6A00',
    textAlign: 'center'
  },
  flashcardTituloSecao: { fontSize: '1.3rem', color: '#FF6A00', marginBottom: '15px', fontWeight: '800' },
  cardFlashcard: {
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '14px',
    border: '2px solid rgba(10,37,64,0.1)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.03)',
    transition: 'all 0.3s ease',
    margin: '10px 0'
  },
  flashcardTexto: { fontSize: '1.20rem', fontWeight: '600', color: '#0A2540', lineHeight: '1.4', margin: '0 0 10px 0' },
  dicaClique: { fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
  btnMini: { padding: '8px 15px', backgroundColor: '#0A2540', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }
};
