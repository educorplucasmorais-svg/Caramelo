# 🔐 Configuração Google Sheets API

## Passo 1: Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione existente
3. Nome sugerido: "Caramelo ONG"

## Passo 2: Ativar Google Sheets API

1. No menu lateral, vá em **APIs & Services** > **Library**
2. Busque por "Google Sheets API"
3. Clique em **ENABLE**

## Passo 3: Criar Service Account

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **Service Account**
3. Nome: `caramelo-sheets-service`
4. Description: "Service account para banco de dados Caramelo"
5. Clique em **CREATE AND CONTINUE**
6. Role: **Editor** (ou "Básico > Editor")
7. Clique em **CONTINUE** > **DONE**

## Passo 4: Criar Chave (Key) do Service Account

1. Na lista de Service Accounts, clique no email que você criou
2. Vá na aba **KEYS**
3. Clique em **ADD KEY** > **Create new key**
4. Selecione formato **JSON**
5. Clique em **CREATE**
6. Um arquivo JSON será baixado automaticamente (guarde-o com segurança!)

## Passo 5: Criar Google Spreadsheet

1. Acesse: https://sheets.google.com/
2. Crie uma nova planilha
3. Nomeie como: "Caramelo - Banco de Dados"
4. Copie o ID da planilha da URL:
   - URL: `https://docs.google.com/spreadsheets/d/1abc123xyz456/edit`
   - ID: `1abc123xyz456`

## Passo 6: Compartilhar Planilha com Service Account

⚠️ **IMPORTANTE:** Sem esse passo a API não funcionará!

1. Na planilha, clique em **Compartilhar** (botão verde no canto superior direito)
2. Cole o **email do service account** (exemplo: `caramelo-sheets-service@project-id.iam.gserviceaccount.com`)
   - Você encontra esse email no arquivo JSON baixado (campo `client_email`)
3. Selecione permissão: **Editor**
4. **DESMARQUE** a opção "Notificar pessoas"
5. Clique em **Compartilhar**

## Passo 7: Configurar Backend `.env`

Abra o arquivo JSON baixado e localize:
- `client_email` → copie para `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → copie para `GOOGLE_PRIVATE_KEY`

Edite `backend/.env`:

```env
# Banco de Dados / Data Driver
DATA_DRIVER=google-sheets

# Configuração Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=caramelo-sheets-service@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANB...sua-chave-completa...==\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1abc123xyz456
DATA_TABLES=Animais,Adotantes,Documentos,Visitas
```

⚠️ **Atenção com a PRIVATE_KEY:**
- Mantenha as aspas duplas
- Mantenha os `\n` (não remova!)
- Cole a chave exatamente como está no JSON

## Passo 8: Reiniciar Backend

```powershell
# No terminal, dentro da pasta backend:
npm run dev
```

## Passo 9: Inicializar Planilha no Frontend

1. Acesse o frontend: http://localhost:5173/banco-dados
2. Clique no botão **"Criar/Inicializar Planilha Padrão"**
3. As abas Animais, Adotantes, Documentos e Visitas serão criadas automaticamente!

## Verificar se Funcionou

1. Clique em **"☁️ Sincronizar Drive"**
2. Se aparecer "Última sync: [hora]", está funcionando! ✅
3. Abra sua planilha no Google Sheets e veja as abas criadas

## Troubleshooting

### Erro: "Google Sheets credentials missing"
- Verifique se as variáveis estão no `.env`
- Reinicie o backend após editar `.env`

### Erro: "The caller does not have permission"
- Certifique-se de compartilhar a planilha com o email do service account
- Dê permissão de **Editor**, não apenas visualizador

### Erro: "Unable to parse range"
- Execute a inicialização primeiro (botão laranja)
- Verifique se as abas existem na planilha

### Private Key com erro
- Cole a chave COM as aspas duplas: `"-----BEGIN..."`
- Não remova os `\n` - eles são necessários!
- A chave deve começar com `-----BEGIN PRIVATE KEY-----\n`

---

📄 **Exemplo do arquivo JSON baixado:**
```json
{
  "type": "service_account",
  "project_id": "caramelo-project",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n",
  "client_email": "caramelo-sheets-service@caramelo-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

Use `client_email` e `private_key` no seu `.env`!
