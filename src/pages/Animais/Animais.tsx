import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Animal } from '../../types';
import { api } from '../../services/api';
import './Animais.css';

export function Animais() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAnimais();
  }, []);

  async function carregarAnimais() {
    try {
      setLoading(true);
      const data = await api.getPets();
      setAnimais(data);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
    } finally {
      setLoading(false);
    }
  }

  const animaisFiltrados = animais.filter(animal => {
    const matchFiltro = filtro === 'todos' || animal.tipo === filtro;
    const matchBusca = animal.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       animal.raca.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="animais-page">
      <header className="page-header">
        <div>
          <h1>🐾 Animais</h1>
          <p>Gerencie todos os animais cadastrados</p>
        </div>
        <Link to="/animais/novo" className="btn-primary">
          ➕ Cadastrar Animal
        </Link>
      </header>

      <div className="filtros-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome ou raça..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filtros-tipo">
          <button 
            className={`filtro-btn ${filtro === 'todos' ? 'ativo' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button 
            className={`filtro-btn ${filtro === 'cachorro' ? 'ativo' : ''}`}
            onClick={() => setFiltro('cachorro')}
          >
            🐕 Cachorros
          </button>
          <button 
            className={`filtro-btn ${filtro === 'gato' ? 'ativo' : ''}`}
            onClick={() => setFiltro('gato')}
          >
            🐱 Gatos
          </button>
          <button 
            className={`filtro-btn ${filtro === 'outro' ? 'ativo' : ''}`}
            onClick={() => setFiltro('outro')}
          >
            🐾 Outros
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <span className="loading-icon">🐾</span>
          <p>Carregando animais...</p>
        </div>
      ) : (
        <>
          <div className="resultados-info">
            <p>{animaisFiltrados.length} {animaisFiltrados.length === 1 ? 'animal encontrado' : 'animais encontrados'}</p>
          </div>

          <div className="animais-lista">
            {animaisFiltrados.map(animal => (
              <Link to={`/animais/${animal.id}`} key={animal.id} className="animal-row">
                <div className="animal-avatar">
                  {animal.imagem ? (
                    <img src={animal.imagem} alt={animal.nome} />
                  ) : (
                    <span>{animal.tipo === 'cachorro' ? '🐕' : animal.tipo === 'gato' ? '🐱' : '🐾'}</span>
                  )}
                </div>
                
                <div className="animal-dados">
                  <h3>{animal.nome}</h3>
                  <p>{animal.raca}</p>
                </div>

                <div className="animal-meta">
                  <span className="meta-item">
                    <strong>Idade:</strong> {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
                  </span>
                  <span className="meta-item">
                    <strong>Tipo:</strong> {animal.tipo}
                  </span>
                </div>

                <span className={`status-tag status-${animal.status || 'disponivel'}`}>
                  {animal.status === 'adotado' ? '🏠 Adotado' : 
                   animal.status === 'em_tratamento' ? '💊 Tratamento' : '✅ Disponível'}
                </span>

                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
