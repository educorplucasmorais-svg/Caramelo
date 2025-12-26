const API_URL = 'http://localhost:3001/api';

export const api = {
  // Buscar todos os pets
  async getPets() {
    try {
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) throw new Error('Erro ao buscar pets');
      return response.json();
    } catch {
      // Retorna dados de fallback se o backend estiver offline
      return [
        {
          id: '1',
          nome: 'Caramelo',
          tipo: 'cachorro',
          raca: 'Vira-lata',
          idade: 3,
          sexo: 'macho',
          porte: 'medio',
          cor: 'Caramelo',
          peso: 12,
          descricao: 'Um cachorro muito amigável e carinhoso, adora brincar e passear.',
          status: 'disponivel',
          disponivel: true,
          dataEntrada: '2024-10-15',
          imagem: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
          vacinado: true,
          castrado: true,
          vermifugado: true
        },
        {
          id: '2',
          nome: 'Mimi',
          tipo: 'gato',
          raca: 'Siamês',
          idade: 2,
          sexo: 'femea',
          porte: 'pequeno',
          cor: 'Cinza',
          peso: 4,
          descricao: 'Gatinha tranquila que adora dormir e receber carinho.',
          status: 'disponivel',
          disponivel: true,
          dataEntrada: '2024-11-20',
          imagem: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
          vacinado: true,
          castrado: false,
          vermifugado: true
        },
        {
          id: '3',
          nome: 'Thor',
          tipo: 'cachorro',
          raca: 'Golden Retriever',
          idade: 4,
          sexo: 'macho',
          porte: 'grande',
          cor: 'Dourado',
          peso: 30,
          descricao: 'Cachorro muito brincalhão e adora crianças. Perfeito para famílias.',
          status: 'disponivel',
          disponivel: true,
          dataEntrada: '2024-09-10',
          imagem: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
          vacinado: true,
          castrado: true,
          vermifugado: true
        },
        {
          id: '4',
          nome: 'Luna',
          tipo: 'gato',
          raca: 'Persa',
          idade: 1,
          sexo: 'femea',
          porte: 'pequeno',
          cor: 'Branco',
          peso: 3,
          descricao: 'Filhote muito fofa e curiosa, cheia de energia.',
          status: 'disponivel',
          disponivel: true,
          dataEntrada: '2024-12-01',
          imagem: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400',
          vacinado: false,
          castrado: false,
          vermifugado: true
        }
      ];
    }
  },

  // Buscar pet por ID
  async getPet(id: string) {
    try {
      const response = await fetch(`${API_URL}/pets/${id}`);
      if (!response.ok) throw new Error('Pet não encontrado');
      return response.json();
    } catch {
      // Fallback
      const pets = await this.getPets();
      const pet = pets.find((p: { id: string }) => p.id === id);
      if (!pet) throw new Error('Pet não encontrado');
      return pet;
    }
  },

  // Cadastrar novo pet
  async createPet(pet: Record<string, unknown>) {
    const response = await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
    if (!response.ok) throw new Error('Erro ao cadastrar pet');
    return response.json();
  },

  // Atualizar pet
  async updatePet(id: string, pet: Record<string, unknown>) {
    const response = await fetch(`${API_URL}/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
    if (!response.ok) throw new Error('Erro ao atualizar pet');
    return response.json();
  },

  // Deletar pet
  async deletePet(id: string) {
    const response = await fetch(`${API_URL}/pets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao remover pet');
    return response.json();
  },

  // Health check
  async healthCheck() {
    const response = await fetch('http://localhost:3001/health');
    return response.json();
  }
};
