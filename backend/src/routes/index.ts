import { Router } from 'express';
import { petsRouter } from './pets.js';
import documentosRouter from './documentos.js';
import whatsappRouter from './whatsapp.js';
import dataRouter from './data.js';

export const router = Router();

// Rota principal da API
router.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API Caramelo! 🐕',
    version: '1.0.0',
    endpoints: {
      pets: '/api/pets',
      documentos: '/api/documentos',
      whatsapp: '/api/whatsapp',
      data: '/api/data',
      health: '/health'
    }
  });
});

// Sub-rotas
router.use('/pets', petsRouter);
router.use('/documentos', documentosRouter);
router.use('/whatsapp', whatsappRouter);
router.use('/data', dataRouter);
