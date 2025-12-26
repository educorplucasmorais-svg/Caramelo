# 📱 Integração WhatsApp - Chatbot Caramelo

## ✅ O que foi implementado:

### 1. **Serviço WhatsApp Cloud API** (`src/services/whatsapp.ts`)
- ✅ Envio de mensagens de texto
- ✅ Envio de botões interativos (máximo 3)
- ✅ Envio de listas (menus)
- ✅ Envio de templates pré-aprovados
- ✅ Envio de imagens
- ✅ Envio de documentos (PDFs, fotos, etc.)
- ✅ Marcar mensagem como lida

### 2. **Backend - Webhook WhatsApp** (`backend/src/routes/whatsapp.ts`)
- ✅ Endpoint GET `/api/whatsapp/webhook` - Verificação do webhook
- ✅ Endpoint POST `/api/whatsapp/webhook` - Receber mensagens
- ✅ Processamento de mensagens de texto
- ✅ Processamento de imagens
- ✅ Processamento de documentos
- ✅ Processamento de áudio (para Whisper)
- ✅ Processamento de respostas interativas (botões/listas)
- ✅ Endpoint POST `/api/whatsapp/send-message` - Enviar mensagens do frontend
- ✅ Endpoint POST `/api/whatsapp/send-buttons` - Enviar botões do frontend

### 3. **Chatbot Pós-Adoção Integrado** (`src/services/posAdocao.ts`)
- ✅ `sendWhatsAppMessage()` - Enviar mensagem simples
- ✅ `sendWhatsAppButtons()` - Enviar mensagem com botões
- ✅ `processWhatsAppMessage()` - Processar mensagem recebida via webhook
- ✅ `scheduleCheckIn()` - Agendar check-ins automáticos
- ✅ `sendDocumentReminder()` - Enviar lembretes de documentação
- ✅ `notifyTeam()` - Alertar equipe sobre problemas críticos

### 4. **Documentação Completa** (`WHATSAPP_SETUP.md`)
- ✅ Passo a passo para criar app no Meta for Developers
- ✅ Como obter credenciais (Phone ID, Access Token, etc.)
- ✅ Configurar webhook
- ✅ Testar localmente com ngrok
- ✅ Criar templates de mensagem
- ✅ Migrar para produção
- ✅ Troubleshooting comum

## 🚀 Como usar:

### Configurar credenciais:

**Backend:** Criar arquivo `.env` em `backend/`:
```env
WHATSAPP_PHONE_NUMBER_ID=seu_phone_id
WHATSAPP_ACCESS_TOKEN=seu_token
WHATSAPP_VERIFY_TOKEN=caramelo_webhook_token_2025
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_business_id
```

**Frontend:** Configurar no arquivo principal (main.tsx):
```typescript
import { whatsappService } from './services/whatsapp';

whatsappService.configure({
  phoneNumberId: 'SEU_PHONE_NUMBER_ID',
  accessToken: 'SEU_ACCESS_TOKEN',
  webhookVerifyToken: 'caramelo_webhook_token_2025',
  businessAccountId: 'SEU_BUSINESS_ACCOUNT_ID'
});
```

### Testar localmente:

1. **Expor backend com ngrok:**
```bash
ngrok http 3001
```

2. **Configurar webhook no Meta:**
- URL: `https://abc123.ngrok.io/api/whatsapp/webhook`
- Verify Token: `caramelo_webhook_token_2025`

3. **Enviar mensagem de teste:**
- Adicione seu número nos "Test Numbers"
- Envie mensagem via WhatsApp para o número da API
- O webhook receberá e responderá automaticamente!

## 📋 Fluxo completo:

1. **Adotante envia mensagem via WhatsApp** → 
2. **WhatsApp Cloud API recebe** → 
3. **Webhook `/api/whatsapp/webhook` processa** → 
4. **Chatbot Pós-Adoção responde** → 
5. **API envia resposta via WhatsApp** → 
6. **Adotante recebe resposta**

## 🎯 Casos de uso implementados:

### Check-in automático:
```typescript
await posAdocaoService.scheduleCheckIn(
  '+5511999999999',  // Número do adotante
  'Rex',              // Nome do animal
  7                   // Check-in em 7 dias
);
```

### Lembrete de documento:
```typescript
await posAdocaoService.sendDocumentReminder(
  '+5511999999999',
  'Comprovante de vacinação'
);
```

### Alertar equipe:
```typescript
await posAdocaoService.notifyTeam(
  'Agressividade',
  '+5511999999999',
  'Animal apresentando comportamento agressivo'
);
```

## 🔗 Links úteis:

- [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) - Configuração detalhada
- [Meta for Developers](https://developers.facebook.com/)
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)

## ⚠️ Importante:

- **Access Token temporário expira em 24h** - Use System User Token para produção
- **Máximo 3 botões** por mensagem interativa
- **Templates precisam de aprovação** (24-48h)
- **Janela de 24h** para mensagens proativas (após isso, use templates)
- **Números de teste** devem ser pré-aprovados no modo sandbox

## 🎉 Pronto para usar!

Siga o guia [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) e em 10 minutos você terá o chatbot respondendo mensagens via WhatsApp! 🐕💬
