export interface Pet {
  id: string;
  nome: string;
  tipo: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: number;
  descricao: string;
  disponivel: boolean;
  imagem?: string;
}
