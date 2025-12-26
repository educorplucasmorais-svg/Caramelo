import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Configuracoes.css';

export function Configuracoes() {
  const { usuario } = useAuth();
  const [config, setConfig] = useState({
    nomeInstituicao: 'SEPA - Sociedade de Proteção Animal',
    email: 'contato@sepa.org.br',
    telefone: '(11) 99999-9999',
    endereco: 'Rua dos Animais, 123 - São Paulo, SP',
    notificacoes: true,
    emailAdocao: true,
    emailRelatorios: false,
  });

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSalvar = async () => {
    setSalvando(true);
    setMensagem('');
    
    // Simulação de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSalvando(false);
    setMensagem('Configurações salvas com sucesso!');
    
    setTimeout(() => setMensagem(''), 3000);
  };

  return (
    <div className="configuracoes-page">
      <header className="page-header">
        <div>
          <h1>⚙️ Configurações</h1>
          <p>Gerencie as configurações do sistema</p>
        </div>
      </header>

      <div className="config-grid">
        {/* Perfil do Usuário */}
        <div className="config-card">
          <h2>👤 Perfil do Usuário</h2>
          
          <div className="perfil-info">
            <div className="avatar-grande">
              {usuario?.nome?.charAt(0) || 'U'}
            </div>
            <div className="perfil-dados">
              <h3>{usuario?.nome || 'Usuário'}</h3>
              <p>{usuario?.email || 'email@exemplo.com'}</p>
              <span className="cargo-badge">{usuario?.cargo || 'Admin'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Nome</label>
            <input type="text" value={usuario?.nome || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={usuario?.email || ''} readOnly />
          </div>
          <button className="btn-secondary">✏️ Editar Perfil</button>
        </div>

        {/* Dados da Instituição */}
        <div className="config-card">
          <h2>🏢 Dados da Instituição</h2>
          
          <div className="form-group">
            <label>Nome da Instituição</label>
            <input 
              type="text" 
              value={config.nomeInstituicao}
              onChange={(e) => setConfig({...config, nomeInstituicao: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Email de Contato</label>
            <input 
              type="email" 
              value={config.email}
              onChange={(e) => setConfig({...config, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="tel" 
              value={config.telefone}
              onChange={(e) => setConfig({...config, telefone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input 
              type="text" 
              value={config.endereco}
              onChange={(e) => setConfig({...config, endereco: e.target.value})}
            />
          </div>
        </div>

        {/* Notificações */}
        <div className="config-card">
          <h2>🔔 Notificações</h2>
          
          <div className="toggle-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Notificações Push</span>
                <span className="toggle-desc">Receber notificações no navegador</span>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={config.notificacoes}
                  onChange={(e) => setConfig({...config, notificacoes: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Email de Adoção</span>
                <span className="toggle-desc">Receber emails sobre novas adoções</span>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={config.emailAdocao}
                  onChange={(e) => setConfig({...config, emailAdocao: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Relatórios Semanais</span>
                <span className="toggle-desc">Receber relatórios por email</span>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={config.emailRelatorios}
                  onChange={(e) => setConfig({...config, emailRelatorios: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="config-card">
          <h2>🛠️ Ações</h2>
          
          <div className="acoes-lista">
            <button className="btn-acao">
              📥 Exportar Dados
            </button>
            <button className="btn-acao">
              📊 Gerar Relatório Completo
            </button>
            <button className="btn-acao">
              🔄 Sincronizar Dados
            </button>
            <button className="btn-acao perigo">
              🗑️ Limpar Cache
            </button>
          </div>
        </div>
      </div>

      <div className="config-footer">
        {mensagem && <span className="mensagem-sucesso">✅ {mensagem}</span>}
        <button className="btn-salvar" onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : '💾 Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}
