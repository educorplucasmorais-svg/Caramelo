import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router: Router = express.Router();

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/documentos');
    
    // Cria o diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG, PDF ou DOC/DOCX'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

// Interface para documentos
interface Documento {
  id: string;
  tipo: string;
  nome: string;
  nomeArquivo: string;
  caminho: string;
  url: string;
  tamanho: number;
  mimeType: string;
  dataUpload: string;
  adotanteId: string;
  animalId: string;
  adocaoId?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  observacoes?: string;
}

// Banco de dados simulado (em produção, usar MongoDB, PostgreSQL, etc.)
let documentosDB: Documento[] = [];

// GET - Listar todos os documentos
router.get('/', (req: Request, res: Response) => {
  const { adotanteId, animalId, status } = req.query;
  
  let filteredDocs = [...documentosDB];
  
  if (adotanteId) {
    filteredDocs = filteredDocs.filter(d => d.adotanteId === adotanteId);
  }
  
  if (animalId) {
    filteredDocs = filteredDocs.filter(d => d.animalId === animalId);
  }
  
  if (status) {
    filteredDocs = filteredDocs.filter(d => d.status === status);
  }
  
  res.json(filteredDocs);
});

// GET - Buscar documento por ID
router.get('/:id', (req: Request, res: Response) => {
  const documento = documentosDB.find(d => d.id === req.params.id);
  
  if (!documento) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }
  
  res.json(documento);
});

// POST - Upload de novo documento
router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const { tipo, adotanteId, animalId, adocaoId } = req.body;

    if (!tipo || !adotanteId || !animalId) {
      return res.status(400).json({ error: 'Campos obrigatórios: tipo, adotanteId, animalId' });
    }

    const documento: Documento = {
      id: Date.now().toString(),
      tipo,
      nome: req.file.originalname,
      nomeArquivo: req.file.filename,
      caminho: req.file.path,
      url: `/api/documentos/download/${req.file.filename}`,
      tamanho: req.file.size,
      mimeType: req.file.mimetype,
      dataUpload: new Date().toISOString(),
      adotanteId,
      animalId,
      adocaoId: adocaoId || undefined,
      status: 'pendente'
    };

    documentosDB.push(documento);

    res.status(201).json({
      message: 'Documento enviado com sucesso',
      documento
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do documento' });
  }
});

// GET - Download de documento
router.get('/download/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/documentos', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }

  res.download(filePath);
});

// PUT - Atualizar status do documento
router.put('/:id/status', (req: Request, res: Response) => {
  const { status, observacoes } = req.body;
  const documento = documentosDB.find(d => d.id === req.params.id);

  if (!documento) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }

  if (!['pendente', 'aprovado', 'rejeitado'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  documento.status = status;
  if (observacoes) {
    documento.observacoes = observacoes;
  }

  res.json({
    message: 'Status atualizado com sucesso',
    documento
  });
});

// DELETE - Remover documento
router.delete('/:id', (req: Request, res: Response) => {
  const index = documentosDB.findIndex(d => d.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }

  const documento = documentosDB[index];

  // Remove o arquivo do disco
  if (fs.existsSync(documento.caminho)) {
    fs.unlinkSync(documento.caminho);
  }

  documentosDB.splice(index, 1);

  res.json({ message: 'Documento removido com sucesso' });
});

// GET - Estatísticas de documentos
router.get('/stats/overview', (req: Request, res: Response) => {
  const stats = {
    total: documentosDB.length,
    pendentes: documentosDB.filter(d => d.status === 'pendente').length,
    aprovados: documentosDB.filter(d => d.status === 'aprovado').length,
    rejeitados: documentosDB.filter(d => d.status === 'rejeitado').length,
    porTipo: documentosDB.reduce((acc, doc) => {
      acc[doc.tipo] = (acc[doc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  res.json(stats);
});

export default router;
