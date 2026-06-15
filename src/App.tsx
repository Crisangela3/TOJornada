import { useState } from 'react';
import { academicDatabase } from './data/questions';

// Temas visuais dinâmicos para cada um dos 8 semestres (Inspirado na Imagem2_2.jpg)
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
  const [nivel, setNivel] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [idxPergunta, setIdxPergunta] = useState<number>(0);
  const [respondido, setRespondido] = useState<boolean>(false);
  const [altSelecionada, setAltSelecionada] = useState<number | null>(null);
  const [pontos, setPontos] = useState<number>(0);
  const [mostrarMapa, setMostrarMapa] = useState<boolean>(false);
  const [acertosMapa, setAcertosMapa] = useState<string[]>([]);
  const [memoriaRevelada, setMemoriaRevelada] = useState<number | null>(null);

  const temaAtual = semestre 
    ? temasSemestre[semestre] 
    : { bg: 'radial-gradient(circle, #1A153B 0%, #090714 100%)', card: '#15122C', border: '#251F4F', accent: '#00D2FF', texto: '#FFF' };

  const dadosSemestre = semestre ? academicDatabase[semestre] : null;
  const perguntasDisponiveis = dadosSemestre ? dadosSemestre.perguntas[nivel] : [];
  const perguntaAtual = perguntasDisponiveis[idxPergunta];

  const verificarResposta = (index: number) => {
    if (respondido || !perguntaAtual) return;
    setAltSelecionada(index);
    setRespondido(true);
    if (index === perguntaAtual.c) {
      setPontos(pontos + 10);
      setAcertosMapa([...acertosMapa, perguntaAtual.q.substring(0, 25) + "..."]);
    }
  };

  const gerarPDFEstudos = () => {
    const conteudo = `📝 CARTÃO DE CONTEÚDO TO - SEMESTRE ${semestre}\n\nPontuação Total: ${pontos} PTS\n\nConceitos Acertados:\n${acertosMapa.map(a => `- ${a}`).join('\n')}\n\nEstude sempre focado em Ocupação Humana e Independência Funcional!`;
    const arquivo = new Blob([conteudo], { type: 'text/plain' });
    const elemento = document.createElement("a");
    elemento.href = URL.createObjectURL(arquivo);
    elemento.download = `TOJornada_Semestre_${semestre}_Estudos.txt`;
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
      `}</style>

      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={{ ...styles.mainTitle, textShadow: `0 0 15px ${temaAtual.accent}` }}>TOJornada</h1>
          <p style={{ ...styles.subtitle, color: temaAtual.accent }}>PLATAFORMA GAMIFICADA DE TERAPIA OCUPACIONAL</p>
        </header>

        {semestre === null ? (
          <div style={styles.card}>
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
          <div style={{ ...styles.card, backgroundColor: temaAtual.card, borderColor: temaAtual.border }}>
            <button onClick={() => { setSemestre(null); setRespondido(false); setIdxPergunta(0); }} style={styles.btnVoltar}>⬅️ Mudar de Semestre</button>
            
            <div style={styles.abasAbordagem}>
              <button onClick={() => setModoJogo('quiz')} className={`btn-game ${modoJogo === 'quiz' ? 'tab-ativa' : ''}`} style={styles.abaItem}>🎮 QUIZ NEON</button>
              <button onClick={() => setModoJogo('memoria')} className={`btn-game ${modoJogo === 'memoria' ? 'tab-ativa' : ''}`} style={styles.abaItem}>🧠 MEMÓRIA REVERSA</button>
              <button onClick={() => setModoJogo('flashcard')} className={`btn-game ${modoJogo === 'flashcard' ? 'tab-ativa' : ''}`} style={styles.abaItem}>⚡ FLASHCARDS</button>
            </div>

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
                      <button onClick={() => { setRespondido(false); setIdxPergunta(idxPergunta + 1); setAltSelecionada(null); }} className="btn-game" style={{ ...styles.btnAvancar, backgroundColor: temaAtual.accent, marginTop: '20px' }}>PRÓXIMA FASE ➔</button>
                    )}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center' }}>Fase concluída ou dados em atualização para este nível!</p>
                )}
              </div>
            )}

            {modoJogo === 'memoria' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <h3 style={{ color: temaAtual.accent }}>🧠 JOGO DA MEMÓRIA OCUPACIONAL</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                  <div onClick={() => setMemoriaRevelada(1)} style={{ ...styles.caixaMemoria, background: memoriaRevelada === 1 ? '#251F4F' : temaAtual.accent }}>
                    {memoriaRevelada === 1 ? "AVDs (Atividades de Vida Diária)" : "❓ CONCEITO A"}
                  </div>
                  <div onClick={() => setMemoriaRevelada(2)} style={{ ...styles.caixaMemoria, background: memoriaRevelada === 2 ? '#251F4F' : temaAtual.accent }}>
                    {memoriaRevelada === 2 ? "Foco em Autocuidado e Higiene" : "❓ DEFINIÇÃO A"}
                  </div>
                </div>
                {memoriaRevelada && <p style={{ marginTop: '15px', color: '#10B981' }}>🎉 Parabéns! Par Ocupacional Encontrado!</p>}
              </div>
            )}

            {modoJogo === 'flashcard' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ ...styles.caixaPerguntaMestre, borderColor: temaAtual.accent, minHeight: '120px' }}>
                  <h4>📚 CONCEITO CHAVE DO SEMESTRE {semestre}</h4>
                  <p style={{ fontSize: '1.1rem', marginTop: '10px' }}>Estude as bases de Anatomia, Cinesiologia e Desempenho Funcional voltado para a Terapia Ocupacional.</p>
                </div>
              </div>
            )}

            <div style={styles.ferramentasEstudo}>
              <button onClick={() => setMostrarMapa(!mostrarMapa)} className="btn-game" style={styles.btnSecundario}>🗺️ {mostrarMapa ? 'Ocultar Mapa Mental' : 'Ver Mapa Mental da Rodada'}</button>
              <button onClick={gerarPDFEstudos} className="btn-game" style={{ ...styles.btnSecundario, backgroundColor: '#10B981' }}>🖨️ Salvar Conteúdo (TXT)</button>
            </div>

            {mostrarMapa && (
              <div style={styles.areaMapaMental}>
                <h4 style={{ color: temaAtual.accent }}>📍 MAPA MENTAL DOS SEUS ACERTOS:</h4>
                <div style={styles.nohCentral}>TO SEMESTRE {semestre}</div>
                <div style={styles.linhaConexao}>│</div>
                <div style={styles.gridNohs}>
                  {acertosMapa.length > 0 ? acertosMapa.map((acerto, index) => (
                    <div key={index} style={styles.nohFilho}>✅ {acerto}</div>
                  )) : <p style={{ fontSize: '0.9rem', color: '#888' }}>Acerte perguntas no Quiz para ramificar seu mapa de conhecimento!</p>}
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
  page: { minHeight: '100vh', padding: '40px 20px', transition: 'all 0.5s ease', fontFamily: 'sans-serif', color: '#FFF' },
  container: { maxWidth: '700px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '30px' },
  mainTitle: { fontSize: '3.5rem', fontWeight: '900', color: '#FFCA28', margin: '0' },
  subtitle: { fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px' },
  card: { backgroundColor: '#15122C', borderRadius: '24px', padding: '30px', border: '4px solid #251F4F', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  cardTitle: { textAlign: 'center', fontSize: '1.4rem', marginBottom: '20px' },
  gridSemestres: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  btnSemestre: { padding: '20px', borderRadius: '16px', color: '#FFF', fontSize: '1.1rem', boxShadow: '0 6px 0 rgba(0,0,0,0.3)' },
  btnVoltar: { background: 'none', border: 'none', color: '#FF6A00', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' },
  abasAbordagem: { display: 'flex', justifyContent: 'space-around', borderBottom: '2px solid #251F4F', marginBottom: '25px', paddingBottom: '10px' },
  abaItem: { background: 'none', color: '#FFF', fontSize: '1rem', padding: '8px 16px' },
  caixaPerguntaMestre: { background: '#0F0C20', border: '2px solid #352D6E', borderRadius: '16px', padding: '20px', textAlign: 'center' },
  btnAlternativa: { padding: '16px', color: '#FFF', border: '2px solid #352D6E', borderRadius: '14px', width: '100%', textAlign: 'left', fontSize: '1.05rem' },
  btnAvancar: { padding: '14px 30px', color: '#FFF', borderRadius: '12px', width: '100%' },
  caixaMemoria: { minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', padding: '15px', fontWeight: 'bold', cursor: 'pointer', color: '#FFF' },
  ferramentasEstudo: { display: 'flex', gap: '12px', marginTop: '30px', borderTop: '2px solid #251F4F', paddingTop: '20px' },
  btnSecundario: { padding: '12px 20px', backgroundColor: '#352D6E', color: '#FFF', borderRadius: '10px', flex: 1, fontSize: '0.9rem' },
  areaMapaMental: { marginTop: '20px', padding: '20px', backgroundColor: '#0F0C20', borderRadius: '16px', border: '2px solid #251F4F', textAlign: 'center' },
  nohCentral: { background: '#FFCA28', color: '#000', padding: '10px 20px', borderRadius: '20px', display: 'inline-block', fontWeight: 'bold' },
  linhaConexao: { color: '#FFCA28', margin: '2px 0', fontSize: '1.2rem' },
  gridNohs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px' },
  nohFilho: { background: '#251F4F', border: '1px solid #352D6E', padding: '8px 12px', borderRadius: '12px', fontSize: '0.9rem' }
};

