import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModalEdit from '../components/ConfirmModalEdit';
import type { Product } from '../types';
import '../styles/products.css';

const POLL_INTERVAL = 5000;

export default function ProductRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canModify = user?.permissions?.modification || user?.permissions?.admin;
  const isAdmin = user?.permissions?.admin === 1;

  useEffect(() => {
    if (!canModify) {
      navigate('/app/votar', { replace: true });
    }
  }, [canModify, navigate]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    pollingRef.current = setInterval(loadProducts, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loadProducts]);

  const resetForm = () => {
    setName('');
    setType('');
    setAmount('');
    setEditingProduct(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (editingProduct) {
      setShowEditConfirm(true);
      return;
    }

    setLoading(true);
    try {
      await api.post('/products', {
        productsName: name,
        type,
        amount: Number(amount),
      });
      setSuccess('Produto cadastrado com sucesso!');
      resetForm();
      await loadProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar produto.');
    } finally {
      setLoading(false);
    }
  };

  const confirmEdit = async () => {
    if (!editingProduct) return;
    setLoading(true);
    try {
      await api.put(`/products/${editingProduct.id}`, {
        productsName: name,
        type,
        amount: Number(amount),
      });
      setSuccess('Produto atualizado com sucesso!');
      resetForm();
      setShowEditConfirm(false);
      await loadProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.products_name);
    setType(product.type);
    setAmount(String(product.amount));
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    setLoading(true);
    try {
      await api.delete(`/products/${deleteProduct.id}`);
      setSuccess('Produto deletado com sucesso!');
      setShowDeleteConfirm(false);
      setDeleteProduct(null);
      await loadProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar produto.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!canModify) return null;

  return (
    <div className="products-page">
      <h2 className="page-title">
        {editingProduct ? 'Editar Produto' : 'Cadastrar Produto'}
      </h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Nome do produto</label>
          <input
            id="productName"
            type="text"
            placeholder="Nome do produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="productType">Tipo</label>
          <select
            id="productType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="salgado">Salgado</option>
            <option value="doce">Doce</option>
            <option value="meio doce e meio salgado">
              Meio doce e meio salgado
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="productAmount">Quantidade</label>
          <input
            id="productAmount"
            type="number"
            placeholder="Quantidade"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={1}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? 'Salvando...'
              : editingProduct
              ? 'Atualizar Produto'
              : 'Cadastrar Produto'}
          </button>
          {editingProduct && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <section className="products-list">
        <h3 className="section-title">Produtos Cadastrados</h3>
        {products.length === 0 ? (
          <p className="empty-message">Nenhum produto cadastrado.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-item-header">
                  <h4>{product.products_name}</h4>
                  <span className="product-type-badge">{product.type}</span>
                </div>
                <p className="product-item-amount">
                  Quantidade: {product.amount}
                </p>
                <div className="product-item-dates">
                  <span title="Data de criação">
                    Criado: {formatDate(product.created_at)}
                  </span>
                  <span title="Última modificação">
                    Modificado: {formatDate(product.update_at)}
                  </span>
                </div>
                <div className="product-item-actions">
                  <button
                    className="btn-edit"
                    onClick={() => startEdit(product)}
                    title="Editar produto"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        fill="currentColor"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                    Editar
                  </button>
                  {isAdmin && (
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product)}
                      title="Excluir produto"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path
                          fill="currentColor"
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        />
                      </svg>
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showEditConfirm && (
        <ConfirmModalEdit
          title="Confirmar Alteração"
          message="Tem certeza que deseja alterar este produto?"
          onConfirm={confirmEdit}
          onCancel={() => setShowEditConfirm(false)}
          loading={loading}
        />
      )}

      {showDeleteConfirm && deleteProduct && (
        <ConfirmModalEdit
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir "${deleteProduct.products_name}"? Esta ação não pode ser desfeita.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteProduct(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}
