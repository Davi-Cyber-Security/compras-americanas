import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import voteIcon from '../assets/voteHome.png';
import '../styles/header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <Link to={user ? '/app/votar' : '/'} className="header-brand">
        <img src={voteIcon} alt="Vote" className="header-icon" />
        <h1 className="header-title">Sistema de Votar</h1>
      </Link>

      <nav className="header-nav">
        {user ? (
          <div className="header-user">
            <span className="header-email">{user.email}</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        ) : (
          <div className="header-auth">
            <Link to="/cadastrar" className="btn-register">
              Cadastrar
            </Link>
            <Link to="/login" className="btn-login">
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
