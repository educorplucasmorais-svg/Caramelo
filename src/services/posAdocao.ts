// Serviço de Chatbot para Acompanhamento Pós-Adoção
// Sistema de monitoramento e suporte contínuo aos adotantes
// Integrado com WhatsApp Cloud API

import { whatsappService } from './whatsapp';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  whatsappId?: string; // ID da mensagem do WhatsApp
  phoneNumber?: string; // Número de telefone do adotante
  document?: {
    nome: string;
    tipo: string;
    url: string;
  };
  timestamp: Date;
  quickReplies?: QuickReply[];
}

export interface QuickReply {
  text: string;
  emoji?: string;
  action?: string;
}

export interface DocumentoUpload {
  file: File;
  tipo: string;
  adotanteId: string;
  animalId: string;
}

interface ConversationContext {
  stage: 'welcome' | 'checkin' | 'problema' | 'documento' | 'consulta' | 'geral';
  data: Record<string, string>;
  step: number;
  adocaoId?: string;
  phoneNumber?: string; // Número do WhatsApp do adotante
}

// Contexto da conversa
let context: ConversationContext = {
  stage: 'welcome',
  data: {},
  step: 0
};

// Simulação de banco de dados de documentos
interface Documento {
  id: string;
  tipo: string;
  nome: string;
  url: string;
  dataUpload: Date;
  adotanteId: string;
  animalId: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
}

let documentosDB: Documento[] = [];

// Fluxo de check-in periódico
const checkinFlow = {
  questions: [
    {
      question: "Vamos fazer um check-in! 🏠\n\nComo está a adaptação do seu pet em casa?",
      quickReplies: [
        { text: "Ótima! Está super adaptado", emoji: "😊" },
        { text: "Boa, mas com alguns desafios", emoji: "😌" },
        { text: "Difícil, preciso de ajuda", emoji: "😟" }
      ],
      field: "adaptacao"
    },
    {
      question: "Como está a alimentação do pet?",
      quickReplies: [
        { text: "Come bem e regularmente", emoji: "🍖" },
        { text: "Come pouco", emoji: "😐" },
        { text: "Recusa comida", emoji: "😕" }
      ],
      field: "alimentacao"
    },
    {
      question: "O pet está se socializando bem?",
      quickReplies: [
        { text: "Sim, é sociável", emoji: "🐕" },
        { text: "Ainda tímido", emoji: "😊" },
        { text: "Agressivo/Medroso", emoji: "⚠️" }
      ],
      field: "socializacao"
    },
    {
      question: "Algum comportamento preocupante?",
      quickReplies: [
        { text: "Nenhum", emoji: "✅" },
        { text: "Latidos/Miados excessivos", emoji: "🔊" },
        { text: "Destruição de objetos", emoji: "🏠" },
        { text: "Agressividade", emoji: "⚠️" }
      ],
      field: "comportamento"
    },
    {
      question: "Já levou o pet ao veterinário após a adoção?",
      quickReplies: [
        { text: "Sim, está tudo ok", emoji: "✅" },
        { text: "Sim, mas há problemas", emoji: "⚠️" },
        { text: "Ainda não levei", emoji: "📅" }
      ],
      field: "veterinario"
    }
  ]
};

// Respostas para problemas comuns
const problemasComuns: Record<string, { response: string; quickReplies: QuickReply[] }> = {
  'adaptacao': {
    response: "🏠 **Dicas para Adaptação**\n\n1. **Paciência**: Dê tempo ao pet (2-4 semanas)\n2. **Rotina**: Estabeleça horários fixos\n3. **Espaço seguro**: Crie um cantinho só dele\n4. **Estímulos**: Brinquedos e atividades\n\n💡 Se persistir, podemos agendar uma visita de suporte!",
    quickReplies: [
      { text: "Agendar visita", emoji: "📅" },
      { text: "Mais dicas", emoji: "💡" },
      { text: "Está melhorando", emoji: "✅" }
    ]
  },
  'alimentacao': {
    response: "🍖 **Problemas de Alimentação**\n\n**Possíveis causas:**\n• Mudança de ração muito rápida\n• Estresse da adaptação\n• Problemas de saúde\n\n**Soluções:**\n• Misture a ração antiga com a nova gradualmente\n• Estabeleça horários fixos\n• Consulte um veterinário se persistir\n\n⚠️ Apetite muito baixo por +48h requer veterinário!",
    quickReplies: [
      { text: "Já consultei veterinário", emoji: "✅" },
      { text: "Vou monitorar mais", emoji: "👀" },
      { text: "Preciso de indicação", emoji: "🏥" }
    ]
  },
  'comportamento': {
    response: "🐕 **Comportamento Animal**\n\n**Latidos/Miados excessivos:**\n• Pode ser ansiedade de separação\n• Falta de exercícios\n• Tédio\n\n**Destruição:**\n• Energia acumulada\n• Ansiedade\n• Falta de estímulos\n\n💡 **Recomendações:**\n• Passeios regulares (2x/dia)\n• Brinquedos interativos\n• Adestramento positivo\n\nPosso conectar você com um adestrador parceiro!",
    quickReplies: [
      { text: "Sim, quero adestrador", emoji: "👨‍🏫" },
      { text: "Vou tentar sozinho", emoji: "💪" },
      { text: "Melhorou!", emoji: "😊" }
    ]
  }
};

export const posAdocaoService = {
  getWelcomeMessage(adotanteNome: string): Message {
    context = { stage: 'welcome', data: {}, step: 0 };
    
    return {
      id: '0',
      type: 'bot',
      content: `Olá, ${adotanteNome}! 🏠\n\nBem-vindo(a) ao **Acompanhamento Pós-Adoção Caramelo**!\n\nEstou aqui para:\n• 📋 Fazer check-ins periódicos\n• 💡 Dar dicas de adaptação\n• 🩺 Acompanhar saúde do pet\n• 📁 Receber documentos\n• ❓ Responder dúvidas\n\nComo posso ajudar hoje?`,
      timestamp: new Date(),
      quickReplies: [
        { text: "Fazer check-in", emoji: "📋" },
        { text: "Reportar problema", emoji: "⚠️" },
        { text: "Enviar documento", emoji: "📄" },
        { text: "Tirar dúvida", emoji: "❓" }
      ]
    };
  },

  async processMessage(userMessage: string, _history: Message[]): Promise<Message> {
    const lowerMessage = userMessage.toLowerCase();

    // Fluxo de check-in
    if (context.stage === 'checkin') {
      return this.handleCheckinFlow(userMessage);
    }

    // Iniciar check-in
    if (lowerMessage.includes('check-in') || lowerMessage.includes('checkin')) {
      context.stage = 'checkin';
      context.step = 0;
      const question = checkinFlow.questions[0];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: question.question,
        timestamp: new Date(),
        quickReplies: question.quickReplies
      };
    }

    // Reportar problema
    if (lowerMessage.includes('problema') || lowerMessage.includes('dificuldade') || lowerMessage.includes('ajuda')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Entendo que está enfrentando dificuldades. Vamos resolver juntos! 💪\n\nQual é a área do problema?",
        timestamp: new Date(),
        quickReplies: [
          { text: "Adaptação", emoji: "🏠" },
          { text: "Alimentação", emoji: "🍖" },
          { text: "Comportamento", emoji: "🐕" },
          { text: "Saúde", emoji: "🩺" }
        ]
      };
    }

    // Problemas específicos
    if (lowerMessage.includes('adaptação') || lowerMessage.includes('adaptacao')) {
      const response = problemasComuns['adaptacao'];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        quickReplies: response.quickReplies
      };
    }

    if (lowerMessage.includes('alimentação') || lowerMessage.includes('alimentacao') || lowerMessage.includes('comida')) {
      const response = problemasComuns['alimentacao'];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        quickReplies: response.quickReplies
      };
    }

    if (lowerMessage.includes('comportamento') || lowerMessage.includes('late') || lowerMessage.includes('mia') || lowerMessage.includes('destrói')) {
      const response = problemasComuns['comportamento'];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        quickReplies: response.quickReplies
      };
    }

    // Enviar documento
    if (lowerMessage.includes('documento') || lowerMessage.includes('enviar')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "📁 **Upload de Documentos**\n\nClique no ícone 📎 ao lado do campo de mensagem para fazer upload de:\n\n• Termo de adoção assinado\n• Atestado veterinário\n• Fotos do animal\n• Comprovante de vacinação\n• Relatório de visita\n\nTodos os documentos são armazenados com segurança conforme a LGPD.",
        timestamp: new Date(),
        quickReplies: [
          { text: "Entendi", emoji: "✅" },
          { text: "Ver documentos enviados", emoji: "📋" }
        ]
      };
    }

    // Listar documentos
    if (lowerMessage.includes('ver documentos') || lowerMessage.includes('meus documentos')) {
      const docs = documentosDB.slice(-5); // Últimos 5 documentos
      const docList = docs.length > 0 
        ? docs.map(d => `• ${d.nome} - ${d.status === 'aprovado' ? '✅' : d.status === 'pendente' ? '⏳' : '❌'}`).join('\n')
        : 'Nenhum documento enviado ainda.';
      
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `📋 **Seus Documentos**\n\n${docList}\n\n💡 Clique em 📎 para enviar mais documentos.`,
        timestamp: new Date(),
        quickReplies: [
          { text: "Enviar novo documento", emoji: "📎" },
          { text: "Voltar", emoji: "🔙" }
        ]
      };
    }

    // Agendar visita
    if (lowerMessage.includes('agendar') || lowerMessage.includes('visita')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "📅 **Agendar Visita de Acompanhamento**\n\nNossas visitas incluem:\n• Avaliação do ambiente\n• Check-up comportamental\n• Orientações personalizadas\n• Fotos e relatório\n\n📞 Entre em contato:\n• WhatsApp: (11) 98765-4321\n• Email: visitas@caramelo.org.br\n\nOu aguarde! Um voluntário entrará em contato em até 48h.",
        timestamp: new Date(),
        quickReplies: [
          { text: "Aguardar contato", emoji: "✅" },
          { text: "Prefiro ligar", emoji: "📞" }
        ]
      };
    }

    // Resposta padrão
    return this.getDefaultResponse(userMessage);
  },

  handleCheckinFlow(userMessage: string): Message {
    const currentQuestion = checkinFlow.questions[context.step];
    if (currentQuestion) {
      context.data[currentQuestion.field] = userMessage;
    }

    context.step++;

    if (context.step >= checkinFlow.questions.length) {
      context.stage = 'welcome';
      
      // Analisa respostas e gera feedback
      const hasProblems = Object.values(context.data).some(v => 
        v.toLowerCase().includes('difícil') || 
        v.toLowerCase().includes('recusa') ||
        v.toLowerCase().includes('agressivo') ||
        v.toLowerCase().includes('ainda não')
      );

      const feedback = hasProblems 
        ? "⚠️ Percebo alguns pontos que precisam atenção. Recomendo:\n\n1. Consulta veterinária (se ainda não fez)\n2. Visita de acompanhamento\n3. Suporte comportamental\n\nVamos agendar uma visita?" 
        : "🎉 Que ótimo! Parece que está tudo indo muito bem!\n\nContinue assim e lembre-se:\n• Manter rotina de visitas ao vet\n• Enviar fotos mensalmente\n• Qualquer dúvida, estamos aqui!";

      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `✅ **Check-in Concluído!**\n\n${feedback}`,
        timestamp: new Date(),
        quickReplies: hasProblems ? [
          { text: "Sim, agendar visita", emoji: "📅" },
          { text: "Prefiro orientações online", emoji: "💬" }
        ] : [
          { text: "Enviar fotos", emoji: "📸" },
          { text: "Fazer novo check-in", emoji: "📋" }
        ]
      };
    }

    const nextQuestion = checkinFlow.questions[context.step];
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: nextQuestion.question,
      timestamp: new Date(),
      quickReplies: nextQuestion.quickReplies
    };
  },

  async uploadDocument(upload: DocumentoUpload): Promise<Message> {
    // Simula upload e armazenamento
    const documento: Documento = {
      id: Date.now().toString(),
      tipo: upload.tipo,
      nome: upload.file.name,
      url: URL.createObjectURL(upload.file),
      dataUpload: new Date(),
      adotanteId: upload.adotanteId,
      animalId: upload.animalId,
      status: 'pendente'
    };

    documentosDB.push(documento);

    // Simula aprovação automática após 2 segundos
    setTimeout(() => {
      const doc = documentosDB.find(d => d.id === documento.id);
      if (doc) doc.status = 'aprovado';
    }, 2000);

    const tipoNomes: Record<string, string> = {
      'termo_adocao': 'Termo de Adoção',
      'atestado_veterinario': 'Atestado Veterinário',
      'foto_animal': 'Foto do Animal',
      'comprovante_vacina': 'Comprovante de Vacinação',
      'relatorio_visita': 'Relatório de Visita',
      'outro': 'Outro Documento'
    };

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: `✅ **Documento Recebido!**\n\n📄 ${tipoNomes[upload.tipo] || 'Documento'}\n📁 ${upload.file.name}\n\nSeu documento foi enviado com sucesso e está em análise. Você receberá uma confirmação em breve.\n\n🔒 Seus dados estão protegidos pela LGPD.`,
      document: {
        nome: upload.file.name,
        tipo: upload.tipo,
        url: documento.url
      },
      timestamp: new Date(),
      quickReplies: [
        { text: "Enviar outro documento", emoji: "📎" },
        { text: "Ver meus documentos", emoji: "📋" },
        { text: "Voltar ao início", emoji: "🏠" }
      ]
    };
  },

  getDefaultResponse(userMessage: string): Message {
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: `Recebi sua mensagem: "${userMessage}"\n\n💡 Posso ajudar com:\n• Check-ins periódicos\n• Resolução de problemas\n• Upload de documentos\n• Agendamento de visitas\n\nSelecione uma opção abaixo:`,
      timestamp: new Date(),
      quickReplies: [
        { text: "Fazer check-in", emoji: "📋" },
        { text: "Reportar problema", emoji: "⚠️" },
        { text: "Enviar documento", emoji: "📄" },
        { text: "Agendar visita", emoji: "📅" }
      ]
    };
  },

  // Função para recuperar documentos
  getDocumentos(adotanteId: string): Documento[] {
    return documentosDB.filter(d => d.adotanteId === adotanteId);
  },

  // Função para limpar documentos (admin)
  clearDocumentos(): void {
    documentosDB = [];
  },

  // 📱 INTEGRAÇÃO COM WHATSAPP CLOUD API

  // Enviar mensagem via WhatsApp
  async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      return await whatsappService.sendTextMessage(phoneNumber, message);
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return false;
    }
  },

  // Enviar mensagem com botões via WhatsApp
  async sendWhatsAppButtons(
    phoneNumber: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<boolean> {
    try {
      return await whatsappService.sendInteractiveButtons(phoneNumber, bodyText, buttons);
    } catch (error) {
      console.error('Erro ao enviar botões WhatsApp:', error);
      return false;
    }
  },

  // Processar mensagem recebida do WhatsApp
  async processWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
    // Define o contexto do número
    if (!context.phoneNumber) {
      context.phoneNumber = phoneNumber;
    }

    // Processa a mensagem normalmente
    const history: Message[] = []; // Aqui você poderia buscar do banco
    const response = await this.processMessage(message, history);

    // Envia resposta via WhatsApp
    if (response.quickReplies && response.quickReplies.length > 0) {
      // Se tem quick replies, envia com botões (máximo 3)
      const buttons = response.quickReplies.slice(0, 3).map((qr, idx) => ({
        id: `btn_${idx}`,
        title: qr.text.substring(0, 20) // Limite do WhatsApp
      }));
      
      await this.sendWhatsAppButtons(phoneNumber, response.content, buttons);
    } else {
      // Envia mensagem simples
      await this.sendWhatsAppMessage(phoneNumber, response.content);
    }
  },

  // Agendar check-in automático via WhatsApp
  async scheduleCheckIn(phoneNumber: string, animalName: string, days: number): Promise<void> {
    console.log(`📅 Check-in agendado para ${phoneNumber} em ${days} dias`);
    
    // Em produção, você usaria um sistema de agendamento (cron jobs)
    // Por ora, apenas simula o agendamento
    setTimeout(async () => {
      const message = `Olá! 👋\n\nComo está o(a) ${animalName}? Tudo bem por aí?\n\nVamos fazer um check-in rápido! Responda esta mensagem ou acesse o chatbot.`;
      await this.sendWhatsAppMessage(phoneNumber, message);
    }, days * 24 * 60 * 60 * 1000); // Converte dias em ms
  },

  // Enviar lembrete de documentação via WhatsApp
  async sendDocumentReminder(phoneNumber: string, documentType: string): Promise<void> {
    const message = `📄 **Lembrete de Documentação**\n\nOlá! Notamos que você ainda não enviou:\n• ${documentType}\n\nPor favor, tire uma foto do documento e envie aqui mesmo no WhatsApp!\n\nObrigado! 🐕`;
    await this.sendWhatsAppMessage(phoneNumber, message);
  },

  // Notificar problema crítico ao time
  async notifyTeam(problemType: string, phoneNumber: string, details: string): Promise<void> {
    const teamNumber = '5531994979803'; // Número do WhatsApp da equipe Caramelo
    const message = `🚨 **ALERTA - Problema Reportado**\n\n**Tipo:** ${problemType}\n**Adotante:** ${phoneNumber}\n**Detalhes:** ${details}\n\nAção necessária!`;
    
    await this.sendWhatsAppMessage(teamNumber, message);
  }
};

