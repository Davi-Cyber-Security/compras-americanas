import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const POLL_INTERVAL = 5000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await api.get('/user/profile');
      setUser(data);
      return data;
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    fetchProfile().finally(() => setLoading(false));

    pollingRef.current = setInterval(() => {
      fetchProfile();
    }, POLL_INTERVAL);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [token, fetchProfile]);

  const login = async (email: string, password: string) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string) => {
    const data = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
