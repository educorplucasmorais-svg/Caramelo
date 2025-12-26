// Serviço de Chatbot com IA para Caramelo
// Baseado em: WhatsApp Cloud API, Typebot, Make.com, OpenAI GPT-4o

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  image?: string;
  audio?: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
}

export interface QuickReply {
  text: string;
  emoji?: string;
  action?: string;
}

interface ConversationContext {
  stage: 'welcome' | 'triagem' | 'adocao' | 'denuncia' | 'voluntariado' | 'doacao' | 'monitoramento' | 'geral';
  data: Record<string, string>;
  step: number;
}

// Contexto da conversa (simulando sessão)
let context: ConversationContext = {
  stage: 'welcome',
  data: {},
  step: 0
};

// Fluxos de triagem de adoção
const adoptionFlow = {
  questions: [
    {
      question: "Ótimo! Vamos iniciar sua triagem de adoção. 🐾\n\nPrimeiro, você está interessado em adotar qual tipo de animal?",
      quickReplies: [
        { text: "Cachorro", emoji: "🐕" },
        { text: "Gato", emoji: "🐱" },
        { text: "Outro", emoji: "🐾" }
      ],
      field: "tipoAnimal"
    },
    {
      question: "Perfeito! E qual porte você prefere?",
      quickReplies: [
        { text: "Pequeno", emoji: "🐕" },
        { text: "Médio", emoji: "🐕" },
        { text: "Grande", emoji: "🐕" },
        { text: "Sem preferência", emoji: "❓" }
      ],
      field: "porte"
    },
    {
      question: "Você mora em qual tipo de residência?",
      quickReplies: [
        { text: "Casa com quintal", emoji: "🏡" },
        { text: "Casa sem quintal", emoji: "🏠" },
        { text: "Apartamento", emoji: "🏢" },
        { text: "Sítio/Chácara", emoji: "🌳" }
      ],
      field: "moradia"
    },
    {
      question: "Sua residência possui telas de proteção nas janelas?",
      quickReplies: [
        { text: "Sim, todas", emoji: "✅" },
        { text: "Apenas algumas", emoji: "⚠️" },
        { text: "Não possui", emoji: "❌" },
        { text: "Não aplicável", emoji: "➖" }
      ],
      field: "telasProtecao"
    },
    {
      question: "Você já possui outros animais em casa?",
      quickReplies: [
        { text: "Sim, cachorros", emoji: "🐕" },
        { text: "Sim, gatos", emoji: "🐱" },
        { text: "Sim, ambos", emoji: "🐾" },
        { text: "Não", emoji: "❌" }
      ],
      field: "outrosAnimais"
    },
    {
      question: "Todos os moradores da casa concordam com a adoção?",
      quickReplies: [
        { text: "Sim, todos", emoji: "✅" },
        { text: "A maioria", emoji: "⚠️" },
        { text: "Ainda não discutimos", emoji: "💬" }
      ],
      field: "acordoFamilia"
    },
    {
      question: "Você tem disponibilidade financeira para cuidados veterinários (vacinas, ração, emergências)?",
      quickReplies: [
        { text: "Sim, totalmente", emoji: "✅" },
        { text: "Parcialmente", emoji: "⚠️" },
        { text: "Preciso avaliar", emoji: "💭" }
      ],
      field: "condicaoFinanceira"
    },
    {
      question: "Por fim, você concorda com os termos de adoção responsável e com visitas de acompanhamento?",
      quickReplies: [
        { text: "Sim, aceito", emoji: "✅" },
        { text: "Quero ler os termos", emoji: "📄" }
      ],
      field: "aceitaTermos"
    }
  ]
};

// Respostas inteligentes baseadas em palavras-chave
const intelligentResponses: Record<string, { response: string; quickReplies?: QuickReply[] }> = {
  'adotar|adoção|adocao|quero adotar': {
    response: "Que maravilha que você quer adotar! 🎉\n\nA adoção responsável é um ato de amor que transforma vidas. Antes de conhecer nossos animais, precisamos fazer uma breve triagem para garantir o melhor match possível.\n\nVamos começar?",
    quickReplies: [
      { text: "Sim, vamos!", emoji: "✅" },
      { text: "Ver animais primeiro", emoji: "🐾" },
      { text: "Tenho dúvidas", emoji: "❓" }
    ]
  },
  'denunciar|denuncia|maus-tratos|maus tratos|abuso': {
    response: "Recebemos sua intenção de denúncia. 🚨\n\nPara registrar uma denúncia de maus-tratos, precisamos de algumas informações:\n\n1️⃣ Localização (endereço ou ponto de referência)\n2️⃣ Descrição da situação\n3️⃣ Foto ou vídeo (se possível)\n\nVocê pode enviar essas informações agora. Todas as denúncias são tratadas com sigilo.",
    quickReplies: [
      { text: "Enviar localização", emoji: "📍" },
      { text: "Enviar foto", emoji: "📷" },
      { text: "Descrever situação", emoji: "📝" }
    ]
  },
  'voluntário|voluntaria|voluntariado|ajudar|quero ajudar': {
    response: "Obrigado pelo interesse em ser voluntário! 💛\n\nTemos várias formas de você contribuir:\n\n🏠 **Lar Temporário**: Abrigar animais até a adoção\n🚗 **Transporte**: Levar animais para consultas\n📱 **Divulgação**: Ajudar nas redes sociais\n🏥 **Eventos**: Apoiar em feiras de adoção\n🧹 **Abrigo**: Ajudar na manutenção\n\nQual área mais combina com você?",
    quickReplies: [
      { text: "Lar Temporário", emoji: "🏠" },
      { text: "Transporte", emoji: "🚗" },
      { text: "Divulgação", emoji: "📱" },
      { text: "Eventos", emoji: "🎪" }
    ]
  },
  'doar|doação|doacao|contribuir|pix|ajuda financeira': {
    response: "Sua doação faz toda diferença! 💛\n\nCom sua contribuição, conseguimos:\n• 🩺 Castrar 1 animal: R$ 150\n• 💉 Vacinar 1 animal: R$ 80\n• 🍖 Ração por 1 mês: R$ 120\n• 🏥 Emergência veterinária: R$ 300+\n\n**Chave PIX:** caramelo@ong.org.br\n\nQualquer valor ajuda! Você pode também doar ração, medicamentos ou itens de higiene.",
    quickReplies: [
      { text: "Fazer PIX", emoji: "💰" },
      { text: "Doar itens", emoji: "📦" },
      { text: "Apadrinhar animal", emoji: "💛" }
    ]
  },
  'horário|horario|visita|visitar|conhecer|endereço|endereco|localização|localizacao': {
    response: "📍 **Localização do Abrigo Caramelo**\n\nRua dos Animais Felizes, 123\nBairro Pet Friendly - São Paulo/SP\n\n🕐 **Horário de Visitação**\nTerça a Domingo: 10h às 17h\n(Segunda: fechado para manutenção)\n\n⚠️ Recomendamos agendar sua visita para melhor atendimento!",
    quickReplies: [
      { text: "Agendar visita", emoji: "📅" },
      { text: "Ver no mapa", emoji: "🗺️" },
      { text: "Ligar agora", emoji: "📞" }
    ]
  },
  'animal perdido|perdi meu|cachorro perdido|gato perdido|sumiu': {
    response: "Sentimos muito pelo seu pet! 😢\n\nVamos ajudar a encontrá-lo. Envie:\n\n1️⃣ Foto recente do animal\n2️⃣ Nome e características\n3️⃣ Local onde foi visto pela última vez\n4️⃣ Seu contato\n\nVamos divulgar em nossa rede de voluntários e parceiros!",
    quickReplies: [
      { text: "Enviar foto", emoji: "📷" },
      { text: "Descrever animal", emoji: "📝" }
    ]
  },
  'encontrei|achei um|animal abandonado|resgate': {
    response: "Você encontrou um animal! 🐾\n\nPor favor, nos envie:\n\n1️⃣ 📷 Foto do animal\n2️⃣ 📍 Localização exata\n3️⃣ 📋 Condição do animal (machucado, assustado, etc.)\n\nEnquanto isso, se possível:\n• Ofereça água\n• Mantenha em local seguro\n• Não force aproximação se parecer agressivo",
    quickReplies: [
      { text: "Enviar foto", emoji: "📷" },
      { text: "Enviar localização", emoji: "📍" },
      { text: "Preciso de ajuda urgente", emoji: "🆘" }
    ]
  },
  'castração|castracao|castrar': {
    response: "🏥 **Programa de Castração**\n\nOferecemos castração a preços populares:\n\n🐕 Cães fêmeas: R$ 180\n🐕 Cães machos: R$ 120\n🐱 Gatas: R$ 130\n🐱 Gatos: R$ 90\n\n*Valores para animais de até 15kg. Consulte valores para portes maiores.*\n\nAgendamentos: Segunda a Sexta, 9h às 17h",
    quickReplies: [
      { text: "Agendar castração", emoji: "📅" },
      { text: "Mais informações", emoji: "ℹ️" }
    ]
  }
};

// Análise de imagem simulada (BCS - Body Condition Score)
const imageAnalysisResponses = {
  animal: [
    {
      analysis: "📊 **Análise da Imagem - Condição do Animal**\n\n✅ **Escore de Condição Corporal (BCS):** 5/9 (Ideal)\n\nO animal aparenta estar em bom estado de saúde:\n• Costelas palpáveis com leve cobertura de gordura\n• Cintura visível de cima\n• Pelagem com bom aspecto\n\n💡 **Recomendação:** Manter a alimentação atual e exercícios regulares.",
      status: "saudavel"
    },
    {
      analysis: "📊 **Análise da Imagem - Condição do Animal**\n\n⚠️ **Escore de Condição Corporal (BCS):** 3/9 (Abaixo do peso)\n\nO animal aparenta estar abaixo do peso ideal:\n• Costelas facilmente visíveis\n• Cintura muito pronunciada\n• Possível desnutrição\n\n🚨 **Recomendação:** Consulta veterinária recomendada. Aumente gradualmente a alimentação.",
      status: "atencao"
    }
  ],
  ambiente: [
    {
      analysis: "🏠 **Análise do Ambiente**\n\n✅ **Avaliação Geral:** Adequado para adoção\n\n**Pontos Positivos:**\n• Telas de proteção identificadas ✅\n• Espaço adequado ✅\n• Ambiente limpo ✅\n\n**Observações:**\n• Ambiente aparenta ser seguro para o animal\n• Sem riscos visíveis identificados\n\n👍 Aprovado para próxima etapa da adoção!",
      status: "aprovado"
    },
    {
      analysis: "🏠 **Análise do Ambiente**\n\n⚠️ **Avaliação Geral:** Requer adequações\n\n**Pontos de Atenção:**\n• Janelas sem tela de proteção ⚠️\n• Plantas que podem ser tóxicas visíveis ⚠️\n\n**Recomendações:**\n• Instalar telas em todas as janelas\n• Verificar se as plantas são seguras\n\n📋 Envie nova foto após as adequações.",
      status: "pendente"
    }
  ]
};

export const chatbotService = {
  getWelcomeMessage(userName: string): Message {
    context = { stage: 'welcome', data: {}, step: 0 };
    
    return {
      id: '0',
      type: 'bot',
      content: `Olá, ${userName}! 🐕\n\nEu sou o **Caramelo**, assistente virtual da ONG de Proteção Animal.\n\nPosso ajudar você com:\n• 🐾 Adoção de animais\n• 🚨 Denúncias de maus-tratos\n• 🤝 Voluntariado\n• 💛 Doações\n• 📍 Informações sobre o abrigo\n\nComo posso ajudar hoje?`,
      timestamp: new Date(),
      quickReplies: [
        { text: "Quero adotar", emoji: "🐾" },
        { text: "Denunciar maus-tratos", emoji: "🚨" },
        { text: "Ser voluntário", emoji: "🤝" },
        { text: "Fazer doação", emoji: "💛" }
      ]
    };
  },

  async processMessage(userMessage: string, _history: Message[]): Promise<Message> {
    const lowerMessage = userMessage.toLowerCase();

    // Verifica se está no fluxo de adoção
    if (context.stage === 'adocao') {
      return this.handleAdoptionFlow(userMessage);
    }

    // Inicia fluxo de adoção
    if (lowerMessage.includes('sim, vamos') || lowerMessage.includes('iniciar triagem')) {
      context.stage = 'adocao';
      context.step = 0;
      const question = adoptionFlow.questions[0];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: question.question,
        timestamp: new Date(),
        quickReplies: question.quickReplies
      };
    }

    // Busca resposta inteligente baseada em palavras-chave
    for (const [pattern, data] of Object.entries(intelligentResponses)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lowerMessage)) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: data.response,
          timestamp: new Date(),
          quickReplies: data.quickReplies
        };
      }
    }

    // Resposta padrão com IA simulada
    return this.getDefaultResponse(userMessage);
  },

  handleAdoptionFlow(userMessage: string): Message {
    // Salva resposta do step atual
    const currentQuestion = adoptionFlow.questions[context.step];
    if (currentQuestion) {
      context.data[currentQuestion.field] = userMessage;
    }

    // Avança para próximo step
    context.step++;

    // Verifica se completou o fluxo
    if (context.step >= adoptionFlow.questions.length) {
      context.stage = 'welcome';
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `🎉 **Triagem Concluída!**\n\n Obrigado por completar nossa triagem de adoção.\n\n**Resumo das suas respostas:**\n• Animal: ${context.data.tipoAnimal}\n• Porte: ${context.data.porte}\n• Moradia: ${context.data.moradia}\n• Telas: ${context.data.telasProtecao}\n\n📋 Sua candidatura foi registrada! Um voluntário entrará em contato em até 48 horas para agendar uma visita.\n\n📷 Enquanto isso, você pode enviar fotos do seu lar para agilizar a aprovação!`,
        timestamp: new Date(),
        quickReplies: [
          { text: "Enviar foto do lar", emoji: "📷" },
          { text: "Ver animais disponíveis", emoji: "🐾" },
          { text: "Voltar ao início", emoji: "🏠" }
        ]
      };
    }

    // Retorna próxima pergunta
    const nextQuestion = adoptionFlow.questions[context.step];
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: nextQuestion.question,
      timestamp: new Date(),
      quickReplies: nextQuestion.quickReplies
    };
  },

  async analyzeImage(_imageUrl: string): Promise<Message> {
    // Simula análise de imagem com GPT-4o Vision
    const isAnimalPhoto = Math.random() > 0.5;
    const analysisType = isAnimalPhoto ? 'animal' : 'ambiente';
    const responses = imageAnalysisResponses[analysisType];
    const randomAnalysis = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: randomAnalysis.analysis,
      timestamp: new Date(),
      quickReplies: [
        { text: "Enviar outra foto", emoji: "📷" },
        { text: "Continuar triagem", emoji: "➡️" },
        { text: "Falar com humano", emoji: "👤" }
      ]
    };
  },

  getDefaultResponse(userMessage: string): Message {
    const responses = [
      `Entendi! Você disse: "${userMessage}"\n\nPosso ajudar com adoção, denúncias, voluntariado ou doações. O que você gostaria de fazer?`,
      `Obrigado pela mensagem! 🐕\n\nPara melhor atendê-lo, selecione uma das opções abaixo ou descreva melhor como posso ajudar.`,
      `Recebi sua mensagem! Para um atendimento mais ágil, utilize os botões de ação rápida ou me conte mais detalhes sobre o que precisa.`
    ];

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      quickReplies: [
        { text: "Quero adotar", emoji: "🐾" },
        { text: "Denunciar", emoji: "🚨" },
        { text: "Voluntariado", emoji: "🤝" },
        { text: "Doar", emoji: "💛" }
      ]
    };
  }
};
