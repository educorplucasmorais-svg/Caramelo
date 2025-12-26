import { Link } from 'react-router-dom';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="dog-404">
          <span className="dog-emoji">🐕</span>
          <div className="dog-shadow"></div>
        </div>
        
        <h1>OPS! NÃO ENCONTRAMOS ESSA PÁGINA</h1>
        <p>Parece que essa página foi adotada e não está mais disponível.</p>
        <p>Não se preocupe, você pode voltar para um lugar seguro!</p>
        
        <Link to="/dashboard" className="btn-voltar-home">
          🏠 Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
