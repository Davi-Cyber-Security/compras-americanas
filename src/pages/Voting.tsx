import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import votarImg from '../assets/votar.png';
import type { Product, Vote, VoteCount, VotingResult, CanVoteResult } from '../types';
import '../styles/voting.css';

const POLL_INTERVAL = 5000;

export default function Voting() {
  const [products, setProducts] = useState<Product[]>([]);
  const [todayVotes, setTodayVotes] = useState<Vote[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [canVoteData, setCanVoteData] = useState<CanVoteResult>({ canVote: true, reason: null });
  const [result, setResult] = useState<VotingResult | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [productsData, votesData, canVoteRes, resultData] =
        await Promise.all([
          api.get('/products'),
          api.get('/voting/today'),
          api.get('/voting/can-vote'),
          api.get('/voting/result'),
        ]);
      setProducts(productsData);
      setTodayVotes(votesData.votes);
      setVoteCounts(votesData.counts);
      setCanVoteData(canVoteRes);
      setResult(resultData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    pollingRef.current = setInterval(loadData, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loadData]);

  const handleVoteClick = (product: Product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmVote = async () => {
    if (!selectedProduct) return;
    setVoteLoading(true);
    try {
      await api.post('/voting', { productId: selectedProduct.id });
      setShowConfirm(false);
      setSelectedProduct(null);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao votar.');
    } finally {
      setVoteLoading(false);
    }
  };

  const voteCountMap = new Map(
    voteCounts.map((c) => [c.vote_product, c])
  );

  const productsByType: Record<string, Product[]> = {};
  for (const p of products) {
    if (!productsByType[p.type]) productsByType[p.type] = [];
    productsByType[p.type].push(p);
  }

  const toggleVoters = (productId: number) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (loading) {
    return (
      <div className="voting-loading">
        <div className="spinner" />
        <p>Carregando produtos...</p>
      </div>
    );
  }

  const showWinner = result?.winner && !result.votingOpen;

  return (
    <div className="voting-page">
      <h2 className="page-title">Votação do Dia</h2>

      {result?.votingOpen && (
        <div className="voting-open-banner">
          Votação aberta até às 18:00 (horário de Brasília)
        </div>
      )}

      {!canVoteData.canVote && canVoteData.reason && (
        <div className="already-voted-banner">
          {canVoteData.reason}
        </div>
      )}

      {showWinner && (
        <div className="winner-section">
          <div className="winner-badge">VENCEDOR</div>
          <h3 className="winner-name">{result.winner!.products_name}</h3>
          <span className="winner-type">{result.winner!.type}</span>
          <p className="winner-message">{result.message}</p>
        </div>
      )}

      <section className="products-section">
        <h3 className="section-title">Produtos</h3>
        {Object.keys(productsByType).length === 0 && (
          <p className="empty-message">Nenhum produto cadastrado ainda.</p>
        )}

        {Object.entries(productsByType).map(([type, prods]) => {
          const totalAmount = prods.reduce((sum, p) => sum + p.amount, 0);
          return (
          <div key={type} className="type-group">
            <div className="type-header">
              <h4 className="type-title">{type}</h4>
              <span className="type-total">Total: {totalAmount} unidade{totalAmount !== 1 ? 's' : ''}</span>
            </div>
            <div className="type-products-scroll">
              {prods.map((product) => {
                const vc = voteCountMap.get(product.id);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-card-info">
                      <span className="product-name">
                        {product.products_name}
                      </span>
                      <span className="product-amount">
                        Qtd: {product.amount}
                      </span>
                    </div>

                    <div className="product-card-actions">
                      {vc && (
                        <button
                          className="vote-count-badge"
                          onClick={() => toggleVoters(product.id)}
                          title="Ver quem votou"
                        >
                          [{vc.vote_count}]
                        </button>
                      )}

                      {canVoteData.canVote && (
                        <button
                          className="vote-btn"
                          onClick={() => handleVoteClick(product)}
                          title="Votar neste produto"
                        >
                          <img src={votarImg} alt="Votar" className="vote-icon" />
                        </button>
                      )}
                    </div>

                    {expandedProduct === product.id && vc && (
                      <div className="voters-list">
                        {todayVotes
                          .filter((v) => v.vote_product === product.id)
                          .map((v) => (
                            <div key={v.id} className="voter-item">
                              <span className="voter-email">{v.email}</span>
                              <span className="voter-time">{v.vote_time}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          );
        })}
      </section>

      {showConfirm && selectedProduct && (
        <ConfirmModal
          title="Confirmar Voto"
          message={`Deseja votar em "${selectedProduct.products_name}"? Você só pode votar 1 vez por dia. Não será possível votar novamente até amanhã.`}
          onConfirm={confirmVote}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedProduct(null);
          }}
          loading={voteLoading}
        />
      )}
    </div>
  );
}
