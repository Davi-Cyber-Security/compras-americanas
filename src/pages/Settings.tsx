import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ConfirmModalEdit from '../components/ConfirmModalEdit';
import '../styles/settings.css';

const SYSTEM_VERSION = '1.0.0';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/user');
      logout();
      navigate('/');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao excluir conta.'
      );
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="settings-page">
      <h2 className="page-title">Configurações</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="settings-card">
        <h3 className="settings-section-title">Informações da Conta</h3>

        <div className="settings-field">
          <label>E-mail</label>
          <span>{user?.email}</span>
        </div>

        <div className="settings-field">
          <label>Permissões</label>
          <span>
            {user?.permissions?.admin
              ? 'Administrador'
              : user?.permissions?.modification
              ? 'Moderador'
              : 'Chorar na tora 😂😂'}
          </span>
        </div>

        <div className="settings-field">
          <label>Versão do Sistema</label>
          <span>v{SYSTEM_VERSION}</span>
        </div>
      </div>

      <div className="settings-card danger-zone">
        <h3 className="settings-section-title danger-title">Zona de Perigo</h3>
        <p className="danger-description">
          Ao excluir sua conta, todos os seus dados serão removidos
          permanentemente. Esta ação não pode ser desfeita.
        </p>
        <button
          className="btn-danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Excluir minha conta
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmModalEdit
          title="Excluir Conta"
          message="Tem certeza que deseja excluir sua conta? Todos os seus dados serão removidos permanentemente."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
