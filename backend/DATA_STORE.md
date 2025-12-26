# Data Store - Caramelo

This backend supports a pluggable data driver. For the initial phase, it reads/writes to Google Sheets (one tab per logical table). Later, it can switch to MySQL.

## Current Driver: Google Sheets

- Driver: `google-sheets`
- Tables come from spreadsheet tabs: e.g., `Animais`, `Adotantes`, `Documentos`, `Visitas`.
- First row is the header. Rows are mapped to objects using header columns.

### Environment
See `.env.example` and configure:

- `DATA_DRIVER=google-sheets`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` (keep line breaks by replacing `\n` with actual newlines or escaped newlines)
- `GOOGLE_SHEET_ID`
- `DATA_TABLES` (optional, comma separated)

### API

- `GET /api/data/status` → `{ driver, tables }`
- `GET /api/data/tables` → `{ tables }`
- `GET /api/data/sheets/:table` → `{ header, items }`
- `POST /api/data/sheets/:table` → body is an object, appended by header order
- `PUT /api/data/sheets/:table/:rowIndex` → updates target row (1-based); use 2 for first data row

## Future: MySQL

- Switch `DATA_DRIVER=mysql`
- Provide `MYSQL_*` env vars
- Implement `/api/data/mysql/...` endpoints accordingly.
