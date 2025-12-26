import { Router } from 'express';
import { Pet } from '../types/pet.js';

export const petsRouter = Router();

// Dados de exemplo (simulando um banco de dados)
let pets: Pet[] = [
  {
    id: '1',
    nome: 'Caramelo',
    tipo: 'cachorro',
    raca: 'Vira-lata',
    idade: 3,
    descricao: 'Um cachorro muito amigável e carinhoso',
    disponivel: true,
    imagem: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'
  },
  {
    id: '2',
    nome: 'Mimi',
    tipo: 'gato',
    raca: 'Siamês',
    idade: 2,
    descricao: 'Gatinha tranquila que adora dormir',
    disponivel: true,
    imagem: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'
  },
  {
    id: '3',
    nome: 'Thor',
    tipo: 'cachorro',
    raca: 'Golden Retriever',
    idade: 4,
    descricao: 'Cachorro muito brincalhão e adora crianças',
    disponivel: true,
    imagem: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'
  },
  {
    id: '4',
    nome: 'Luna',
    tipo: 'gato',
    raca: 'Persa',
    idade: 1,
    descricao: 'Filhote muito fofa e curiosa',
    disponivel: true,
    imagem: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400'
  }
];

// GET - Listar todos os pets
petsRouter.get('/', (req, res) => {
  res.json(pets);
});

// GET - Buscar pet por ID
petsRouter.get('/:id', (req, res) => {
  const pet = pets.find(p => p.id === req.params.id);
  if (!pet) {
    return res.status(404).json({ error: 'Pet não encontrado' });
  }
  res.json(pet);
});

// POST - Cadastrar novo pet
petsRouter.post('/', (req, res) => {
  const novoPet: Pet = {
    id: String(Date.now()),
    ...req.body,
    disponivel: true
  };
  pets.push(novoPet);
  res.status(201).json(novoPet);
});

// PUT - Atualizar pet
petsRouter.put('/:id', (req, res) => {
  const index = pets.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pet não encontrado' });
  }
  pets[index] = { ...pets[index], ...req.body };
  res.json(pets[index]);
});

// DELETE - Remover pet
petsRouter.delete('/:id', (req, res) => {
  const index = pets.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pet não encontrado' });
  }
  const petRemovido = pets.splice(index, 1);
  res.json({ message: 'Pet removido com sucesso', pet: petRemovido[0] });
});
