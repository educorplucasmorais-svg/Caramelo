import { google } from 'googleapis';

function getPrivateKey(): string {
  const key = process.env.GOOGLE_PRIVATE_KEY || '';
  // Support escaped newlines in env vars
  return key.replace(/\\n/g, '\n');
}

export function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();
  if (!clientEmail || !privateKey) {
    throw new Error('Google Sheets credentials missing: GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

export async function readTable(sheetId: string, sheetName: string) {
  const sheets = getSheetsClient();
  const range = `${sheetName}!A:Z`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range
  });
  const values = res.data.values || [];
  const [header, ...rows] = values;
  const items = rows.map((r: any[]) => {
    const obj: Record<string, string> = {};
    (header as string[]).forEach((h: string, idx: number) => { obj[h] = r[idx] || ''; });
    return obj;
  });
  return { header, items };
}

export async function appendRow(sheetId: string, sheetName: string, header: string[], rowObj: Record<string, string>) {
  const sheets = getSheetsClient();
  const range = `${sheetName}!A:Z`;
  const rowValues = header.map((h) => rowObj[h] ?? '');
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [rowValues] }
  });
}

export async function updateRow(sheetId: string, sheetName: string, header: string[], rowIndexOneBased: number, rowObj: Record<string, string>) {
  const sheets = getSheetsClient();
  const range = `${sheetName}!A${rowIndexOneBased}:Z${rowIndexOneBased}`;
  const rowValues = header.map((h) => rowObj[h] ?? '');
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [rowValues] }
  });
}

// Create a new spreadsheet with provided sheet names
export async function createSpreadsheet(title: string, sheetNames: string[]) {
  const sheets = getSheetsClient();
  const requestBody: any = {
    properties: { title },
    sheets: sheetNames.map((name) => ({ properties: { title: name } }))
  };
  const res = await sheets.spreadsheets.create({ requestBody });
  return res.data.spreadsheetId as string;
}

// Ensure a sheet (tab) exists; if not, add it
export async function ensureSheetExists(spreadsheetId: string, sheetName: string) {
  const sheets = getSheetsClient();
  const getRes = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = (getRes.data.sheets || []).some((s: any) => (s as any).properties?.title === sheetName);
  if (exists) return;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        { addSheet: { properties: { title: sheetName } } }
      ]
    }
  });
}

// Write a header row to a sheet
export async function writeHeaderRow(spreadsheetId: string, sheetName: string, header: string[]) {
  const sheets = getSheetsClient();
  const range = `${sheetName}!A1:${String.fromCharCode(65 + Math.max(header.length - 1, 0))}1`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [header] }
  });
}
