import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PasswordInput from '../components/PasswordInput';
import registerImg from '../assets/registrar login.avif';
import '../styles/auth.css';

type Step = 'email' | 'code' | 'password';

export default function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/app/votar" replace />;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-code', { email });
      setStep('code');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar código.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-code', { email, code });
      setStep('password');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { email, code, password, confirmPassword });
      localStorage.setItem('token', data.token);
      await login(email, password);
      navigate('/app/votar');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const stepLabel = { email: '1', code: '2', password: '3' };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src={registerImg} alt="Cadastrar" className="auth-illustration" />
        <h2 className="auth-title">Criar Conta</h2>

        <div className="register-steps">
          {(['email', 'code', 'password'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`step-dot ${step === s ? 'active' : i < ['email', 'code', 'password'].indexOf(step) ? 'done' : ''}`}
            >
              {stepLabel[s]}
            </div>
          ))}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {step === 'email' && (
          <form onSubmit={handleSendCode} className="auth-form">
            <p className="step-hint">Digite seu e-mail acadêmico. Enviaremos um código de confirmação.</p>
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
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="auth-form">
            <p className="step-hint">
              Enviamos um código para <strong>{email}</strong>. Verifique sua caixa de entrada. O código expira em 15 minutos.
            </p>
            <div className="form-group">
              <label htmlFor="code">Código de verificação</label>
              <input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="code-input"
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading || code.length !== 6}>
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
            <button
              type="button"
              className="link-btn"
              style={{ marginTop: '8px', display: 'block', textAlign: 'center' }}
              onClick={() => { setStep('email'); setError(''); setCode(''); }}
            >
              Reenviar código
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleRegister} className="auth-form">
            <p className="step-hint">E-mail confirmado! Agora crie sua senha.</p>
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
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        )}

        <div className="auth-links">
          <Link to="/login">Já tem conta? Faça login</Link>
          <Link to="/recuperar-senha" className="link-btn">Recuperar senha</Link>
        </div>
      </div>
    </div>
  );
}
