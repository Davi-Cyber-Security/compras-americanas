import confirmIcon from '../assets/button-confirmed.png';
import '../styles/modal.css';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            <img src={confirmIcon} alt="" className="btn-icon" />
            {loading ? 'Confirmando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
