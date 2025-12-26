export interface Animal {
  id: string;
  nome: string;
  tipo: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: number;
  sexo: 'macho' | 'femea';
  porte: 'pequeno' | 'medio' | 'grande';
  cor: string;
  peso: number;
  descricao: string;
  status: 'disponivel' | 'adotado' | 'em_tratamento';
  disponivel?: boolean;
  dataEntrada: string;
  imagem?: string;
  vacinado: boolean;
  castrado: boolean;
  vermifugado: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: 'admin' | 'voluntario' | 'veterinario';
  avatar?: string;
}

export interface Adocao {
  id: string;
  animalId: string;
  adotanteNome: string;
  adotanteCpf: string;
  adotanteTelefone: string;
  adotanteEmail: string;
  dataAdocao: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
}

export interface Estatisticas {
  totalAnimais: number;
  disponiveis: number;
  adotados: number;
  emTratamento: number;
  adocoesMes: number;
  cachorrros: number;
  gatos: number;
  outros: number;
}
