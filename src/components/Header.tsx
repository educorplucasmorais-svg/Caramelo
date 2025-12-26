import './Header.css';

interface HeaderProps {
  onFiltrar?: (tipo: string) => void;
  filtroAtivo?: string;
}

export function Header({ onFiltrar, filtroAtivo = 'todos' }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-emoji">🐕</span>
          <h1>Caramelo</h1>
        </div>
        <p className="tagline">Encontre seu novo melhor amigo</p>
        
        {onFiltrar && (
          <div className="filtros">
            <button 
              className={`filtro-btn ${filtroAtivo === 'todos' ? 'ativo' : ''}`}
              onClick={() => onFiltrar('todos')}
            >
              🐾 Todos
            </button>
            <button 
              className={`filtro-btn ${filtroAtivo === 'cachorro' ? 'ativo' : ''}`}
              onClick={() => onFiltrar('cachorro')}
            >
              🐕 Cachorros
            </button>
            <button 
              className={`filtro-btn ${filtroAtivo === 'gato' ? 'ativo' : ''}`}
              onClick={() => onFiltrar('gato')}
            >
              🐱 Gatos
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
