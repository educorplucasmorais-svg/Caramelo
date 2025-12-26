# 🚀 Guia de Deployment - Railway + Vercel

## 📋 Visão Geral

```
┌──────────────────────┐
│   Vercel Frontend    │
│ caramelo.vercel.app  │
└──────────┬───────────┘
           │
           │ API Calls
           ↓
┌──────────────────────┐
│  Railway Backend     │
│ api.caramelo.app     │
└──────────────────────┘
```

---

## 🛤️ PARTE 1: RAILWAY - Backend

### Passo 1: Preparar Repositório

1. Certifique-se de que o código está no GitHub
   ```powershell
   cd c:\Users\Pichau\Desktop\Caramelo
   git add -A
   git commit -m "Preparar para deployment"
   git push origin main
   ```

### Passo 2: Conectar Railway ao GitHub

1. Acesse: https://railway.app/
2. Sign up / Login com GitHub
3. Clique em **+ New Project**
4. Selecione **Deploy from GitHub repo**
5. Selecione seu repositório `Caramelo`
6. Railway detectará automaticamente a estrutura

### Passo 3: Configurar Variáveis de Ambiente no Railway

1. No dashboard do projeto Railway, vá em **Variables**
2. Adicione todas as variáveis:

```env
# WhatsApp Configuration
WHATSAPP_PHONE_NUMBER_ID=seu_id
WHATSAPP_ACCESS_TOKEN=seu_token
WHATSAPP_VERIFY_TOKEN=caramelo_webhook_token_2025
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_id
WHATSAPP_NUMBER=5531994979803
WHATSAPP_TEAM_NUMBER=5531994979803

# Database Configuration
DATA_DRIVER=google-sheets

# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu_email@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=seu_sheet_id
DATA_TABLES=Animais,Adotantes,Documentos,Visitas

# MySQL Configuration (futuro)
# MYSQL_HOST=
# MYSQL_PORT=
# MYSQL_USER=
# MYSQL_PASSWORD=
# MYSQL_DATABASE=
```

### Passo 4: Configurar Build Settings (Railway)

1. Vá em **Settings** > **Build**
2. **Nixpacks Metadata:**
   ```json
   {
     "providers": ["nodejs-pnpm"]
   }
   ```
3. **Build Command:** `cd backend && npm run build`
4. **Start Command:** `cd backend && npm start`

### Passo 5: Deploy

1. Railway fará deploy automaticamente após commit no main
2. Você receberá uma URL: `https://seu-projeto-backend.railway.app`

### Passo 6: Obter URL do Railway

1. No dashboard, clique em **Deployments**
2. Procure o domínio atribuído (exemplo: `caramelo-backend-production.up.railway.app`)
3. Teste: `https://seu-dominio.railway.app/health`

---

## 🎨 PARTE 2: VERCEL - Frontend

### Passo 1: Conectar Vercel ao GitHub

1. Acesse: https://vercel.com/
2. Sign up / Login com GitHub
3. Clique em **Add New...** > **Project**
4. Selecione seu repositório `Caramelo`
5. Vercel importará automaticamente

### Passo 2: Configurar Build Settings (Vercel)

1. **Framework Preset:** Vite
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Root Directory:** `.` (ou deixe em branco)

### Passo 3: Variáveis de Ambiente (Vercel)

1. Vá em **Settings** > **Environment Variables**
2. Adicione:

```env
VITE_API_URL=https://seu-backend.railway.app
```

⚠️ **IMPORTANTE:** Use a URL completa do Railway backend!

### Passo 4: Deploy

1. Clique em **Deploy**
2. Vercel fará build e deploy automaticamente
3. Você receberá uma URL: `https://seu-projeto.vercel.app`

---

## 🔌 PARTE 3: Integração Frontend + Backend

### Atualizar Frontend para Usar URL do Railway

Edite [src/services/dataStore.ts](src/services/dataStore.ts):

```typescript
const API = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/data`
  : '/api/data';
```

Edite [src/config.ts](src/config.ts):

```typescript
export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const WHATSAPP_WA_ME_URL = 'https://wa.me/5531994979803?text=Olá%20Caramelo!';
```

### Configurar CORS no Backend

O backend já tem CORS habilitado em [src/index.ts](backend/src/index.ts), mas verifique:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',           // Dev local
    'https://seu-projeto.vercel.app'   // Production Vercel
  ],
  credentials: true
}));
```

---

## ✅ Checklist de Deployment

### Railway Backend:
- [ ] Repositório commitado e pusheado
- [ ] Projeto criado no Railway
- [ ] Variáveis de ambiente configuradas (Google Sheets, WhatsApp)
- [ ] Build settings corretos
- [ ] Deploy bem-sucedido
- [ ] URL do backend obtida
- [ ] Health check funcionando: `https://backend-url/health`

### Vercel Frontend:
- [ ] Projeto criado no Vercel
- [ ] Build settings corretos (Vite)
- [ ] `VITE_API_URL` configurada com URL do Railway
- [ ] Deploy bem-sucedido
- [ ] Frontend acessível

### Integração:
- [ ] Frontend conectando ao backend remoto
- [ ] Banco de Dados funcionando
- [ ] WhatsApp links funcionando
- [ ] Chatbot sincronizando com Google Sheets

---

## 🔗 URLs Finais

```
Frontend (Vercel):  https://caramelo.vercel.app
Backend (Railway):  https://caramelo-backend.railway.app
API:                https://caramelo-backend.railway.app/api
```

---

## 📱 Testar Após Deployment

1. **Acesse o frontend:** https://seu-projeto.vercel.app
2. **Verifique banco de dados:** Vá em "Banco de Dados"
3. **Teste sincronização:** Clique em "☁️ Sincronizar Drive"
4. **Teste chatbot:** Use a IA normalmente

---

## 🐛 Troubleshooting

### "Cannot GET /api/data"
- Verifique se `VITE_API_URL` está correto no Vercel
- Confirme que o backend está rodando no Railway

### "CORS error"
- Adicione a URL do Vercel na lista de origem do CORS
- Redeploy o backend

### "Google Sheets credentials missing"
- Verifique se as variáveis estão no Railway
- Confirme `GOOGLE_PRIVATE_KEY` tem os `\n`

### Build falha no Railway
- Verifique o log: Railway Dashboard > Deployments > View Logs
- Certifique-se que `npm run build` funciona localmente

---

## 🚨 Próximos Passos

1. **Domínio customizado:**
   - Railway: Configure domínio em Network settings
   - Vercel: Configure domínio em Project Settings

2. **Certificado SSL:**
   - Railway e Vercel fornecem SSL gratuitamente
   - Seus domínios já terão HTTPS

3. **MySQL Migration:**
   - Quando pronto, configure banco de dados
   - Atualize `DATA_DRIVER=mysql`
   - Configure variáveis MySQL

4. **CI/CD Avançado:**
   - Testes automáticos no GitHub
   - Deploy automático ao fazer push

---

**Qualquer dúvida, é só chamar!** 🐕
