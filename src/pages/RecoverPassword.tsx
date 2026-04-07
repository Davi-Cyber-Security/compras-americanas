import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PasswordInput from '../components/PasswordInput';
import recoveryImg from '/recuperar-senha.avif';
import '../styles/auth.css';
import '../styles/recover.css';

type Step = 'email' | 'code' | 'password' | 'done';

export default function RecoverPassword() {
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/app/votar" replace />;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/recover/send-code', { email });
      setUserId(data.userId);
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
      await api.post('/recover/verify-code', { userId, code });
      setStep('password');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/recover/reset', { userId, code, newPassword, confirmPassword });
      setStep('done');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-page">
      <div className="recover-image-side">
        <img src={recoveryImg} alt="Recuperar senha" className="recover-illustration" />
      </div>

      <div className="recover-form-side">
        <div className="recover-form-content">

          {step === 'email' && (
            <>
              <h2 className="auth-title">Recuperar Senha</h2>
              <p className="recover-subtitle">Digite seu e-mail acadêmico e enviaremos um código de verificação.</p>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleSendCode} className="auth-form">
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
            </>
          )}

          {step === 'code' && (
            <>
              <h2 className="auth-title">Código de Verificação</h2>
              <p className="recover-subtitle">
                Enviamos um código de 6 dígitos para <strong>{email}</strong>. Verifique seu e-mail.
              </p>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleVerifyCode} className="auth-form">
                <div className="form-group">
                  <label htmlFor="code">Código</label>
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
                  onClick={() => { setStep('email'); setError(''); setCode(''); }}
                >
                  Reenviar código
                </button>
              </form>
            </>
          )}

          {step === 'password' && (
            <>
              <h2 className="auth-title">Nova Senha</h2>
              <p className="recover-subtitle">Digite sua nova senha.</p>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleResetPassword} className="auth-form">
                <PasswordInput
                  id="newPassword"
                  label="Nova senha"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={setNewPassword}
                  required
                  minLength={6}
                />
                <PasswordInput
                  id="confirmPassword"
                  label="Confirmar nova senha"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  required
                  minLength={6}
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="password-mismatch">As senhas não coincidem</p>
                )}
                {newPassword && confirmPassword && newPassword === confirmPassword && (
                  <p className="password-match">As senhas coincidem ✓</p>
                )}
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? 'Salvando...' : 'Redefinir senha'}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="recover-done">
              <div className="recover-done-icon">✓</div>
              <h2 className="auth-title">Senha redefinida!</h2>
              <p className="recover-subtitle">Sua senha foi alterada com sucesso.</p>
              <Link to="/login" className="auth-btn" style={{ textAlign: 'center', display: 'block', marginTop: '16px' }}>
                Ir para o Login
              </Link>
            </div>
          )}

          {step !== 'done' && (
            <div className="auth-links" style={{ marginTop: '16px' }}>
              <Link to="/login">Voltar para o login</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
