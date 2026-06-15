import { useState } from 'react';

// Banco de dados interno de segurança para garantir que o app NUNCA abra em branco
const fallbackDatabase: Record<number, { perguntas: { facil: { q: string; a: string[]; c: number }[]; medio: { q: string; a: string[]; c: number }[]; dificil: { q: string; a: string[]; c: number }[] } }> = {
  1: { perguntas: { facil: [{ q: "O que é fundamental na Terapia Ocupacional?", a: ["Atividade Humana", "Apenas Medicamentos", "Isolamento"], c: 0 }, { q: "Qual o foco principal do terapeuta ocupacional?", a: ["Autonomia e independência", "Apenas exames laboratoriais", "Prescrever cirurgias"], c: 0 }], medio: [], dificil: [] } },
  2: { perguntas: { facil: [{ q: "O que significa AVD?", a: ["Atividades de Vida Diária", "Ação Visual Direta"], c: 0 }], medio: [], dificil: [] } },
  3: { perguntas: { facil: [{ q: "Qual o foco da TO na infância?", a: ["O brincar e o desenvolvimento", "Apenas repouso"], c: 0 }], medio: [], dificil: [] } },
  4: { perguntas: { facil: [{ q: "Foco principal na Gerontologia:", a: ["Manutenção da Autonomia", "Imobilização"], c: 0 }], medio: [], dificil: [] } },
  5: { perguntas: { facil: [{ q: "Objetivo na Saúde Mental:", a: ["Reinserção e organização do cotidiano", "Isolamento"], c: 0 }], medio: [], dificil: [] } },
  6: { perguntas: { facil: [{ q: "Atuação na TO Social:", a: ["Populações vulneráveis", "Empresas privadas apenas"], c: 0 }], medio: [], dificil: [] } },
  7: { perguntas: { facil: [{ q: "Recurso na Reabilitação Física:", a: ["Órteses e treino funcional", "Apenas exames"], c: 0 }], medio: [], dificil: [] } },
  8: { perguntas: { facil: [{ q: "Foco em Gestão de Serviços:", a: ["Planejamento de programas de TO", "Procedimentos cirúrgicos"], c: 0 }], medio: [], dificil: [] } }
};

let perguntasBanco: any = fallbackDatabase;
try {
  // @ts-ignore
  import('./data/questions').then(mod => {
    if (mod && mod.academicDatabase) {
      perguntasBanco = mod.academicDatabase;
    }
  }).catch(() => {});
} catch (e) {}

const temasSemestre: Record<number, { bg: string; card: string; border: string; accent: string; texto: string }> = {
  1: { bg: 'linear-gradient(135deg, #1A153B 0%, #090714 100%)', card: '#15122C', border: '#A855F7', accent: '#A855F7', texto: '#FFF' }, 
  2: { bg: 'linear-gradient(135deg, #0A192F 0%, #020C1B 100%)', card: '#0B1E36', border: '#00D2FF', accent: '#00D2FF', texto: '#FFF' }, 
  3: { bg: 'linear-gradient(135deg, #062817 0%, #02110A 100%)', card: '#0B3A21', border: '#10B981', accent: '#10B981', texto: '#FFF' }, 
  4: { bg: 'linear-gradient(135deg, #2D0B0B 0%, #140303 100%)', card: '#3E1212', border: '#EF4444', accent: '#EF4444', texto: '#FFF' }, 
  5: { bg: 'linear-gradient(135deg, #2B1805 0%, #140B02 100%)', card: '#3E240B', border: '#F59E0B', accent: '#F59E0B', texto: '#FFF' }, 
  6: { bg: 'linear-gradient(135deg, #2D0B22 0%, #14030F 100%)', card: '#421232', border: '#EC4899', accent: '#EC4899', texto: '#FFF' }, 
  7: { bg: 'linear-gradient(135deg, #0B2428 0%, #030F11 100%)', card: '#123A40', border: '#06B6D4', accent: '#06B6D4', texto: '#FFF' }, 
  8: { bg: 'linear-gradient(135deg, #1C230B 0%, #0C1004 100%)', card: '#2B3612', border: '#84CC16', accent: '#84CC16', texto: '#FFF' }, 
};

export default function App() {
  const [semestre, setSemestre] = useState<number | null>(null);
  const [modoJogo, setModoJogo] = useState<'quiz' | 'memoria' | 'flashcard'>('quiz');
  const [tipoPlayer, setTipoPlayer] = useState<'single' | 'multi'>('single');
  const [turnoJogador, setTurnoJogador] = useState<number>(1); // 1 ou 2
  
  const [nivel, setNivel] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [idxPergunta, setIdxPergunta] = useState<number>(0);
  const [respondido, setRespondido] = useState<boolean>(false);
  const [altSelecionada, setAltSelecionada] = useState<number | null>(null);
  
  // Placar separado para Multiplayer de mesa
  const [pontosP1, setPontosP1] = useState<number>(0);
  const [pontosP2, setPontosP2] = useState<number>(0);

  const [mostrarMapa, setMostrarMapa] = useState<boolean>(false);
  const [acertosMapa, setAcertosMapa] = useState<string[]>([]);
  const [memoriaRevelada, setMemoriaRevelada] = useState<number | null>(null);
  const [mostrarManual, setMostrarManual] = useState<boolean>(false);

  const temaAtual = semestre 
    ? temasSemestre[semestre] 
    : { bg: 'radial-gradient(circle, #1A153B 0%, #090714 100%)', card: '#15122C', border: '#251F4F', accent: '#00D2FF', texto: '#FFF' };

  const dadosSemestre = semestre ? (perguntasBanco[semestre] || fallbackDatabase[semestre]) : null;
  const perguntasPorNivel = dadosSemestre?.perguntas || { facil: [], medio: [], dificil: [] };
  const perguntasDisponiveis = perguntasPorNivel[nivel] || [];
  const perguntaAtual = perguntasDisponiveis[idxPergunta];

  const verificarResposta = (index: number) => {
    if (respondido || !perguntaAtual) return;
    setAltSelecionada(index);
    setRespondido(true);

    if (index === perguntaAtual.c) {
      if (tipoPlayer === 'single') {
        setPontosP1(prev => prev + 10);
      } else {
        if (turnoJogador === 1) setPontosP1(prev => prev + 10);
        else setPontosP2(prev => prev + 10);
      }
      setAcertosMapa([...acertosMapa, `P${tipoPlayer === 'multi' ? turnoJogador : 1}: ` + perguntaAtual.q.substring(0, 20) + "..."]);
    }
  };

  const avancarTurnoEPergunta = () => {
    setRespondido(false);
    setAltSelecionada(null);
    setIdxPergunta(prev => prev + 1);
    
    // Alterna o turno caso seja multiplayer de mesa
    if (tipoPlayer === 'multi') {
      setTurnoJogador(prev => (prev === 1 ? 2 : 1));
    }
  };

  const reiniciarGeral = () => {
    setSemestre(null);
    setRespondido(false);
    setIdxPergunta(0);
    setPontosP1(0);
    setPontosP2(0);
    setTurnoJogador(1);
    setAcertosMapa([]);
    setMemoriaRevelada(null);
  };

  const gerarPDFEstudos = () => {
    const conteudo = `📝 TOJORNADA - RELATÓRIO DE ESTUDOS (SEMESTRE ${semestre})\n\nModo de Jogo: ${tipoPlayer === 'single' ? 'Solo' : 'Multiplayer'}\nPontos Jogador 1: ${pontosP1} PTS\n${tipoPlayer === 'multi' ? `Pontos Jogador 2: ${pontosP2} PTS\n` : ''}\nHistórico de Conquistas:\n${acertosMapa.map(a => `- ${a}`).join('\n')}`;
    const arquivo = new Blob([conteudo], { type: 'text/plain' });
    const elemento = document.createElement("a");
    elemento.href = URL.createObjectURL(arquivo);
    elemento.download = `TOJornada_Estudos_Semestre_${semestre}.txt`;
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  };

  return (
    <div style={{ ...styles.page, background: temaAtual.bg }}>
      <style>{`
        .btn-game { transition: all 0.1s ease; cursor: pointer; border: none; font-weight: bold; }
        .btn-game:hover { transform: translateY(-2px); filter: brightness(1.2); }
        .tab-ativa { border-bottom: 4px solid ${temaAtual.accent} !important; color: ${temaAtual.accent} !important; }
        .btn-toggle { padding: 12px 24px; borderRadius: '12px'; font-size: '1rem'; cursor: 'pointer'; border: 'none'; font-weight: 'bold'; }
      `}</style>

      {/* BOTÃO FIXO: MANUAL DE COMO JOGAR */}
      <button 
        onClick={() => setMostrarManual(!mostrarManual)} 
        style={styles.btnManualFixo}
        className="btn-game"
      >
        {mostrarManual ? "❌ Fechar Manual" : "📖 Como Jogar?"}
      </button>

      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={{ ...styles.mainTitle, textShadow: `0 0 15px ${temaAtual.accent}` }}>TOJornada</h1>
          <p style={{ ...styles.subtitle, color: temaAtual.accent }}>PLATAFORMA GAMIFICADA DE TERAPIA OCUPACIONAL</p>
        </header>

        {/* MODAL/POPUP DO MANUAL DE INSTRUÇÕES */}
        {mostrarManual && (
          <div style={styles.caixaManualBox}>
            <h3 style={{ color: '#FFCA28', marginTop: 0 }}>📖 MANUAL DA JORNADA ACADÊMICA</h3>
            <p><strong>👤 Modo Solo (1 Player):</strong> Você contra o sistema! Responda às perguntas e monte seu mapa mental de revisão para imprimir.</p>
            <p><strong>👥 Modo Versus (Multiplayer Local):</strong> Perfeito para jogar com amigos ou colegas de faculdade! O sistema alternará automaticamente os turnos. Cada jogador responde na sua vez e acumula pontos no seu respectivo placar.</p>
            <p><strong>🎮 Estilos de Jogos:</strong> Alterne livremente entre o Quiz Neon, o teste de Memória Reversa para associar termos e cartões Flashcards para memorização rápida de conceitos de TO.</p>
          </div>
        )}

        {semestre === null ? (
          /* MENU PRINCIPAL DE SELEÇÃO */
          <div style={styles.card}>
            
            {/* NOVO SELETOR DE MODALIDADE: 1 PLAYER VS MULTIPLAYER */}
            <div style={styles.secaoConfiguracaoModo}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', textAlign: 'center' }}>👥 CONFIGURAÇÃO DE EQUIPE:</h3>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button 
                  onClick={() => setTipoPlayer('single')} 
                  style={{ ...styles.btnModoFase, backgroundColor: tipoPlayer === 'single' ? '#00D2FF' : '#251F4F', color: '#FFF' }}
                >
                  👤 Solo (1 Player)
                </button>
                <button 
                  onClick={() => setTipoPlayer('multi')} 
                  style={{ ...styles.btnModoFase, backgroundColor: tipoPlayer === 'multi' ? '#EC4899' : '#251F4F', color: '#FFF' }}
                >
                  👥 Dupla (Passa o Turno)
                </button>
              </div>
            </div>

            <h2 style={styles.cardTitle}>🎮 ESCOLHA UM MAPA ACADÊMICO:</h2>
            <div style={styles.gridSemestres}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setSemestre(num)}
                  className="btn-game"
                  style={{ ...styles.btnSemestre, backgroundColor: themesHelper(num) }}
                >
                  🎓 {num}º Semestre
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* PLATAFORMA INTERNA DO SEMESTRE */
          <div style={{ ...styles.card, backgroundColor: temaAtual.card, borderColor: temaAtual.border }}>
            <button onClick={reiniciarGeral} style={styles.btnVoltar}>⬅️ Mudar de Semestre / Sair</button>
            
            {/* DISPLAY DE PONTUAÇÃO DINÂMICO CONFORME O MODO SELECIONADO */}
            <div style={styles.painelPlacarStatus}>
              {tipoPlayer === 'single' ? (
                <div style={styles.badgePlacar}>🏆 SCORE: {pontosP1} PTS</div>
              ) : (
                <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ ...styles.badgePlacar, backgroundColor: turnoJogador === 1 ? '#10B981' : '#251F4F' }}>🕹️ P1: {pontosP1} PTS</div>
                  <div style={{ color: temaAtual.accent, fontWeight: 'bold' }}>VEZ DO JOGADOR {turnoJogador} 👉</div>
                  <div style={{ ...styles.badgePlacar, backgroundColor: turnoJogador === 2 ? '#10B981' : '#251F4F' }}>🕹️ P2: {pontosP2} PTS</div>
                </div>
              )}
            </div>

            {/* ABAS DE ESTILOS DE JOGO */}
            <div style={styles.abasAbordagem}>
              <button onClick={() => setModoJogo('quiz')} className={`btn-game ${modoJogo === 'quiz' ? 'tab-ativa' : ''}`} style={styles.abaItem}>🎮 QUIZ NEON</button>
              <button onClick={() => setModoJogo('memoria')} className={`btn-game ${modoJogo === 'memoria' ? 'tab-ativa' : ''}`} style={styles.abaItem}>🧠 MEMÓRIA</button>
              <button onClick={() => setModoJogo('flashcard')} className={`btn-game ${modoJogo === 'flashcard' ? 'tab-ativa' : ''}`} style={styles.abaItem}>⚡ FLASHCARDS</button>
            </div>

            {/* INTERFACE QUIZ */}
            {modoJogo === 'quiz' && (
              <div>
                {perguntaAtual ? (
                  <div>
                    <div style={styles.caixaPerguntaMestre}>
                      <h3>{perguntaAtual.q}</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                      {perguntaAtual.a.map((alt, i) => (
                        <button
                          key={i}
                          disabled={respondido}
                          onClick={() => verificarResposta(i)}
                          className="btn-game"
                          style={{
                            ...styles.btnAlternativa,
                            backgroundColor: respondido ? (i === perguntaAtual.c ? '#10B981' : i === altSelecionada ? '#EF4444' : '#251F4F') : '#251F4F'
                          }}
                        >
                          {alt}
                        </button>
                      ))}
                    </div>
                    {respondido && (
                      <button onClick={avancarTurnoEPergunta} className="btn-game" style={{ ...styles.btnAvancar, backgroundColor: temaAtual.accent, marginTop: '20px' }}>
                        CONFIRMAR E PASSAR RODADA ➔
                      </button>
                    )}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center' }}>Fase concluída! Veja seu progresso no mapa mental abaixo ou exporte o cartão.</p>
                )}
              </div>
            )}

            {/* INTERFACE MEMÓRIA */}
            {modoJogo === 'memoria' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <h3 style={{ color: temaAtual.accent }}>🧠 DETECTIVE MEMÓRIA</h3>
                <p style={{ fontSize: '0.9rem', color: '#CCC' }}>Revele os pares conceituais de TO!</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                  <div onClick={() => { setMemoriaRevelada(1); if(tipoPlayer === 'multi') setTurnoJogador(prev => prev === 1 ? 2 : 1); }} style={{ ...styles.caixaMemoria, background: memoriaRevelada === 1 ? '#251F4F' : temaAtual.accent }}>
                    {memoriaRevelada === 1 ? "AVDs (Atividades de Vida Diária)" : "❓ CONCEITO A"}
                  </div>
                  <div onClick={() => { setMemoriaRevelada(2); if(tipoPlayer === 'multi') setTurnoJogador(prev => prev === 1 ? 2 : 1); }} style={{ ...styles.caixaMemoria, background: memoriaRevelada === 2 ? '#251F4F' : temaAtual.accent }}>
                    {memoriaRevelada === 2 ? "Foco em Autocuidado e Higiene" : "❓ DEFINIÇÃO A"}
                  </div>
                </div>
              </div>
            )}

            {/* INTERFACE FLASHCARDS */}
            {modoJogo === 'flashcard' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ ...styles.caixaPerguntaMestre, borderColor: temaAtual.accent, minHeight: '120px' }}>
                  <h4>📚 REVISÃO RÁPIDA - SEMESTRE {semestre}</h4>
                  <p style={{ fontSize: '1.1rem', marginTop: '10px' }}>O foco central da intervenção está no engajamento nas ocupações significativas do sujeito.</p>
                </div>
              </div>
            )}

            {/* FERRAMENTAS DE SUPORTE */}
            <div style={styles.ferramentasEstudo}>
              <button onClick={() => setMostrarMapa(!mostrarMapa)} className="btn-game" style={styles.btnSecundario}>🗺️ {mostrarMapa ? 'Ocultar Árvore Mental' : 'Ver Mapa Mental'}</button>
              <button onClick={gerarPDFEstudos} className="btn-game" style={{ ...styles.btnSecundario, backgroundColor: '#10B981' }}>🖨️ Exportar Cartão (.TXT)</button>
            </div>

            {/* MAPA MENTAL */}
            {mostrarMapa && (
              <div style={styles.areaMapaMental}>
                <h4 style={{ color: temaAtual.accent }}>📍 DIAGRAMA DE ACERTOS:</h4>
                <div style={styles.nohCentral}>MAPA TO {semestre}º</div>
                <div style={styles.linhaConexao}>│</div>
                <div style={styles.gridNohs}>
                  {acertosMapa.length > 0 ? acertosMapa.map((acerto, index) => (
                    <div key={index} style={styles.nohFilho}>🎯 {acerto}</div>
                  )) : <p style={{ fontSize: '0.9rem', color: '#888' }}>Pontue nas atividades para alimentar as ramificações de estudos.</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function themesHelper(num: number): string {
  const cores: Record<number, string> = { 1: '#A855F7', 2: '#00D2FF', 3: '#10B981', 4: '#EF4444', 5: '#F59E0B', 6: '#EC4899', 7: '#06B6D4', 8: '#84CC16' };
  return cores[num] || '#3B82F6';
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', padding: '40px 20px', transition: 'all 0.5s ease', fontFamily: 'sans-serif', color: '#FFF', position: 'relative' },
  container: { maxWidth: '700px', margin: '0 auto' },
  btnManualFixo: { position: 'absolute', top: '20px', right: '20px', backgroundColor: '#FFCA28', color: '#000', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', zIndex: 99 },
  caixaManualBox: { backgroundColor: '#1A1438', border: '3px solid #FFCA28', padding: '20px', borderRadius: '16px', marginBottom: '20px', lineHeight: '1.5' },
  secaoConfiguracaoModo: { backgroundColor: '#0F0C20', padding: '16px', borderRadius: '16px', marginBottom: '25px', border: '2px dashed #352D6E' },
  btnModoFase: { padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', border: 'none', fontWeight: 'bold' },
  header: { textAlign: 'center', marginBottom: '30px' },
  mainTitle: { fontSize: '3.5rem', fontWeight: '900', color: '#FFCA28', margin: '0' },
  subtitle: { fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px' },
  card: { backgroundColor: '#15122C', borderRadius: '24px', padding: '30px', border: '4px solid #251F4F', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  cardTitle: { textAlign: 'center', fontSize: '1.4rem', margin: '20px 0' },
  gridSemestres: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  btnSemestre: { padding: '20px', borderRadius: '16px', color: '#FFF', fontSize: '1.1rem', boxShadow: '0 6px 0 rgba(0,0,0,0.3)' },
  btnVoltar: { background: 'none', border: 'none', color: '#FF6A00', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' },
  painelPlacarStatus: { marginBottom: '20px', display: 'flex', justifyContent: 'center' },
  badgePlacar: { backgroundColor: '#FF6A00', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' },
  abasAbordagem: { display: 'flex', justifyContent: 'space-around', borderBottom: '2px solid #251F4F', marginBottom: '25px', paddingBottom: '10px' },
  abaItem: { background: 'none', color: '#FFF', fontSize: '1rem', padding: '8px 16px' },
  caixaPerguntaMestre: { background: '#0F0C20', border: '2px solid #352D6E', borderRadius: '16px', padding: '20px', textAlign: 'center' },
  btnAlternativa: { padding: '16px', color: '#FFF', border: '2px solid #352D6E', borderRadius: '14px', width: '100%', textAlign: 'left', fontSize: '1.05rem' },
  btnAvancar: { padding: '14px 30px', color: '#FFF', borderRadius: '12px', width: '100%', cursor: 'pointer' },
  caixaMemoria: { minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', padding: '15px', fontWeight: 'bold', cursor: 'pointer', color: '#FFF' },
  ferramentasEstudo: { display: 'flex', gap: '12px', marginTop: '30px', borderTop: '2px solid #251F4F', paddingTop: '20px' },
  btnSecundario: { padding: '12px 20px', backgroundColor: '#352D6E', color: '#FFF', borderRadius: '10px', flex: 1, fontSize: '0.9rem' },
  areaMapaMental: { marginTop: '20px', padding: '20px', backgroundColor: '#0F0C20', borderRadius: '16px', border: '2px solid #251F4F', textAlign: 'center' },
  nohCentral: { background: '#FFCA28', color: '#000', padding: '10px 20px', borderRadius: '20px', display: 'inline-block', fontWeight: 'bold' },
  linhaConexao: { color: '#FFCA28', margin: '2px 0', fontSize: '1.2rem' },
  gridNohs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px' },
  nohFilho: { background: '#251F4F', border: '1px solid #352D6E', padding: '8px 12px', borderRadius: '12px', fontSize: '0.9rem' }
};

