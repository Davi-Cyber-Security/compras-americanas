import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();
  const canModify = user?.permissions?.modification || user?.permissions?.admin;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/app/votar"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <svg viewBox="0 0 24 24" className="sidebar-icon">
            <path d="M18 13h-.68l-2 2h1.91L19 17H5l1.78-2h2.05l-2-2H6l-3 3v2c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2v-2l-3-3zm-1-5.05l-4.95 4.95-3.54-3.54 4.95-4.95L16.99 7.95zm-4.24-5.66L6.39 8.66a.996.996 0 000 1.41l4.95 4.95c.39.39 1.02.39 1.41 0l6.36-6.36a.996.996 0 000-1.41l-4.95-4.95a.996.996 0 00-1.41 0z" />
          </svg>
          Votar
        </NavLink>

        {canModify ? (
          <NavLink
            to="/app/produtos"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <svg viewBox="0 0 24 24" className="sidebar-icon">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2V7h-4v2h2z" />
            </svg>
            Cadastrar Produto
          </NavLink>
        ) : null}

        <NavLink
          to="/app/historico"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <svg viewBox="0 0 24 24" className="sidebar-icon">
            <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
          Histórico
        </NavLink>

        <NavLink
          to="/app/configuracoes"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <svg viewBox="0 0 24 24" className="sidebar-icon">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z" />
          </svg>
          Configurações
        </NavLink>
      </nav>
    </aside>
  );
}
