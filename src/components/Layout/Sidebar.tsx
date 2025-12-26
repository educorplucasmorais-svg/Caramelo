import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

export function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.jpeg" alt="Caramelo" className="sidebar-logo" style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover'}} />
        <h1>Caramelo</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🏠</span>
          Principal
        </NavLink>
        
        <NavLink to="/animais" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🐾</span>
          Animais
        </NavLink>
        
        <NavLink to="/relatorios" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">📊</span>
          Relatórios
        </NavLink>
        
        <NavLink to="/configuracoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">⚙️</span>
          Configurações
        </NavLink>
        
        <NavLink to="/chatbot" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🤖</span>
          Caramelo IA
        </NavLink>
        
        <NavLink to="/pos-adocao" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🏠</span>
          Pós-Adoção
        </NavLink>

        <NavLink to="/banco-dados" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🗄️</span>
          Banco de Dados
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {usuario?.nome?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{usuario?.nome || 'Usuário'}</span>
            <span className="user-role">{usuario?.cargo || 'Admin'}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          🚪 Sair
        </button>
      </div>
    </aside>
  );
}
