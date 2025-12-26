import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const success = await login(email, senha);
      if (success) {
        navigate('/dashboard');
      } else {
        setErro('Email ou senha inválidos');
      }
    } catch {
      setErro('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo.jpeg" alt="Caramelo" className="logo-image" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover'}} />
            <h1>Caramelo</h1>
            <p>Sistema de Gestão de Animais</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Bem-Vindo ao Caramelo</h2>
          
          {erro && <div className="login-erro">{erro}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <a href="#" className="forgot-password">Esqueceu a senha?</a>
        </form>

        <div className="login-footer">
          <div className="animal-icons">
            <span>🐕</span>
            <span>🐈</span>
            <span>🐇</span>
            <span>🐦</span>
          </div>
        </div>
      </div>
    </div>
  );
}
