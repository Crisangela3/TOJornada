import React, { useState } from 'react';
import { academicDatabase } from './data/questions';
// @ts-ignore
import './styles/index.css';

export default function App() {
  const [semestreAtual, setSemestreAtual] = useState<number | null>(null);
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [mostrarManual, setMostrarManual] = useState(false);

  // Filtrar as perguntas do semestre selecionado
  const perguntasDoSemestre = semestreAtual 
    ? academicDatabase.filter(q => q.semester === semestreAtual)
    : [];

  const lidarComResposta = (indexOpcao: number) => {
    if (revelado) return;
    setRespostaSelecionada(indexOpcao);
    setRevelado(true);
  };

  const proximaPergunta = () => {
    setRespostaSelecionada(null);
    setRevelado(false);
    if (perguntaAtualIndex + 1 < perguntasDoSemestre.length) {
      setPerguntaAtualIndex(perguntaAtualIndex + 1);
    } else {
      // Fim do bloco de perguntas do semestre
      alert("Parabéns! Você concluiu os desafios deste semestre! 🎉");
      setSemestreAtual(null);
      setPerguntaAtualIndex(0);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* Cabeçalho com o Avatar Animado que você pediu */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="avatar-animado">👩‍💻</div>
        <h1 style={{ color: 'var(--laranja)', fontSize: '2.5rem', marginTop: '10px' }}>
          TOJornada
        </h1>
        <p style={{ color: 'var(--azul-escuro)', fontWeight: 'bold' }}>
          O Desafio Ocupacional Acadêmico
        </p>
      </header>

      {/* Menu Principal de Escolha de Semestres */}
      {semestreAtual === null ? (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Selecione um Semestre para Iniciar sua Jornada:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            {[1, 2, 3, 4].map((semestre) => (
              <button
                key={semestre}
                onClick={() => setSemestreAtual(semestre)}
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--azul-claro)',
                  color: 'var(--azul-escuro)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
              >
                {semestre}º Semestre
              </button>
            ))}
          </div>

          <button 
            onClick={() => setMostrarManual(!mostrarManual)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--amarelo)',
              color: 'var(--azul-escuro)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {mostrarManual ? 'Fechar Manual' : 'Ver Manual do Jogo 📖'}
          </button>

          {mostrarManual && (
            <div style={{ 
              marginTop: '20px', 
              padding: '20px', 
              backgroundColor: 'var(--card-branco)', 
              borderRadius: '12px', 
              textAlign: 'left',
              border: '2px solid var(--amarelo)'
            }}>
              <h3>Como Jogar?</h3>
              <p style={{ marginTop: '10px' }}>1. Escolha o semestre que você deseja revisar.</p>
              <p>2. Leia a pergunta do Flashcard técnico com atenção.</p>
              <p>3. Clique na resposta que você considera correta.</p>
              <p>4. O sistema dará um feedback visual instantâneo (Verde para correto, Vermelho para incorreto).</p>
            </div>
          )}
        </div>
      ) : (
        /* Tela de Flashcards Ativa */
        <div>
          <button 
            onClick={() => setSemestreAtual(null)}
            style={{ marginBottom: '20px', background: 'none', border: 'none', color: 'var(--laranja)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ⬅️ Voltar para os Semestres
          </button>

          <div style={{
            backgroundColor: 'var(--card-branco)',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '3px solid var(--azul-claro)'
          }}>
            <span style={{ backgroundColor: 'var(--amarelo)', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Questão {perguntaAtualIndex + 1} de {perguntasDoSemestre.length}
            </span>

            <h3 style={{ marginTop: '20px', marginBottom: '20px', lineHeight: '1.5' }}>
              {perguntasDoSemestre[perguntaAtualIndex]?.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {perguntasDoSemestre[perguntaAtualIndex]?.options.map((opcao, idx) => {
                let corDeFundo = 'var(--bg-suave)';
                let corDoTexto = 'var(--azul-escuro)';

                if (revelado) {
                  if (idx === perguntasDoSemestre[perguntaAtualIndex].correctAnswer) {
                    corDeFundo = 'var(--verde)';
                    corDoTexto = '#FFFFFF';
                  } else if (respostaSelecionada === idx) {
                    corDeFundo = 'var(--vermelho)';
                    corDoTexto = '#FFFFFF';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => lidarComResposta(idx)}
                    disabled={revelado}
                    style={{
                      padding: '15px',
                      backgroundColor: corDeFundo,
                      color: corDoTexto,
                      border: '2px solid var(--azul-claro)',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '1rem',
                      cursor: revelado ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {opcao}
                  </button>
                );
              })}
            </div>

            {revelado && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                  {respostaSelecionada === perguntasDoSemestre[perguntaAtualIndex].correctAnswer 
                    ? '🎉 Excelente! Resposta correta.' 
                    : '❌ Que pena! Estude um pouco mais esse ponto.'}
                </p>
                <button
                  onClick={proximaPergunta}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--laranja)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {perguntaAtualIndex + 1 === perguntasDoSemestre.length ? 'Finalizar Semestre' : 'Próxima Pergunta ➡️'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

