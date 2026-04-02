import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import registerImg from '../assets/registrar login.avif';
import '../styles/auth.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/app/votar" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/app/votar');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar conta.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img
          src={registerImg}
          alt="Cadastrar"
          className="auth-illustration"
        />

        <h2 className="auth-title">Criar Conta</h2>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Já tem conta? Faça login</Link>
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
