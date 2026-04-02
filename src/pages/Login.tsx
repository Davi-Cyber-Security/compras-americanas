import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginImg from '../assets/ilustrar-login.jpg';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/app/votar" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app/votar');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src={loginImg} alt="Login" className="auth-illustration" />

        <h2 className="auth-title">Entrar</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-mail acadêmico</label>
            <input
              id="email"
              type="email"
              placeholder="seu.email@unirv.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/cadastrar">Não tem conta? Cadastre-se</Link>
          <button
            className="link-btn"
            onClick={() => setShowRecovery(true)}
          >
            Recuperar senha
          </button>
        </div>

        {showRecovery && (
          <div className="recovery-toast">
            <p>Em breve</p>
            <button onClick={() => setShowRecovery(false)}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
}
