import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Animal } from '../../types';
import './Relatorios.css';

export function Relatorios() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [periodo, setPeriodo] = useState('mes');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const data = await api.getPets();
      setAnimais(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  const stats = {
    total: animais.length,
    cachorros: animais.filter(a => a.tipo === 'cachorro').length,
    gatos: animais.filter(a => a.tipo === 'gato').length,
    outros: animais.filter(a => a.tipo === 'outro').length,
    disponiveis: animais.filter(a => a.status === 'disponivel' || a.disponivel).length,
    adotados: animais.filter(a => a.status === 'adotado').length,
    tratamento: animais.filter(a => a.status === 'em_tratamento').length,
  };

  // Dados simulados de adoções mensais
  const adocoesMensais = [
    { mes: 'Jan', valor: 8 },
    { mes: 'Fev', valor: 12 },
    { mes: 'Mar', valor: 15 },
    { mes: 'Abr', valor: 10 },
    { mes: 'Mai', valor: 18 },
    { mes: 'Jun', valor: 22 },
    { mes: 'Jul', valor: 19 },
    { mes: 'Ago', valor: 25 },
    { mes: 'Set', valor: 20 },
    { mes: 'Out', valor: 28 },
    { mes: 'Nov', valor: 24 },
    { mes: 'Dez', valor: 30 },
  ];

  const maxAdocao = Math.max(...adocoesMensais.map(a => a.valor));

  return (
    <div className="relatorios-page">
      <header className="page-header">
        <div>
          <h1>📊 Relatórios</h1>
          <p>Estatísticas e análises do sistema</p>
        </div>
        <div className="periodo-select">
          <button 
            className={periodo === 'semana' ? 'ativo' : ''} 
            onClick={() => setPeriodo('semana')}
          >
            Semana
          </button>
          <button 
            className={periodo === 'mes' ? 'ativo' : ''} 
            onClick={() => setPeriodo('mes')}
          >
            Mês
          </button>
          <button 
            className={periodo === 'ano' ? 'ativo' : ''} 
            onClick={() => setPeriodo('ano')}
          >
            Ano
          </button>
        </div>
      </header>

      <div className="relatorios-grid">
        {/* Gráfico de Linha - Adoções */}
        <div className="card-relatorio card-wide">
          <h3>📈 Evolução de Adoções</h3>
          <div className="grafico-linha">
            <div className="linha-container">
              {adocoesMensais.map((item, index) => (
                <div key={item.mes} className="ponto-container">
                  <div 
                    className="ponto" 
                    style={{ bottom: `${(item.valor / maxAdocao) * 100}%` }}
                  >
                    <span className="ponto-valor">{item.valor}</span>
                  </div>
                  {index < adocoesMensais.length - 1 && (
                    <div 
                      className="linha-conexao"
                      style={{
                        bottom: `${(item.valor / maxAdocao) * 100}%`,
                        height: `${Math.abs(((adocoesMensais[index + 1].valor - item.valor) / maxAdocao) * 100)}%`,
                        transform: adocoesMensais[index + 1].valor > item.valor ? 'none' : 'scaleY(-1)'
                      }}
                    />
                  )}
                  <span className="ponto-label">{item.mes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráficos de Pizza/Donut */}
        <div className="card-relatorio">
          <h3>🐾 Por Tipo de Animal</h3>
          <div className="donut-chart">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle cachorros"
                strokeDasharray={`${(stats.cachorros / stats.total) * 100}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle gatos"
                strokeDasharray={`${(stats.gatos / stats.total) * 100}, 100`}
                strokeDashoffset={`-${(stats.cachorros / stats.total) * 100}`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="donut-center">
              <span className="donut-total">{stats.total}</span>
              <span className="donut-label">Total</span>
            </div>
          </div>
          <div className="legenda">
            <div className="legenda-item">
              <span className="cor cachorros"></span>
              <span>Cachorros ({stats.cachorros})</span>
            </div>
            <div className="legenda-item">
              <span className="cor gatos"></span>
              <span>Gatos ({stats.gatos})</span>
            </div>
            <div className="legenda-item">
              <span className="cor outros"></span>
              <span>Outros ({stats.outros})</span>
            </div>
          </div>
        </div>

        <div className="card-relatorio">
          <h3>📋 Por Status</h3>
          <div className="donut-chart">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle disponiveis"
                strokeDasharray={`${(stats.disponiveis / stats.total) * 100}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="donut-center">
              <span className="donut-total">{stats.disponiveis}</span>
              <span className="donut-label">Disponíveis</span>
            </div>
          </div>
          <div className="legenda">
            <div className="legenda-item">
              <span className="cor disponiveis"></span>
              <span>Disponíveis ({stats.disponiveis})</span>
            </div>
            <div className="legenda-item">
              <span className="cor adotados"></span>
              <span>Adotados ({stats.adotados})</span>
            </div>
            <div className="legenda-item">
              <span className="cor tratamento"></span>
              <span>Tratamento ({stats.tratamento})</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="card-relatorio card-wide">
          <h3>📊 Adoções por Mês</h3>
          <div className="grafico-barras">
            {adocoesMensais.map(item => (
              <div key={item.mes} className="barra-container">
                <div 
                  className="barra" 
                  style={{ height: `${(item.valor / maxAdocao) * 100}%` }}
                >
                  <span className="barra-valor">{item.valor}</span>
                </div>
                <span className="barra-label">{item.mes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
