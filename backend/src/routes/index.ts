import { Router } from 'express';
import { petsRouter } from './pets.js';

export const router = Router();

// Rota principal da API
router.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API Caramelo! 🐕',
    version: '1.0.0',
    endpoints: {
      pets: '/api/pets',
      health: '/health'
    }
  });
});

// Sub-rotas
router.use('/pets', petsRouter);
