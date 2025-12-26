import { useEffect, useState } from 'react';
import { dataStore } from '../../services/dataStore';
import './BancoDados.css';

export function BancoDados() {
  const [status, setStatus] = useState<{ driver: string; tables: string[]; sheetId?: string | null } | null>(null);
  const [table, setTable] = useState<string>('');
  const [header, setHeader] = useState<string[]>([]);
  const [items, setItems] = useState<Record<string, string>[]>([]);
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const loadStatus = async () => {
    const s = await dataStore.getStatus();
    setStatus(s);
  };

  useEffect(() => {
    (async () => {
      await loadStatus();
      const tables = await dataStore.getTables();
      if (tables.length > 0) {
        setTable(tables[0]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!table) return;
    (async () => {
      setLoading(true);
      const data = await dataStore.getRows(table);
      setHeader(data.header);
      setItems(data.items);
      const empty: Record<string, string> = {};
      data.header.forEach(h => empty[h] = '');
      setNewRow(empty);
      setLoading(false);
    })();
  }, [table]);

  const refresh = async () => {
    if (!table) return;
    setLoading(true);
    const data = await dataStore.getRows(table);
    setHeader(data.header);
    setItems(data.items);
    setLoading(false);
  };

  const syncWithDrive = async () => {
    if (!table) return;
    setSyncing(true);
    try {
      // Recarrega do Google Drive
      const data = await dataStore.getRows(table);
      setHeader(data.header);
      setItems(data.items);
      setLastSync(new Date());
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      alert('Erro ao sincronizar com Google Drive');
    } finally {
      setSyncing(false);
    }
  };

  const addRow = async () => {
    if (!table) return;
    setLoading(true);
    const ok = await dataStore.addRow(table, newRow);
    if (ok) await refresh();
    setLoading(false);
  };

  const initSheets = async () => {
    setInitLoading(true);
    const res = await dataStore.initSheets();
    await loadStatus();
    setInitLoading(false);
    alert(res.created
      ? `Planilha criada! ID: ${res.sheetId}. Configure GOOGLE_SHEET_ID no backend/.env.`
      : 'Planilha inicializada com cabeçalhos.');
  };

  return (
    <div className="db-page">
      <div className="db-header">
        <h2>Banco de Dados</h2>
        <div className="driver">Driver atual: <strong>{status?.driver || '...'}</strong></div>
      </div>

      {status?.driver === 'google-sheets' && (
        <div className="db-controls">
          <button onClick={initSheets} disabled={initLoading}>
            {initLoading ? 'Inicializando...' : 'Criar/Inicializar Planilha Padrão'}
          </button>
        </div>
      )}

      <div className="db-controls">
        <label>
          Tabela:
          <select value={table} onChange={e => setTable(e.target.value)}>
            {(status?.tables || []).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <button onClick={refresh} disabled={loading}>Atualizar</button>
        <button onClick={syncWithDrive} disabled={syncing || !table} className="sync-btn">
          {syncing ? '🔄 Sincronizando...' : '☁️ Sincronizar Drive'}
        </button>
        {lastSync && (
          <span className="last-sync">
            Última sync: {lastSync.toLocaleTimeString('pt-BR')}
          </span>
        )}
      </div>

      <div className="db-content">
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <table className="db-table">
              <thead>
                <tr>
                  {header.map(h => (<th key={h}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr key={idx}>
                    {header.map(h => (<td key={h}>{row[h]}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="db-add">
              <h3>Adicionar Linha</h3>
              <div className="add-grid">
                {header.map(h => (
                  <label key={h}>
                    <span>{h}</span>
                    <input
                      value={newRow[h] || ''}
                      onChange={e => setNewRow({ ...newRow, [h]: e.target.value })}
                    />
                  </label>
                ))}
              </div>
              <button onClick={addRow} disabled={loading}>Adicionar</button>
            </div>
          </>
        )}
      </div>

      <div className="db-notice">
        <p>
          Nesta fase, os dados ficam sincronizados com Google Sheets. Em breve, vamos migrar para MySQL mantendo as mesmas tabelas.
        </p>
      </div>
    </div>
  );
}
