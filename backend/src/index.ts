import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',           // Dev local
  'http://localhost:3000',            // Dev alternativo
  'https://localhost:5173',          // HTTPS local
  process.env.FRONTEND_URL,          // From Railway env var
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Caramelo API está rodando! 🐕' });
});

app.listen(PORT, () => {
  console.log(`🐕 Caramelo Backend rodando em http://localhost:${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`✅ CORS habilitado para: ${allowedOrigins.join(', ')}`);
});

