import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Animal, Estatisticas } from '../../types';
import { api } from '../../services/api';
import './Dashboard.css';

export function Dashboard() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [stats, setStats] = useState<Estatisticas>({
    totalAnimais: 0,
    disponiveis: 0,
    adotados: 0,
    emTratamento: 0,
    adocoesMes: 12,
    cachorrros: 0,
    gatos: 0,
    outros: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const data = await api.getPets();
      setAnimais(data);
      
      // Calcular estatísticas
      setStats({
        totalAnimais: data.length,
        disponiveis: data.filter((a: Animal) => a.status === 'disponivel' || a.disponivel).length,
        adotados: data.filter((a: Animal) => a.status === 'adotado').length,
        emTratamento: data.filter((a: Animal) => a.status === 'em_tratamento').length,
        adocoesMes: 12,
        cachorrros: data.filter((a: Animal) => a.tipo === 'cachorro').length,
        gatos: data.filter((a: Animal) => a.tipo === 'gato').length,
        outros: data.filter((a: Animal) => a.tipo === 'outro').length
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral do sistema</p>
        </div>
        <Link to="/animais/novo" className="btn-primary">
          ➕ Novo Animal
        </Link>
      </header>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">🐾</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalAnimais}</span>
            <span className="stat-label">Total de Animais</span>
          </div>
        </div>

        <div className="stat-card stat-disponivel">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.disponiveis}</span>
            <span className="stat-label">Disponíveis</span>
          </div>
        </div>

        <div className="stat-card stat-adotado">
          <div className="stat-icon">🏠</div>
          <div className="stat-info">
            <span className="stat-value">{stats.adotados}</span>
            <span className="stat-label">Adotados</span>
          </div>
        </div>

        <div className="stat-card stat-tratamento">
          <div className="stat-icon">💊</div>
          <div className="stat-info">
            <span className="stat-value">{stats.emTratamento}</span>
            <span className="stat-label">Em Tratamento</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="animais-recentes">
          <div className="section-header">
            <h2>🐕 Animais Recentes</h2>
            <Link to="/animais" className="link-ver-todos">Ver todos →</Link>
          </div>
          
          <div className="animais-grid">
            {animais.slice(0, 4).map(animal => (
              <Link to={`/animais/${animal.id}`} key={animal.id} className="animal-card">
                <div className="animal-image">
                  {animal.imagem ? (
                    <img src={animal.imagem} alt={animal.nome} />
                  ) : (
                    <span className="animal-placeholder">
                      {animal.tipo === 'cachorro' ? '🐕' : animal.tipo === 'gato' ? '🐱' : '🐾'}
                    </span>
                  )}
                  <span className={`status-badge status-${animal.status || 'disponivel'}`}>
                    {animal.status === 'adotado' ? 'Adotado' : 
                     animal.status === 'em_tratamento' ? 'Tratamento' : 'Disponível'}
                  </span>
                </div>
                <div className="animal-info">
                  <h3>{animal.nome}</h3>
                  <p>{animal.raca} • {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="resumo-lateral">
          <div className="card-resumo">
            <h3>📊 Distribuição por Tipo</h3>
            <div className="tipo-lista">
              <div className="tipo-item">
                <span className="tipo-icon">🐕</span>
                <span className="tipo-nome">Cachorros</span>
                <span className="tipo-valor">{stats.cachorrros}</span>
              </div>
              <div className="tipo-item">
                <span className="tipo-icon">🐱</span>
                <span className="tipo-nome">Gatos</span>
                <span className="tipo-valor">{stats.gatos}</span>
              </div>
              <div className="tipo-item">
                <span className="tipo-icon">🐾</span>
                <span className="tipo-nome">Outros</span>
                <span className="tipo-valor">{stats.outros}</span>
              </div>
            </div>
          </div>

          <div className="card-resumo">
            <h3>📈 Adoções este mês</h3>
            <div className="adocoes-destaque">
              <span className="adocoes-numero">{stats.adocoesMes}</span>
              <span className="adocoes-label">animais encontraram um lar</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
