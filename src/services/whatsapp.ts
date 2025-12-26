// Serviço de Integração com WhatsApp Cloud API
// https://developers.facebook.com/docs/whatsapp/cloud-api

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
  businessAccountId: string;
}

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'image' | 'document' | 'template' | 'interactive';
  content: string | WhatsAppInteractive | WhatsAppTemplate;
}

export interface WhatsAppInteractive {
  type: 'button' | 'list';
  body: {
    text: string;
  };
  action: {
    buttons?: Array<{
      type: 'reply';
      reply: {
        id: string;
        title: string;
      };
    }>;
    button?: string;
    sections?: Array<{
      title: string;
      rows: Array<{
        id: string;
        title: string;
        description?: string;
      }>;
    }>;
  };
}

export interface WhatsAppTemplate {
  name: string;
  language: {
    code: string;
  };
  components: Array<{
    type: string;
    parameters: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

class WhatsAppService {
  private config: WhatsAppConfig | null = null;
  private apiUrl = 'https://graph.facebook.com/v18.0';

  // Configurar credenciais do WhatsApp Cloud API
  configure(config: WhatsAppConfig) {
    this.config = config;
  }

  // Enviar mensagem de texto
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    if (!this.config) {
      console.error('WhatsApp não configurado. Use configure() primeiro.');
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: {
              preview_url: false,
              body: message
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return false;
    }
  }

  // Enviar mensagem com botões interativos
  async sendInteractiveButtons(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<boolean> {
    if (!this.config) {
      console.error('WhatsApp não configurado.');
      return false;
    }

    // WhatsApp Cloud API permite no máximo 3 botões
    const limitedButtons = buttons.slice(0, 3);

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'interactive',
            interactive: {
              type: 'button',
              body: {
                text: bodyText
              },
              action: {
                buttons: limitedButtons.map(btn => ({
                  type: 'reply',
                  reply: {
                    id: btn.id,
                    title: btn.title.substring(0, 20) // Limite de 20 caracteres
                  }
                }))
              }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar botões WhatsApp:', error);
      return false;
    }
  }

  // Enviar mensagem com lista
  async sendInteractiveList(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>
  ): Promise<boolean> {
    if (!this.config) {
      console.error('WhatsApp não configurado.');
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'interactive',
            interactive: {
              type: 'list',
              body: {
                text: bodyText
              },
              action: {
                button: buttonText,
                sections: sections
              }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar lista WhatsApp:', error);
      return false;
    }
  }

  // Enviar template pré-aprovado
  async sendTemplate(
    to: string,
    templateName: string,
    languageCode: string = 'pt_BR',
    parameters?: Array<string>
  ): Promise<boolean> {
    if (!this.config) {
      console.error('WhatsApp não configurado.');
      return false;
    }

    const components = parameters ? [{
      type: 'body',
      parameters: parameters.map(param => ({
        type: 'text',
        text: param
      }))
    }] : [];

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
              name: templateName,
              language: {
                code: languageCode
              },
              components: components
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error);
      return false;
    }
  }

  // Enviar imagem
  async sendImage(to: string, imageUrl: string, caption?: string): Promise<boolean> {
    if (!this.config) {
      console.error('WhatsApp não configurado.');
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'image',
            image: {
              link: imageUrl,
              caption: caption
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar imagem WhatsApp:', error);
      return false;
    }
  }

  // Enviar documento
  async sendDocument(
    to: string,
    documentUrl: string,
    filename: string,
    caption?: string
  ): Promise<boolean> {
    if (!this.config) {
      console.error('WhatsApp não configurado.');
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'document',
            document: {
              link: documentUrl,
              filename: filename,
              caption: caption
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar documento WhatsApp:', error);
      return false;
    }
  }

  // Marcar mensagem como lida
  async markAsRead(messageId: string): Promise<boolean> {
    if (!this.config) {
      console.error('WhatsApp não configurado.');
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: messageId
          })
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao marcar como lida WhatsApp:', error);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();

// Para configurar (adicionar no backend ou em arquivo .env):
/*
whatsappService.configure({
  phoneNumberId: 'SEU_PHONE_NUMBER_ID',
  accessToken: 'SEU_ACCESS_TOKEN',
  webhookVerifyToken: 'SEU_VERIFY_TOKEN',
  businessAccountId: 'SEU_BUSINESS_ACCOUNT_ID'
});
*/
