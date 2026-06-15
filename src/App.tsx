import { useState } from 'react';
import { academicDatabase } from './data/questions';
import './styles/index.css';

export default function App() {
  const [semestre, setSemestre] = useState<number>(1);
  const [aba, setAba] = useState<'quiz' | 'flashcards' | 'links'>('quiz');
  const [exibirManual, setExibirManual] = useState<boolean>(true);
  
  // Controle do Quiz
  const [nivel, setNivel] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [idxPergunta, setIdxPergunta] = useState<number>(0);
  const [respondido, setRespondido] = useState<boolean>(false);
  const [altSelecionada, setAltSelecionada] = useState<number | null>(null);
  const [pontos, setPontos] = useState<number>(0);

  // Controle dos Flashcards
  const [idxFlash, setIdxFlash] = useState<number>(0);
  const [virado, setVirado] = useState<boolean>(false);

  const dadosSemestre = academicDatabase[semestre];
  const perguntasDisponiveis = dadosSemestre.perguntas[nivel];
  const perguntaAtual = perguntasDisponiveis[idxPergunta];
  const flashcardsDisponiveis = dadosSemestre.flashcards;
  const flashcardAtual = flashcardsDisponiveis[idxFlash];

  const verificarResposta = (index: number) => {
    if (respondido) return;
    setAltSelecionada(index);
    setRespondido(true);
    if (index === perguntaAtual.c) {
      const ganho = nivel === 'facil' ? 10 : nivel === 'medio' ? 20 : 30;
      setPontos(pontos + ganho);
    }
  };

  const avançarQuiz = () => {
    setRespondido(false);
    setAltSelecionada(null);
    if (idxPergunta + 1 < perguntasDisponiveis.length) {
      setIdxPergunta(idxPergunta + 1);
    } else {
      setIdxPergunta(0);
      alert(`🎉 Você concluiu todos os desafios do nível ${nivel.toUpperCase()} do ${semestre}º Semestre!`);
    }
  };

  return (
    <div>
      <header>
        <h1>TOJornada 🎮</h1>
        <p>O Desafio Lúdico da Terapis Ocupacional</p>
      </header>

      {/* Avatar Dinâmico */}
      <div id="avatar-ludico">🦄</div>

      <div className="container">
        
        {/* Seção Interativa do Manual de Instruções */}
        <button 
          className="btn-manual-toggle" 
          onClick={() => setExibirManual(!exibirManual)}
        >
          {exibirManual ? "📖 Ocultar Manual" : "📘 Abrir Manual de Instruções"}
        </button>

        {exibirManual && (
          <div className="manual-box">
            <h3>📖 Como Jogar o TOJornada:</h3>
            <ul>
              <li><strong>Passo 1:</strong> Selecione o Semestre letivo que deseja explorar no seletor abaixo.</li>
              <li><strong>Passo 2:</strong> Use o <strong>Quiz Dinâmico</strong> para testar seus conhecimentos divididos nos níveis 🟢 Fácil, 🟡 Médio e 🔴 Difícil.</li>
              <li><strong>Passo 3:</strong> Ative a aba de <strong>Flashcards</strong> para revisar conceitos rápidos de memorização ativa (basta clicar no card para virar!).</li>
              <li><strong>Passo 4:</strong> Acesse a aba <strong>Links de Estudo</strong> para abrir conteúdos reais e complementares direto da faculdade.</li>
            </ul>
          </div>
        )}

        {/* Escolha do Semestre */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📍 Escolha o Período Letivo:</label>
          <select 
            value={semestre} 
            onChange={(e) => {
              setSemestre(Number(e.target.value));
              setIdxPergunta(0);
              setIdxFlash(0);
              setRespondido(false);
              setAltSelecionada(null);
            }}
          >
            {Object.keys(academicDatabase).map((num) => (
              <option key={num} value={num}>
                {num}º Semestre - {academicDatabase[Number(num)].nome.split(": ")[1]}
              </option>
            ))}
          </select>
        </div>

        {/* Abas Alternáveis */}
        <div className="tabs">
          <button className={`tab-btn ${aba === 'quiz' ? 'active' : ''}`} onClick={() => setAba('quiz')}>🕹️ Quiz</button>
          <button className={`tab-btn ${aba === 'flashcards' ? 'active' : ''}`} onClick={() => setAba('flashcards')}>🎴 Flashcards</button>
          <button className={`tab-btn ${aba === 'links' ? 'active' : ''}`} onClick={() => setAba('links')}>📚 Material de Apoio</button>
        </div>

        {/* Card Principal de Exibição */}
        <div className="card">
          <h2>{dadosSemestre.nome}</h2>

          {/* CONTEÚDO DA ABA 1: QUIZ */}
          {aba === 'quiz' && perguntaAtual && (
            <div>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Nível:</label>
                  <select 
                    value={nivel} 
                    onChange={(e) => {
                      setNivel(e.target.value as any);
                      setIdxPergunta(0);
                      setRespondido(false);
                      setAltSelecionada(null);
                    }}
                    style={{ width: 'auto', display: 'inline-block', padding: '8px' }}
                  >
                    <option value="facil">🟢 Fácil (+10 pts)</option>
                    <option value="medio">🟡 Médio (+20 pts)</option>
                    <option value="dificil">🔴 Difícil (+30 pts)</option>
                  </select>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--laranja)' }}>🏆 Score: {pontos}</span>
              </div>

              <p style={{ fontSize: '19px', fontWeight: 'bold', margin: '20px 0' }}>{perguntaAtual.q}</p>

              {perguntaAtual.a.map((alternativa, i) => {
                let classeValidacao = "";
                if (respondido) {
                  if (i === perguntaAtual.c) classeValidacao = "correta";
                  else if (i === altSelecionada) classeValidacao = "errada";
                }
                return (
                  <button 
                    key={i} 
                    className={`opcao-btn ${classeValidacao}`} 
                    onClick={() => verificarResposta(i)}
                  >
                    {alternativa}
                  </button>
                );
              })}

              {respondido && (
                <div style={{ marginTop: '20px' }}>
                  <button className="btn-primary" onClick={avançarQuiz}>Próxima Questão ➡️</button>
                </div>
              )}
            </div>
          )}

          {/* CONTEÚDO DA ABA 2: FLASHCARDS */}
          {aba === 'flashcards' && (
            <div>
              {flashcardAtual ? (
                <div>
                  <p style={{ textAlgn: 'center', color: '#555' }}>Clique no cartão para descobrir o verso:</p>
                  <div className="flashcard-box" onClick={() => setVirado(!virado)}>
                    <div className={`flashcard-inner ${virado ? 'flipped' : ''}`}>
                      <div className="face front">{flashcardAtual.frente}</div>
                      <div className="face back">{flashcardAtual.verso}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <button 
                      className="btn-primary" 
                      onClick={() => {
                        setVirado(false);
                        setIdxFlash((idxFlash + 1) % flashcardsDisponiveis.length);
                      }}
                    >
                      Próximo Card 🔄
                    </button>
                  </div>
                </div>
              ) : (
                <p>Nenhum flashcard adicionado para este semestre.</p>
              )}
            </div>
          )}

          {/* CONTEÚDO DA ABA 3: MATERIAL DE APOIO */}
          {aba === 'links' && (
            <div>
              <p style={{ fontWeight: 'bold' }}>🔗 Links oficiais e artigos para aprofundar os estudos:</p>
              {dadosSemestre.links.map((lnk, idx) => (
                <div key={idx} className="link-estudo-card">
                  <a href={lnk.url} target="_blank" rel="noreferrer">{lnk.titulo} ↗️</a>
                  <p>{lnk.descricao}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
