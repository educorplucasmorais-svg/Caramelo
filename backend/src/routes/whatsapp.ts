import { Router, Request, Response } from 'express';

const router = Router();

// Token de verificação para webhook (deve ser configurado no Meta Developer Portal)
const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'caramelo_webhook_token_2025';

// Webhook de verificação (GET) - WhatsApp Cloud API usa isso para verificar o webhook
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('📞 Verificação de webhook recebida:', { mode, token });

  // Verifica se o token corresponde
  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verificado com sucesso!');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Falha na verificação do webhook');
    res.sendStatus(403);
  }
});

// Webhook para receber mensagens (POST)
router.post('/webhook', async (req: Request, res: Response) => {
  console.log('📩 Webhook recebido:', JSON.stringify(req.body, null, 2));

  try {
    const body = req.body;

    // Verifica se é uma notificação do WhatsApp
    if (body.object === 'whatsapp_business_account') {
      // Itera sobre as entradas
      body.entry?.forEach((entry: any) => {
        entry.changes?.forEach((change: any) => {
          if (change.field === 'messages') {
            const value = change.value;

            // Processa mensagens recebidas
            if (value.messages) {
              value.messages.forEach((message: any) => {
                const from = message.from; // Número do remetente
                const messageId = message.id;
                const timestamp = message.timestamp;

                console.log(`\n📨 Mensagem de: ${from}`);
                console.log(`ID: ${messageId}`);
                console.log(`Timestamp: ${timestamp}`);

                // Processa diferentes tipos de mensagem
                if (message.type === 'text') {
                  const text = message.text.body;
                  console.log(`💬 Texto: ${text}`);
                  
                  // Aqui você pode processar a mensagem e responder
                  // Por exemplo, enviar para o chatbot de pós-adoção
                  processWhatsAppMessage(from, text, messageId);
                  
                } else if (message.type === 'image') {
                  console.log('📷 Imagem recebida:', message.image);
                  // Processar imagem (ex: análise de BCS)
                  
                } else if (message.type === 'document') {
                  console.log('📄 Documento recebido:', message.document);
                  // Processar documento
                  
                } else if (message.type === 'audio') {
                  console.log('🎤 Áudio recebido:', message.audio);
                  // Processar áudio (ex: Whisper para transcrição)
                  
                } else if (message.type === 'interactive') {
                  console.log('🔘 Resposta interativa:', message.interactive);
                  // Processar resposta de botão/lista
                  const buttonReply = message.interactive.button_reply;
                  if (buttonReply) {
                    processWhatsAppMessage(from, buttonReply.title, messageId);
                  }
                }
              });
            }

            // Processa status de mensagens (entregue, lida, etc.)
            if (value.statuses) {
              value.statuses.forEach((status: any) => {
                console.log(`📊 Status da mensagem ${status.id}: ${status.status}`);
              });
            }
          }
        });
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    res.sendStatus(500);
  }
});

// Função para processar mensagens recebidas
async function processWhatsAppMessage(from: string, text: string, messageId: string) {
  console.log(`\n🤖 Processando mensagem de ${from}: "${text}"`);
  
  // Aqui você integraria com o chatbot de pós-adoção
  // Exemplo:
  // const response = await posAdocaoService.processMessage(from, text);
  // await whatsappService.sendTextMessage(from, response);
  
  // Por enquanto, apenas loga
  console.log('✅ Mensagem processada. Pronta para resposta automática.');
}

// Endpoint para enviar mensagem (usado pelo frontend)
router.post('/send-message', async (req: Request, res: Response) => {
  try {
    const { to, message, type = 'text' } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Campos "to" e "message" são obrigatórios' });
    }

    console.log(`📤 Enviando mensagem para ${to}: ${message}`);

    // Aqui você chamaria o serviço WhatsApp real
    // const success = await whatsappService.sendTextMessage(to, message);
    
    // Por enquanto, simula sucesso
    const success = true;

    if (success) {
      res.json({ 
        success: true, 
        message: 'Mensagem enviada com sucesso',
        to,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ error: 'Falha ao enviar mensagem' });
    }
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para enviar mensagem com botões
router.post('/send-buttons', async (req: Request, res: Response) => {
  try {
    const { to, bodyText, buttons } = req.body;

    if (!to || !bodyText || !buttons) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    console.log(`📤 Enviando botões para ${to}`);

    // Aqui você chamaria o serviço WhatsApp real
    // const success = await whatsappService.sendInteractiveButtons(to, bodyText, buttons);
    
    const success = true;

    if (success) {
      res.json({ success: true, message: 'Botões enviados com sucesso' });
    } else {
      res.status(500).json({ error: 'Falha ao enviar botões' });
    }
  } catch (error) {
    console.error('❌ Erro ao enviar botões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
