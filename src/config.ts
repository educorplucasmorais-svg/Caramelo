// Configurações globais do frontend

// Backend URL - usa variável de ambiente ou localhost em dev
export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// WhatsApp Configuration
export const WHATSAPP_NUMBER_E164 = '5531994979803';
export const WHATSAPP_WA_ME_URL = `https://wa.me/${WHATSAPP_NUMBER_E164}`;
