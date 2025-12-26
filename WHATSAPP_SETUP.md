# 🔧 Configuração do WhatsApp Cloud API

## Passo 1: Criar App no Meta for Developers

1. Acesse: https://developers.facebook.com/
2. Clique em **"My Apps"** → **"Create App"**
3. Selecione **"Business"** como tipo de app
4. Preencha os dados do app:
   - **App Name:** Caramelo Bot
   - **Contact Email:** seu@email.com
5. Clique em **"Create App"**

## Passo 2: Adicionar WhatsApp ao App

1. No painel do app, procure **"WhatsApp"**
2. Clique em **"Set Up"**
3. Selecione ou crie uma **Business Account**

## Passo 3: Obter Credenciais

### Phone Number ID
1. Na seção **"WhatsApp" → "API Setup"**
2. Copie o **"Phone Number ID"**
3. Exemplo: `123456789012345`

### Access Token (Temporário)
1. Na mesma página, copie o **"Temporary Access Token"**
2. **⚠️ IMPORTANTE:** Este token expira em 24h
3. Para produção, você precisa gerar um **Permanent Token**

### Access Token (Permanente) - Para Produção
1. Vá em **"Settings" → "Business Settings"**
2. Clique em **"System Users"**
3. Crie um System User
4. Gere um token com permissões:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`

### Business Account ID
1. Vá em **"WhatsApp" → "Getting Started"**
2. Copie o **"WhatsApp Business Account ID"**

## Passo 4: Configurar Webhook

### URL do Webhook
```
https://seu-dominio.com/api/whatsapp/webhook
```

### Verify Token
Crie um token personalizado (ex: `caramelo_webhook_token_2025`)

### Configuração no Meta Developer Portal
1. Vá em **"WhatsApp" → "Configuration"**
2. Clique em **"Edit"** na seção Webhook
3. Cole a **Callback URL**: `https://seu-dominio.com/api/whatsapp/webhook`
4. Cole o **Verify Token**: `caramelo_webhook_token_2025`
5. Clique em **"Verify and Save"**

### Webhook Fields (Campos para Inscrever)
Marque os seguintes campos:
- ✅ `messages` - Para receber mensagens
- ✅ `message_status` - Para status de entrega

## Passo 5: Configurar Variáveis de Ambiente

### Backend (.env)
Crie um arquivo `.env` na pasta `backend/`:

```env
# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
WHATSAPP_VERIFY_TOKEN=caramelo_webhook_token_2025
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765

# API
PORT=3001
```

### Frontend (src/services/whatsapp.ts)
Configure o serviço no arquivo principal:

```typescript
import { whatsappService } from './services/whatsapp';

whatsappService.configure({
  phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID,
  accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN,
  webhookVerifyToken: import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN,
  businessAccountId: import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID
});
```

## Passo 6: Testar Webhook Localmente

### Usando ngrok
```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3001
```

Copie a URL gerada (ex: `https://abc123.ngrok.io`) e use como Callback URL:
```
https://abc123.ngrok.io/api/whatsapp/webhook
```

## Passo 7: Adicionar Números de Teste

1. Vá em **"WhatsApp" → "API Setup"**
2. Na seção **"To"**, clique em **"Manage phone number list"**
3. Adicione números de WhatsApp para teste (incluindo código do país)
   - Exemplo: `+5511999999999`

## Passo 8: Enviar Primeira Mensagem (Teste)

### Via API
```bash
curl -X POST https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "text",
    "text": {
      "body": "Olá! Sou o Caramelo Bot 🐕"
    }
  }'
```

### Via Frontend (Chatbot)
1. Acesse o chatbot de pós-adoção
2. Digite uma mensagem
3. O sistema enviará automaticamente via WhatsApp

## Passo 9: Templates de Mensagem

Para enviar mensagens proativas (fora da janela de 24h), você precisa criar **Templates**:

1. Vá em **"WhatsApp" → "Message Templates"**
2. Clique em **"Create Template"**
3. Exemplo de template:

**Nome:** `acompanhamento_pos_adocao`
**Categoria:** `UTILITY`
**Idioma:** `Portuguese (BR)`
**Corpo:**
```
Olá {{1}}! 👋

Como está o(a) {{2}}? Tudo bem por aí?

Estamos aqui para acompanhar a adaptação. Responda esta mensagem e converse conosco! 🐕💛
```

4. Aguarde aprovação (24-48h)

## Passo 10: Produção

### Verificar App
1. Complete as **"App Review"** requirements
2. Adicione **"Privacy Policy URL"**
3. Adicione **"Terms of Service URL"**

### Migrar para Produção
1. Vá em **"WhatsApp" → "API Setup"**
2. Clique em **"Add Payment Method"** (necessário para produção)
3. Ative o número de produção

## Limites de API

### Modo de Teste
- 1.000 mensagens gratuitas/mês
- Apenas números pré-aprovados

### Modo de Produção
- **Tier 1:** 1.000 conversas únicas/dia
- **Tier 2:** 10.000 conversas únicas/dia
- **Tier 3:** 100.000 conversas únicas/dia

As conversas são cobradas por **sessão de 24h**.

## 📚 Documentação Oficial

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)

## 🆘 Troubleshooting

### Webhook não está recebendo mensagens
- Verifique se o webhook está acessível publicamente
- Confirme que subscreveu o campo `messages`
- Teste com `curl` direto no endpoint

### Token expirou
- Use System User Token (permanente)
- Não use Temporary Token em produção

### Erro 400: Parameter value is not valid
- Verifique formato do número: `5511999999999` (sem + ou espaços)
- Número deve estar na lista de teste (modo sandbox)

### Mensagens não são entregues
- Verifique se passou da janela de 24h (use template)
- Confirme que o número aceitou termos do WhatsApp Business
