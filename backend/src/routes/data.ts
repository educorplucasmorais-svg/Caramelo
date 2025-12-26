import { Router } from 'express';
import { readTable, appendRow, updateRow, createSpreadsheet, ensureSheetExists, writeHeaderRow } from '../utils/googleSheets.js';

const dataRouter = Router();

// Current driver status
const DRIVER = process.env.DATA_DRIVER || 'google-sheets'; // future: mysql

// Default sheet and tables
let SHEET_ID = process.env.GOOGLE_SHEET_ID || '';
const TABLES = (process.env.DATA_TABLES || 'Animais,Adotantes,Documentos,Visitas')
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean);

if (!SHEET_ID && DRIVER === 'google-sheets') {
  console.warn('GOOGLE_SHEET_ID is not set. Data routes will return 500 for Sheets operations.');
}

dataRouter.get('/status', (_req, res) => {
  res.json({ driver: DRIVER, tables: TABLES, sheetId: SHEET_ID || null });
});

// List tables
dataRouter.get('/tables', (_req, res) => {
  res.json({ tables: TABLES });
});

// Initialize spreadsheet with default tables + headers
dataRouter.post('/init', async (_req, res) => {
  if (DRIVER !== 'google-sheets') return res.status(400).json({ error: 'Only supported for google-sheets driver' });
  try {
    const defaultHeaders: Record<string, string[]> = {
      Animais: ['id','nome','especie','raca','porte','idade','status','observacoes'],
      Adotantes: ['id','nome','telefone','email','endereco','cidade','estado','dataCadastro'],
      Documentos: ['id','adotanteId','animalId','tipo','nome','url','status','dataUpload'],
      Visitas: ['id','adotanteId','animalId','data','status','observacoes']
    };

    let created = false;
    // Create spreadsheet if not set
    if (!SHEET_ID) {
      SHEET_ID = await createSpreadsheet('Caramelo Data', TABLES);
      created = true;
    }

    // Ensure each sheet exists and write header
    for (const table of TABLES) {
      await ensureSheetExists(SHEET_ID, table);
      const header = defaultHeaders[table] || ['col1','col2','col3'];
      await writeHeaderRow(SHEET_ID, table, header);
    }

    res.json({ ok: true, created, sheetId: SHEET_ID, tables: TABLES });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to initialize spreadsheet' });
  }
});

// Read table rows
dataRouter.get('/sheets/:table', async (req, res) => {
  const { table } = req.params;
  if (DRIVER !== 'google-sheets') return res.status(400).json({ error: 'Driver not supported in this endpoint' });
  if (!SHEET_ID) return res.status(500).json({ error: 'Missing GOOGLE_SHEET_ID' });
  try {
    const { header, items } = await readTable(SHEET_ID, table);
    res.json({ header, items });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to read table' });
  }
});

// Append a row
dataRouter.post('/sheets/:table', async (req, res) => {
  const { table } = req.params;
  const row = req.body || {};
  if (!SHEET_ID) return res.status(500).json({ error: 'Missing GOOGLE_SHEET_ID' });
  try {
    const { header } = await readTable(SHEET_ID, table);
    await appendRow(SHEET_ID, table, header, row);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to append row' });
  }
});

// Update a row by index (1-based, including header row)
// You likely want to pass rowIndex starting from 2 to target first data row
dataRouter.put('/sheets/:table/:rowIndex', async (req, res) => {
  const { table, rowIndex } = req.params;
  const idx = parseInt(rowIndex, 10);
  const row = req.body || {};
  if (!SHEET_ID) return res.status(500).json({ error: 'Missing GOOGLE_SHEET_ID' });
  try {
    const { header } = await readTable(SHEET_ID, table);
    await updateRow(SHEET_ID, table, header, idx, row);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to update row' });
  }
});

export default dataRouter;
