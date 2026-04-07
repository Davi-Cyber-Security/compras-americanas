import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import registerImg from '../assets/registrar login.avif';
import '../styles/auth.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src={registerImg} alt="Cadastrar" className="auth-illustration" />
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

          <PasswordInput
            id="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirmar senha"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            minLength={6}
          />

          {password && confirmPassword && password !== confirmPassword && (
            <p className="password-mismatch">As senhas não coincidem</p>
          )}
          {password && confirmPassword && password === confirmPassword && (
            <p className="password-match">As senhas coincidem ✓</p>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Já tem conta? Faça login</Link>
          <Link to="/recuperar-senha" className="link-btn">Recuperar senha</Link>
        </div>
      </div>
    </div>
  );
}
