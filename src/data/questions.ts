export interface Pergunta {
    q: string;
    a: string[];
    c: number;
}

export interface FlashcardItem {
    frente: string;
    verso: string;
}

export interface LinkEstudo {
    titulo: string;
    url: string;
    descricao: string;
}

export interface SemestreConteudo {
    nome: string;
    perguntas: {
        facil: Pergunta[];
        medio: Pergunta[];
        dificil: Pergunta[];
    };
    flashcards: FlashcardItem[];
    links: LinkEstudo[];
}

export const academicDatabase: Record<number, SemestreConteudo> = {
    1: {
        nome: "1º Semestre: Fundamentos e Anatomia Humana",
        perguntas: {
            facil: [
                { q: "Qual o principal objetivo da Terapia Ocupacional?", a: ["Promover autonomia e independência nas ocupações", "Apenas realizar massagens relaxantes", "Prescrever medicamentos controlados", "Realizar cirurgias reparadoras"], c: 0 },
                { q: "O que significa a sigla AVD no contexto da TO?", a: ["Atividades da Vida Diária", "Análise de Vetores Diretos", "Ação Voluntária Direcionada", "Associação de Vidas Dignas"], c: 0 }
            ],
            medio: [
                { q: "Na história da TO, o movimento do Tratamento Moral no século XVIII influenciou:", a: ["A humanização do cuidado em instituições de saúde mental", "A criação de próteses puramente mecânicas", "O isolamento total do paciente da sociedade", "O desenvolvimento da farmacologia moderna"], c: 0 }
            ],
            dificil: [
                { q: "Quais ossos compõem a fileira proximal do carpo na anatomia do membro superior?", a: ["Escafóide, Semilunar, Piramidal e Pisiforme", "Trapézio, Trapezoide, Capitato e Hamato", "Rádio, Ulna e Epífise", "Falanges proximais e distais"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "AVD", verso: "Atividades da Vida Diária (Higiene, alimentação, vestir-se, mobilidade funcional)." },
            { frente: "Tratamento Moral", verso: "Movimento que deu as bases lúdicas e ocupacionais para a TO na saúde mental." }
        ],
        links: [
            { titulo: "Anatomia Humana - Sistema Esquelético", url: "https://www.kenhub.com/pt/library/anatomia/sistema-esqueletico", descricao: "Artigo completo para revisar os ossos do carpo e membros superiores." },
            { titulo: "História da Terapia Ocupacional", url: "https://www.revistas.usp.br/rto", descricao: "Revista de TO da USP com artigos sobre as origens do Tratamento Moral." }
        ]
    },
    2: {
        nome: "2º Semestre: Fisiologia e Sociologia da Saúde",
        perguntas: {
            facil: [
                { q: "Qual o principal órgão responsável pelo bombeamento de sangue no corpo humano?", a: ["Coração", "Pulmão", "Rim", "Fígado"], c: 0 }
            ],
            medio: [
                { q: "Em Fisiologia Humana, qual sistema é responsável pela regulação hormonal do organismo?", a: ["Sistema Endócrino", "Sistema Nervoso Autônomo", "Sistema Linfático", "Sistema Tegumentar"], c: 0 }
            ],
            dificil: [
                { q: "O conceito de 'Processo Saúde-Doença' na Sociologia compreende que a saúde é determinada por:", a: ["Fatores biológicos, sociais, econômicos e culturais", "Apenas pela carga genética do indivíduo", "Pela sorte e escolhas puramente individuais", "Exclusivamente pelo clima da região"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "Homeostase", verso: "Estado de equilíbrio dinâmico e constante das funções do corpo humano." }
        ],
        links: [
            { titulo: "Fisiologia Humana Dinâmica", url: "https://www.biologianet.com/anatomia-fisiologia-humanas", descricao: "Resumos interativos sobre o sistema endócrino e cardiovascular." }
        ]
    },
    3: {
        nome: "3º Semestre: Cinesiologia e Biomecânica",
        perguntas: {
            facil: [
                { q: "Qual plano divide o corpo anatomicamente em metades direita e esquerda?", a: ["Plano Sagital", "Plano Frontal", "Plano Transverso", "Plano Coronal"], c: 0 }
            ],
            medio: [
                { q: "Uma contração muscular onde o músculo gera força e se encurta visualmente é classificada como:", a: ["Concêntrica", "Excêntrica", "Isométrica", "Isocinética"], c: 0 }
            ],
            dificil: [
                { q: "Em uma alavanca mecânica de Terceira Classe (Interpotente), a força potente está localizada:", a: ["Entre o ponto fixo (eixo) e a força resistente", "Na extremidade oposta ao eixo fixo articular", "No meio exato entre duas forças de mesma intensidade", "Fora do alinhamento do sistema ósseo"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "Alavanca de 3ª Classe", verso: "Interpotente. Favorece a velocidade e amplitude, comum nos movimentos humanos." }
        ],
        links: [
            { titulo: "Fundamentos de Cinesiologia", url: "https://www.fisioterapia.com.br", descricao: "Guias visuais sobre planos de movimento, abdução e adução." }
        ]
    },
    4: {
        nome: "4º Semestre: Desenvolvimento Humano e Infância",
        perguntas: {
            facil: [
                { q: "O brincar na infância é considerado pela Terapia Ocupacional como:", a: ["A principal ocupação da criança nesta fase de desenvolvimento", "Apenas uma forma de passar o tempo vago", "Uma atividade opcional que não gera aprendizado", "Um comportamento meramente motor sem função cognitiva"], c: 0 }
            ],
            medio: [
                { q: "Segundo os marcos do desenvolvimento motor, com quantos meses espera-se que o bebê consiga sentar sem apoio?", a: ["Entre 6 e 8 meses", "Com 2 meses de vida", "Apenas após os 14 meses", "Com 12 meses cravados"], c: 0 }
            ],
            dificil: [
                { q: "Na Teoria do Desenvolvimento Cognitivo de Piaget, a fase em que a criança opera com lógica sobre objetos concretos é:", a: ["Operatório Concreto", "Sensório-motor", "Pré-operatório", "Operatório Formal"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "Brincar Lúdico", verso: "Ocupação central da infância essencial para cognição, socialização e habilidades motoras." }
        ],
        links: [
            { titulo: "Marcos do Desenvolvimento Infantil", url: "https://www.sbp.com.br", descricao: "Diretrizes oficiais da Sociedade Brasileira de Pediatria sobre marcos motores." }
        ]
    },
    5: {
        nome: "5º Semestre: Tecnologia Assistiva e Próteses",
        perguntas: {
            facil: [
                { q: "Qual o objective principal da Tecnologia Assistiva na TO?", a: ["Ampliar as habilidades funcionais e promover autonomia de pessoas com deficiência", "Substituir o esforço do terapeuta durante as sessões", "Criar robôs industriais de alta tecnologia", "Vender equipamentos de reabilitação importados"], c: 0 }
            ],
            medio: [
                { q: "A adaptação de talheres com cabos engrossados para pacientes com pouca preensão palmar se classifica como:", a: ["Auxílio para a vida diária (Tecnologia Assistiva)", "Recurso de alta tecnologia computacional", "Órtese dinâmica de punho", "Procedimento cirúrgico invasivo"], c: 0 }
            ],
            dificil: [
                { q: "Ao prescrever uma cadeira de rodas adaptada, qual aspecto ambiental deve ser prioritariamente avaliado?", a: ["A acessibilidade arquitetônica dos locais que o usuário frequenta", "A cor estética estofada do equipamento", "O peso do profissional que está fazendo a avaliação clínica", "O fabricante internacional da estrutura mecânica"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "Tecnologia Assistiva", verso: "Produtos, recursos ou metodologias que promovem a funcionalidade e participação de PcD." }
        ],
        links: [
            { titulo: "Portal da Tecnologia Assistiva", url: "http://www.assistiva.com.br", descricao: "Exemplos práticos de adaptações de AVDs e comunicação alternativa." }
        ]
    },
    6: {
        nome: "6º Semestre: Saúde Mental e Contextos Sociais",
        perguntas: {
            facil: [
                { q: "Os CAPS (Centros de Atenção Psicossocial) atuam sob qual lógica de cuidado?", a: ["Reinserção social e base comunitária", "Isolamento em hospitais psiquiátricos", "Tratamento exclusivamente medicamentoso", "Internação compulsória de longa permanência"], c: 0 }
            ],
            medio: [
                { q: "A Terapia Ocupacional Social foca sua atuação principalmente em:", a: ["Populações em situação de vulnerabilidade e exclusão social", "Atletas de alta performance em busca de medalhas", "Processos puramente cirúrgicos hospitalares", "Bebês prematuros em incubadoras neonatais"], c: 0 }
            ],
            dificil: [
                { q: "No contexto da Reabilitação Psicossocial, as Oficinas Terapêuticas são utilizadas para:", a: ["Produzir contratualidade social, expressão e geração de renda/autonomia", "Ocupar o tempo do paciente para evitar o ócio improdutivo", "Testar aptidões puramente industriais sob pressão extrema", "Substituir as consultas psicológicas individuais"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "CAPS", verso: "Serviço de saúde mental comunitário que substitui o modelo de manicômios isolados." }
        ],
        links: [
            { titulo: "Cadernos de Saúde Mental do SUS", url: "https://saude.gov.br", descricao: "Manuais do Ministério da Saúde sobre a rede de atenção psicossocial (RAPS)." }
        ]
    },
    7: {
        nome: "7º Semestre: TO na Saúde do Adulto e do Idoso",
        perguntas: {
            facil: [
                { q: "A alteração cognitiva natural decorrente do envelhecimento saudável é denominada:", a: ["Senescência", "Senilidade", "Demência precoce", "Mal de Alzheimer"], c: 0 }
            ],
            medio: [
                { q: "Após um Acidente Vascular Encefálico (AVE), a TO foca a reabilitação funcional buscando:", a: ["Maximizar a independência nas Atividades de Vida Diária (AVDs)", "Curar instantaneamente a lenão neurológica central", "Prescrever sessões de hidroginástica intensiva desacompanhada", "Apenas monitorar os sinais vitais do paciente em repouso"], c: 0 }
            ],
            dificil: [
                { q: "Na avaliação do idoso frágil, a escala que mensura o grau de independência nas Atividades Instrumentais da Vida Diária (AIVDs) é:", a: ["Escala de Lawton", "Índice de Katz", "Mini Exame do Estado Mental (MEEM)", "Goniometria digital"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "Senescência", verso: "Envelhecimento biológico normal e saudável, sem patologias associadas." }
        ],
        links: [
            { titulo: "Envelhecimento Ativo e Saúde do Idoso", url: "https://www.paho.org/pt", descricao: "Diretrizes da OPAS/OMS para avaliação funcional e fragilidade em idosos." }
        ]
    },
    8: {
        nome: "8º Semestre: Estágios Supervisionados e Deontologia",
        perguntas: {
            facil: [
                { q: "O código de ética que rege os profissionais de Terapia Ocupacional no Brasil é fiscalizado pelo:", a: ["COFFITO / CREFITO", "CRM", "OAB", "Conselho Federal de Enfermagem"], c: 0 }
            ],
            medio: [
                { q: "Durante o estágio hospitalar, o registro da evolução do paciente no prontuário clínico é:", a: ["Obrigatório por lei e fundamental para a continuidade do cuidado", "Uma tarefa opcional feita apenas quando sobra tempo na rotina", "Responsabilidade exclusiva do médico chefe da ala", "Proibido para estudantes e estagiários do curso"], c: 0 }
            ],
            dificil: [
                { q: "Segundo a Resolução COFFITO sobre o sigilo profissional, o Terapeuta Ocupacional pode quebrar o sigilo se:", a: ["Houver justo motivo previsto em lei, como risco de vida ao paciente ou a terceiros", "A família do paciente quiser saber detalhes por mera curiosidade cotidiana", "O caso clínico for interessante para contar informalmente para amigos", "O paciente faltar a duas sessões consecutivas sem justificativa formal"], c: 0 }
            ]
        },
        flashcards: [
            { frente: "COFFITO", verso: "Conselho Federal de Fisioterapia e Terapia Ocupacional, órgão regulador e fiscalizador da profissão." }
        ],
        links: [
            { titulo: "Código de Ética da TO - COFFITO", url: "https://www.coffito.gov.br", descricao: "Acesso oficial à resolução que rege a deontologia e direitos do terapeuta ocupacional." }
        ]
    }
};
