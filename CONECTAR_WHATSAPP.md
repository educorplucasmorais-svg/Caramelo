# 📱 Configuração do Número WhatsApp - Caramelo

## Número Configurado
**+55 31 99497-9803**

---

## 🚀 Como Conectar o WhatsApp

### Passo 1: Acessar Meta for Developers
1. Acesse: https://developers.facebook.com/
2. Faça login com sua conta Facebook/Meta
3. Clique em **"My Apps"** → **"Create App"**

### Passo 2: Criar App Business
1. Selecione tipo **"Business"**
2. Nome do app: **Caramelo Bot**
3. Email de contato: seu@email.com
4. Clique em **"Create App"**

### Passo 3: Adicionar WhatsApp
1. No painel do app, procure **"WhatsApp"**
2. Clique em **"Set Up"**
3. Selecione ou crie uma **Business Account**

### Passo 4: Adicionar Número +55 31 99497-9803
1. Na seção **"Phone Numbers"**, clique em **"Add Phone Number"**
2. Escolha **"Register new phone number"**
3. Digite: **+55 31 99497-9803**
4. Escolha método de verificação:
   - SMS (receberá código por mensagem)
   - Voice Call (receberá código por ligação)
5. Digite o código recebido
6. ✅ Número verificado!

### Passo 5: Obter Credenciais
Após adicionar o número, você verá na tela:

#### Phone Number ID
```
Exemplo: 123456789012345
```
Copie e cole no arquivo `.env`:
```env
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

#### Access Token (Temporário - 24h)
```
Exemplo: EAABsbCS1...
```
⚠️ Para teste inicial, use o temporário. Para produção, gere um permanente.

Copie e cole no `.env`:
```env
WHATSAPP_ACCESS_TOKEN=EAABsbCS1...
```

#### Business Account ID
```
Exemplo: 987654321098765
```
Copie e cole no `.env`:
```env
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
```

### Passo 6: Configurar Webhook

#### 6.1 Expor Backend com ngrok
```bash
# Terminal 1: Iniciar backend
cd backend
npm run dev

# Terminal 2: Expor com ngrok
ngrok http 3001
```

Você verá algo como:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3001
```

Copie a URL: `https://abc123.ngrok.io`

#### 6.2 Configurar no Meta
1. No painel WhatsApp, vá em **"Configuration"**
2. Na seção **"Webhook"**, clique em **"Edit"**
3. Cole a **Callback URL**: 
   ```
   https://abc123.ngrok.io/api/whatsapp/webhook
   ```
4. Cole o **Verify Token**: 
   ```
   caramelo_webhook_token_2025
   ```
5. Clique em **"Verify and Save"**
6. ✅ Se aparecer "Verified", está correto!

#### 6.3 Inscrever em Eventos
Ainda na página de Configuration:
1. Clique em **"Manage"** em Webhook Fields
2. Marque:
   - ✅ **messages** (para receber mensagens)
   - ✅ **message_status** (para status de entrega)
3. Clique em **"Save"**

### Passo 7: Adicionar Números de Teste

⚠️ No modo sandbox, você só pode enviar mensagens para números pré-aprovados!

1. Na seção **"API Setup"**, procure **"To"**
2. Clique em **"Manage phone number list"**
3. Adicione números de teste (com código do país):
   ```
   +5531999999999 (seu celular para teste)
   ```
4. ✅ Números adicionados!

### Passo 8: Testar Primeira Mensagem

#### Via cURL (teste API)
```bash
curl -X POST https://graph.facebook.com/v18.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5531999999999",
    "type": "text",
    "text": {
      "body": "Olá! Sou o Caramelo Bot 🐕"
    }
  }'
```

#### Via WhatsApp (teste bot)
1. Pegue um celular com WhatsApp
2. Certifique-se que o número está na lista de teste
3. Envie mensagem para: **+55 31 99497-9803**
4. Digite: **"Oi"**
5. ✅ O bot deve responder automaticamente!

---

## 📝 Arquivo .env Completo

Seu arquivo `backend/.env` deve estar assim:

```env
# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAABsbCS1iBABOxxx...
WHATSAPP_VERIFY_TOKEN=caramelo_webhook_token_2025
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765

# Número da ONG
WHATSAPP_NUMBER=5531994979803
WHATSAPP_TEAM_NUMBER=5531994979803

# Servidor
PORT=3001
```

---

## ✅ Checklist de Ativação

- [ ] Criar conta Meta for Developers
- [ ] Criar app Business
- [ ] Adicionar produto WhatsApp
- [ ] Verificar número +55 31 99497-9803
- [ ] Copiar Phone Number ID
- [ ] Copiar Access Token
- [ ] Copiar Business Account ID
- [ ] Criar arquivo .env com as credenciais
- [ ] Iniciar backend (npm run dev)
- [ ] Expor com ngrok
- [ ] Configurar webhook no Meta
- [ ] Inscrever em eventos (messages)
- [ ] Adicionar números de teste
- [ ] Enviar mensagem de teste
- [ ] ✨ Validar resposta automática do bot!

---

## 🔄 Comandos Úteis

### Iniciar Backend
```bash
cd backend
npm run dev
```

### Expor Backend (ngrok)
```bash
ngrok http 3001
```

### Ver Logs do Webhook
```bash
# Os logs aparecem no terminal do backend
# Você verá todas as mensagens recebidas
```

### Testar Localmente
```bash
# Enviar mensagem de teste via API
curl -X POST http://localhost:3001/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5531999999999",
    "message": "Teste local"
  }'
```

---

## 🚨 Troubleshooting

### Webhook não verifica
- ✅ Certifique-se que o backend está rodando
- ✅ Certifique-se que o ngrok está ativo
- ✅ Verifique se o verify token está correto
- ✅ Teste a URL manualmente: `https://sua-url.ngrok.io/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=caramelo_webhook_token_2025&hub.challenge=test`

### Não recebo mensagens
- ✅ Verifique se inscreveu no evento "messages"
- ✅ Verifique se o número está na lista de teste
- ✅ Veja os logs do backend para erros

### Access Token expirou
- ✅ Token temporário dura 24h
- ✅ Gere um System User Token (permanente)
- ✅ Vá em Business Settings → System Users → Create

---

## 📞 Contato

**Número WhatsApp:** +55 31 99497-9803  
**Para atendimento:** Envie mensagem no WhatsApp  
**Para suporte técnico:** dev@caramelo.org.br  

---

## 🎉 Após Configuração

Qualquer pessoa que enviar mensagem para **+55 31 99497-9803** terá acesso a:

✅ Chatbot 24/7  
✅ Triagem de adoção  
✅ Sistema de denúncias  
✅ Informações de voluntariado  
✅ Canais de doação  
✅ Acompanhamento pós-adoção  

**Tudo automatizado!** 🚀🐕
