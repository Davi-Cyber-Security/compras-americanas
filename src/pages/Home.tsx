import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import voteIcon from '../assets/voteHome.png';
import '../styles/home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <img src={voteIcon} alt="Votação" className="hero-icon" />
        <h1 className="hero-title">Sistema de Votação de Produtos</h1>
        <p className="hero-subtitle">
          Chega de contar votos manualmente no grupo do WhatsApp!
          Vote nos produtos que vamos levar para a faculdade de forma
          organizada, rápida e sem erros.
        </p>

        {user ? (
          <Link to="/app/votar" className="hero-cta">
            Ir para Votação
          </Link>
        ) : (
          <div className="hero-actions">
            <Link to="/cadastrar" className="hero-cta">
              Criar Conta
            </Link>
            <Link to="/login" className="hero-cta-secondary">
              Já tenho conta
            </Link>
          </div>
        )}
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon-wrap">
            <svg viewBox="0 0 24 24" className="feature-svg">
              <path d="M18 13h-.68l-2 2h1.91L19 17H5l1.78-2h2.05l-2-2H6l-3 3v2c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2v-2l-3-3z" />
            </svg>
          </div>
          <h3>Vote nos Produtos</h3>
          <p>Escolha o que levar para a faculdade com votação democrática entre amigos.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrap">
            <svg viewBox="0 0 24 24" className="feature-svg">
              <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
          </div>
          <h3>Histórico Completo</h3>
          <p>Acompanhe todas as votações anteriores organizadas por data.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrap">
            <svg viewBox="0 0 24 24" className="feature-svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>
          <h3>Seguro e Organizado</h3>
          <p>Cada pessoa vota uma vez por dia. Sem duplicatas, sem confusão.</p>
        </div>
      </section>
    </div>
  );
}
