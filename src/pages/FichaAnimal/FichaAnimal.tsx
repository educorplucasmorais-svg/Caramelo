import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Animal } from '../../types';
import { api } from '../../services/api';
import './FichaAnimal.css';

export function FichaAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarAnimal(id);
    }
  }, [id]);

  async function carregarAnimal(animalId: string) {
    try {
      setLoading(true);
      const data = await api.getPet(animalId);
      setAnimal(data);
    } catch (error) {
      console.error('Erro ao carregar animal:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExcluir() {
    if (!animal || !window.confirm(`Deseja realmente excluir ${animal.nome}?`)) return;
    
    try {
      await api.deletePet(animal.id);
      navigate('/animais');
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  }

  if (loading) {
    return (
      <div className="ficha-loading">
        <span>🐾</span>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="ficha-error">
        <span>😢</span>
        <p>Animal não encontrado</p>
        <Link to="/animais">Voltar para lista</Link>
      </div>
    );
  }

  return (
    <div className="ficha-animal">
      <header className="ficha-header">
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <div className="ficha-actions">
          <button className="btn-editar">✏️ Editar</button>
          <button className="btn-excluir" onClick={handleExcluir}>🗑️ Excluir</button>
        </div>
      </header>

      <div className="ficha-content">
        <div className="ficha-principal">
          <div className="animal-foto-container">
            {animal.imagem ? (
              <img src={animal.imagem} alt={animal.nome} className="animal-foto" />
            ) : (
              <div className="animal-foto-placeholder">
                {animal.tipo === 'cachorro' ? '🐕' : animal.tipo === 'gato' ? '🐱' : '🐾'}
              </div>
            )}
            <span className={`status-badge status-${animal.status || 'disponivel'}`}>
              {animal.status === 'adotado' ? 'Adotado' : 
               animal.status === 'em_tratamento' ? 'Em Tratamento' : 'Disponível para Adoção'}
            </span>
          </div>

          <div className="animal-detalhes">
            <h1>{animal.nome}</h1>
            <p className="animal-raca">{animal.raca}</p>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Tipo</span>
                <span className="info-value">{animal.tipo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Idade</span>
                <span className="info-value">{animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sexo</span>
                <span className="info-value">{animal.sexo || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Porte</span>
                <span className="info-value">{animal.porte || 'Médio'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Cor</span>
                <span className="info-value">{animal.cor || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Peso</span>
                <span className="info-value">{animal.peso ? `${animal.peso} kg` : 'Não informado'}</span>
              </div>
            </div>

            <div className="descricao-section">
              <h3>📝 Descrição</h3>
              <p>{animal.descricao}</p>
            </div>

            <div className="saude-section">
              <h3>💊 Saúde</h3>
              <div className="saude-tags">
                <span className={`saude-tag ${animal.vacinado ? 'sim' : 'nao'}`}>
                  {animal.vacinado ? '✅ Vacinado' : '❌ Não vacinado'}
                </span>
                <span className={`saude-tag ${animal.castrado ? 'sim' : 'nao'}`}>
                  {animal.castrado ? '✅ Castrado' : '❌ Não castrado'}
                </span>
                <span className={`saude-tag ${animal.vermifugado ? 'sim' : 'nao'}`}>
                  {animal.vermifugado ? '✅ Vermifugado' : '❌ Não vermifugado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {animal.status !== 'adotado' && (
          <div className="adocao-section">
            <h3>🏠 Interessado em adotar?</h3>
            <p>Preencha o formulário abaixo para demonstrar interesse na adoção.</p>
            
            <form className="form-adocao">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome completo</label>
                  <input type="text" placeholder="Seu nome" />
                </div>
                <div className="form-group">
                  <label>CPF</label>
                  <input type="text" placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="tel" placeholder="(00) 00000-0000" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="seu@email.com" />
                </div>
              </div>
              <button type="submit" className="btn-adotar">
                💛 Quero Adotar {animal.nome}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
