export interface DataStatus { driver: string; tables: string[]; sheetId?: string | null }
export interface TableData { header: string[]; items: Record<string, string>[] }

// Usar URL do backend remoto ou local em desenvolvimento
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API = `${BACKEND_URL}/api/data`;

export const dataStore = {
  async getStatus(): Promise<DataStatus> {
    const res = await fetch(`${API}/status`);
    return res.json();
  },
  async getTables(): Promise<string[]> {
    const res = await fetch(`${API}/tables`);
    const json = await res.json();
    return json.tables || [];
  },
  async initSheets(): Promise<{ ok: boolean; created: boolean; sheetId: string; tables: string[] }> {
    const res = await fetch(`${API}/init`, { method: 'POST' });
    return res.json();
  },
  async getRows(table: string): Promise<TableData> {
    const res = await fetch(`${API}/sheets/${encodeURIComponent(table)}`);
    return res.json();
  },
  async addRow(table: string, row: Record<string, string>): Promise<boolean> {
    const res = await fetch(`${API}/sheets/${encodeURIComponent(table)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    const json = await res.json();
    return !!json.ok;
  },
  async updateRow(table: string, rowIndex: number, row: Record<string, string>): Promise<boolean> {
    const res = await fetch(`${API}/sheets/${encodeURIComponent(table)}/${rowIndex}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    const json = await res.json();
    return !!json.ok;
  }
};
