# 🤖 Bot de Automação WhatsApp - Caramelo

## 📋 Visão Geral

Sistema completo de automação para atendimento via WhatsApp, onde qualquer pessoa que enviar mensagem para o número da ONG tem acesso imediato à engenharia de chatbot com IA.

---

## 🎯 Funcionalidades do Bot

### 1. **Atendimento 24/7 Automatizado**
- ✅ Responde instantaneamente qualquer mensagem
- ✅ Disponível 24 horas por dia, 7 dias por semana
- ✅ Sem necessidade de intervenção humana

### 2. **Engenharia de Chatbot Integrada**
Quando alguém envia mensagem, o bot oferece:

#### 🐾 **Triagem de Adoção**
- Perguntas sobre tipo de animal (cachorro/gato)
- Avaliação de moradia e ambiente
- Verificação de condições financeiras
- Checklist completo em 8 perguntas
- Resultado: Aprovação automática ou necessidade de visita

#### 🚨 **Denúncias de Maus-Tratos**
- Coleta de localização
- Solicitação de fotos/vídeos
- Descrição da situação
- Registro automático com protocolo
- Notificação para equipe

#### 🤝 **Voluntariado**
- Opções de áreas (lar temporário, transporte, divulgação)
- Cadastro de disponibilidade
- Agendamento de orientação

#### 💛 **Doações**
- Informações de PIX
- Lista de itens necessários
- Apadrinhamento de animais

#### 🏠 **Pós-Adoção**
- Check-ins automáticos (7, 30, 90 dias)
- Suporte comportamental
- Solicitação de documentos
- Dicas de adaptação

#### 📸 **Análise de Imagens com IA**
- BCS (Body Condition Score) do animal
- Avaliação de ambiente (segurança, telas)
- Identificação de riscos

#### 🎤 **Transcrição de Áudio**
- Converte mensagens de voz em texto (Whisper)
- Processa resposta automaticamente

---

## 🔧 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────┐
│           WhatsApp Cloud API (Meta)                 │
│         (Número: +55 XX XXXX-XXXX)                  │
└──────────────────┬──────────────────────────────────┘
                   │ Webhook
                   ▼
┌─────────────────────────────────────────────────────┐
│    Backend Caramelo (Node.js + Express)             │
│    Endpoint: /api/whatsapp/webhook                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         Roteador de Mensagens                       │
│   - Identifica tipo de mensagem                     │
│   - Extrai contexto do usuário                      │
│   - Define fluxo de conversa                        │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   Chatbot    │      │ Chatbot Pós- │
│   Principal  │      │   Adoção     │
│              │      │              │
│ - Triagem    │      │ - Check-ins  │
│ - Denúncias  │      │ - Suporte    │
│ - Voluntário │      │ - Docs       │
│ - Doações    │      │ - Alertas    │
└──────┬───────┘      └──────┬───────┘
       │                     │
       └──────────┬──────────┘
                  ▼
        ┌─────────────────┐
        │  Serviços IA    │
        │                 │
        │ - GPT-4o        │
        │ - Whisper       │
        │ - Vision        │
        └─────────────────┘
```

---

## 🚀 Como Funciona

### 1. Usuário Envia Mensagem
```
Usuário: "Oi, quero adotar"
   ↓ (Enviado via WhatsApp)
```

### 2. WhatsApp Cloud API Recebe
```
WhatsApp Cloud API → POST /api/whatsapp/webhook
{
  "from": "5511999999999",
  "text": "Oi, quero adotar",
  "type": "text",
  "timestamp": "2025-12-26T20:30:00Z"
}
```

### 3. Backend Processa
```javascript
// backend/src/routes/whatsapp.ts
router.post('/webhook', async (req, res) => {
  const message = req.body.entry[0].changes[0].value.messages[0];
  const from = message.from;
  const text = message.text.body;
  
  // Identifica intenção (NLP básico ou GPT-4o)
  if (text.includes('adotar') || text.includes('adoção')) {
    // Inicia fluxo de triagem
    await chatbotService.startAdoptionFlow(from);
  }
  // ... outros fluxos
});
```

### 4. Chatbot Responde
```javascript
// src/services/chatbot.ts
async startAdoptionFlow(phoneNumber) {
  const message = "Que maravilha! 🐕\n\nVou fazer uma triagem rápida.\n\nQue tipo de animal você procura?";
  const buttons = [
    { id: "btn_dog", title: "Cachorro 🐕" },
    { id: "btn_cat", title: "Gato 🐱" },
    { id: "btn_other", title: "Outro 🐾" }
  ];
  
  await whatsappService.sendInteractiveButtons(phoneNumber, message, buttons);
}
```

### 5. Usuário Recebe Resposta
```
Bot Caramelo: "Que maravilha! 🐕
Vou fazer uma triagem rápida.
Que tipo de animal você procura?"

[Cachorro 🐕] [Gato 🐱] [Outro 🐾]
```

---

## 📝 Fluxos Implementados

### Fluxo 1: Triagem de Adoção
```
Início → Tipo de animal → Porte → Moradia → Telas de proteção →
Outros animais → Acordo familiar → Condição financeira → Termos →
✅ Resultado (Aprovado/Visita necessária)
```

### Fluxo 2: Denúncia
```
Início → Tipo de problema → Localização → Foto/Descrição →
📋 Protocolo gerado → 🚨 Equipe notificada
```

### Fluxo 3: Voluntariado
```
Início → Área de interesse → Disponibilidade → Contato →
📅 Agendamento de orientação
```

### Fluxo 4: Pós-Adoção
```
Check-in automático (7 dias) → Adaptação → Alimentação →
Socialização → Comportamento → Veterinário →
💡 Dicas personalizadas / ⚠️ Alerta para equipe
```

---

## 🔑 Configuração Rápida

### Passo 1: Obter Número WhatsApp Business
1. Acesse: https://business.facebook.com/
2. Crie conta Business (ou use existente)
3. Adicione número de telefone
4. Verifique o número

### Passo 2: Configurar WhatsApp Cloud API
1. Acesse: https://developers.facebook.com/
2. Crie app "Business"
3. Adicione produto "WhatsApp"
4. Copie credenciais:
   - Phone Number ID
   - Access Token
   - Business Account ID

### Passo 3: Configurar Backend
```bash
# backend/.env
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=seu_token_aqui
WHATSAPP_VERIFY_TOKEN=caramelo_webhook_2025
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321
```

### Passo 4: Expor Webhook (ngrok)
```bash
# Terminal 1: Iniciar backend
cd backend
npm run dev

# Terminal 2: Expor com ngrok
ngrok http 3001
```

Copie URL do ngrok: `https://abc123.ngrok.io`

### Passo 5: Configurar Webhook no Meta
1. Vá em WhatsApp → Configuration
2. Cole webhook: `https://abc123.ngrok.io/api/whatsapp/webhook`
3. Cole verify token: `caramelo_webhook_2025`
4. Subscribe em: `messages` e `message_status`

### Passo 6: Testar!
1. Adicione seu número em "Test Numbers"
2. Envie mensagem para o número da API
3. ✨ O bot responde automaticamente!

---

## 💬 Exemplos de Conversas

### Exemplo 1: Adoção
```
Você: Oi
Bot: Olá! 🐕 Sou o Caramelo, assistente da ONG.
     Como posso ajudar?
     [Adotar] [Denunciar] [Voluntário] [Doar]

Você: [Clica em Adotar]
Bot: Que maravilha! Vamos iniciar a triagem.
     Que tipo de animal?
     [Cachorro] [Gato] [Outro]

Você: [Cachorro]
Bot: Qual porte você prefere?
     [Pequeno] [Médio] [Grande] [Sem preferência]

... (continua por 8 perguntas)

Bot: ✅ Triagem concluída!
     Você está aprovado para adoção!
     Nossa equipe entrará em contato em 48h.
     [Ver animais] [Enviar fotos da casa]
```

### Exemplo 2: Denúncia
```
Você: Preciso denunciar maus-tratos
Bot: Recebemos sua denúncia. 🚨
     Para registro, precisamos:
     1️⃣ Localização
     2️⃣ Descrição
     3️⃣ Foto/vídeo (se possível)
     
     Pode enviar a localização?
     [Enviar localização] [Descrever endereço]

Você: Rua ABC, 123 - Centro
Bot: Obrigado! Agora descreva a situação:

Você: Cachorro amarrado sem água há dias
Bot: Pode enviar uma foto?

Você: [Envia foto]
Bot: ✅ Denúncia registrada!
     Protocolo: #2025-001234
     
     Nosso time verificará em até 24h.
     Você receberá atualizações aqui.
```

### Exemplo 3: Pós-Adoção (Automático)
```
Bot: (Após 7 dias da adoção)
     Olá Maria! 👋
     
     Como está o Rex? Tudo bem por aí?
     
     Vamos fazer um check-in rápido?
     [Sim, vamos!] [Está tudo ótimo] [Preciso de ajuda]

Você: [Sim, vamos!]
Bot: Como está a adaptação?
     [Ótima! Adaptado] [Boa, com desafios] [Difícil]

... (5 perguntas)

Bot: 🎉 Que bom que está tudo bem!
     Continue assim:
     • Manter rotina veterinária
     • Enviar fotos mensalmente
     • Qualquer dúvida, estou aqui!
```

---

## 🛠️ Comandos Administrativos

### Enviar Mensagem em Massa
```javascript
// Para avisos importantes
const adotantes = ['5511999999999', '5511888888888'];
const mensagem = "🐕 Feira de adoção este sábado!";

adotantes.forEach(numero => {
  whatsappService.sendTextMessage(numero, mensagem);
});
```

### Agendar Check-ins
```javascript
// Agendar automaticamente após adoção
posAdocaoService.scheduleCheckIn(
  telefoneAdotante,
  nomeAnimal,
  7  // dias
);
```

### Monitorar Conversas
```javascript
// Ver logs no console do backend
// Todas as mensagens são registradas automaticamente
```

---

## 📊 Métricas e Análises

O sistema registra automaticamente:
- 📈 Número de conversas iniciadas
- 🐾 Taxa de conclusão de triagem
- 🚨 Número de denúncias
- 💛 Doações via bot
- 🏠 Check-ins pós-adoção realizados
- ⏱️ Tempo médio de resposta

---

## 🔐 Segurança e Privacidade

✅ **LGPD Compliant**
- Dados criptografados
- Consentimento explícito
- Direito ao esquecimento
- Transparência no uso de dados

✅ **WhatsApp End-to-End Encryption**
- Mensagens criptografadas
- Meta não lê o conteúdo

✅ **Webhook Seguro**
- Token de verificação
- HTTPS obrigatório
- Validação de origem

---

## 💰 Custos

### WhatsApp Cloud API (Meta)
- **Primeiras 1.000 conversas/mês:** GRÁTIS
- **Após 1.000:** ~R$ 0,30 por conversa
- **Conversa:** Janela de 24h com um usuário

### Infraestrutura
- **Backend:** Pode hospedar grátis (Heroku, Railway, Render)
- **ngrok (teste):** Grátis
- **Domínio (produção):** ~R$ 40/ano

---

## 🚀 Migrar para Produção

### 1. Hospedar Backend
```bash
# Opções gratuitas:
# - Railway (https://railway.app)
# - Render (https://render.com)
# - Heroku (https://heroku.com)
```

### 2. Obter Domínio
```
seu-dominio.com → aponta para backend
```

### 3. Configurar Webhook Permanente
```
https://seu-dominio.com/api/whatsapp/webhook
```

### 4. Gerar Access Token Permanente
- Usar System User no Meta Business Manager
- Token não expira (vs. 24h do temporário)

### 5. Aprovar Templates
- Criar templates no Meta
- Aguardar aprovação (24-48h)
- Usar para mensagens proativas

---

## 📞 Suporte

**Dúvidas sobre configuração?**
- 📖 Veja: [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md)
- 🔧 Veja: [WHATSAPP_INTEGRATION.md](WHATSAPP_INTEGRATION.md)

**Problemas técnicos?**
- Email: dev@caramelo.org.br
- GitHub Issues: [Reportar](https://github.com/educorplucasmorais-svg/Caramelo/issues)

---

## ✅ Checklist de Ativação

- [ ] Criar conta Meta for Developers
- [ ] Adicionar produto WhatsApp
- [ ] Obter Phone Number ID e Access Token
- [ ] Configurar .env no backend
- [ ] Expor webhook (ngrok para teste)
- [ ] Configurar webhook no Meta
- [ ] Adicionar números de teste
- [ ] Enviar primeira mensagem de teste
- [ ] Validar respostas automáticas
- [ ] Testar todos os fluxos
- [ ] Configurar check-ins automáticos
- [ ] Criar templates e aguardar aprovação
- [ ] Migrar para produção (domínio + hosting)
- [ ] Monitorar métricas

---

## 🎉 Resultado Final

Após configuração, qualquer pessoa que enviar mensagem para o número WhatsApp da ONG terá acesso imediato a:

✅ Chatbot inteligente 24/7  
✅ Triagem de adoção automatizada  
✅ Sistema de denúncias  
✅ Informações sobre voluntariado  
✅ Canais de doação  
✅ Acompanhamento pós-adoção  
✅ Análise de imagens com IA  
✅ Suporte comportamental  

**Tudo sem necessidade de atendimento humano inicial!** 🚀

---

**🐕 Desenvolvido pela Equipe Caramelo**  
**Com ❤️ para os animais**
