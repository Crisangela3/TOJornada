import { useState } from 'react';
import { academicDatabase } from './data/questions';

// Configuração de Estilos e Cores Temáticas por Semestre (Inspirado no seu Anexo)
const temasSemestre: Record<number, { bg: string; card: string; border: string; accent: string; texto: string }> = {
  1: { bg: 'linear-gradient(135deg, #1A153B 0%, #090714 100%)', card: '#15122C', border: '#A855F7', accent: '#A855F7', texto: '#FFF' }, // Roxo Neon
  2: { bg: 'linear-gradient(135deg, #0A192F 0%, #020C1B 100%)', card: '#0B1E36', border: '#00D2FF', accent: '#00D2FF', texto: '#FFF' }, // Cyber Azul
  3: { bg: 'linear-gradient(135deg, #062817 0%, #02110A 100%)', card: '#0B3A21', border: '#10B981', accent: '#10B981', texto: '#FFF' }, // Verde Esmeralda
  4: { bg: 'linear-gradient(135deg, #2D0B0B 0%, #140303 100%)', card: '#3E1212', border: '#EF4444', accent: '#EF4444', texto: '#FFF' }, // Vermelho Quente
  5: { bg: 'linear-gradient(135deg, #2B1805 0%, #140B02 100%)', card: '#3E240B', border: '#F59E0B', accent: '#F59E0B', texto: '#FFF' }, // Âmbar Glow
  6: { bg: 'linear-gradient(135deg, #2D0B22 0%, #14030F 100%)', card: '#421232', border: '#EC4899', accent: '#EC4899', texto: '#FFF' }, // Rosa Elétrico
  7: { bg: 'linear-gradient(135deg, #0B2428 0%, #030F11 100%)', card: '#123A40', border: '#06B6D4', accent: '#06B6D4', texto: '#FFF' }, // Ciano Profundo
  8: { bg: 'linear-gradient(135deg, #1C230B 0%, #0C1004 100%)', card: '#2B3612', border: '#84CC16', accent: '#84CC16', texto: '#FFF' }, // Lima Laser
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

  // Jogo da Memória - Estados Simples
  const [memoriaRevelada, setMemoriaRevelada] = useState<number | null>(null);

  const temaAtual = semestre ? temasSemestre[semestre] : { bg: 'radial-gradient(circle, #1A153B 0%, #090714 100%)', card: '#15122C', border: '#251F4F', accent: '#00D2FF', texto: '#FFF' };

  // Dados mockados ou importados com segurança
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

  // Função Simples para Simular Geração de PDF e download de resumo imprimível
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
          /* MENU PRINCIPAL DE SELEÇÃO */
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🎮 ESCOLHA UM MAPA ACADÊMICO:</h2>
            <div style={styles.gridSemestres}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setSemestre(num)}
                  className="btn-game"
                  style={{ ...styles.btnSemestre, backgroundColor: temasSemestre[num].border }}
                >
                  🎓 {num}º Semestre
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* PLATAFORMA INTERNA DO SEMESTRE */
          <div style={{ ...styles.card, backgroundColor: temaAtual.card, borderColor: temaAtual.border }}>
            <button onClick={() => setSemestre(null)} style={styles.btnVoltar}>⬅️ Mudar de Semestre</button>
            
            {/* ABAS DE ESTILOS DE JOGO DIFERENTES */}
            <div style={styles.abasAbordagem}>
              <button onClick={() => setModoJogo('quiz')} className={`btn-game ${modoJogo === 'quiz' ? 'tab-ativa' : ''}`} style={styles.abaItem}>🎮 QUIZ NEON</button>
              <button onClick={() => setModoJogo('memoria')} className={`btn-game ${modoJogo === 'memoria' ? 'tab-ativa' : ''}`} style={styles.abaItem}>🧠 MEMÓRIA REVERSA</button>
              <button onClick={() => setModoJogo('flashcard')} className={`btn-game ${modoJogo === 'flashcard' ? 'tab-ativa' : ''}`} style={styles.abaItem}>⚡ FLASHCARDS</button>
            </div>

            {/* INTERFACES DINÂMICAS CONFORME O MODO DE JOGO SELECIONADO */}
            {modoJogo === 'quiz' && (
              <div>
                {perguntaAtual ? (
                  <div>
                    <div style={styles.caixaPerguntaMestre}>
                      <h3>{perguntaAtual.q}</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                      {perguntaAtual
                      