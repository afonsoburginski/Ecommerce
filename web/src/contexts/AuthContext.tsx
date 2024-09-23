'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Verificando sessão...");
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        console.log("Usuário autenticado.");

        // Requisita dados do usuário
        const userData = await fetch(`/api/users/${data.session.user.id}`);
        const userJson = await userData.json();

        setUser({
          id: data.session.user.id,
          email: data.session.user.email!,
          name: userJson.name,
          role: userJson.role,
        });

        console.log("Dados do usuário carregados:", {
          id: data.session.user.id,
          email: data.session.user.email!,
          name: userJson.name,
          role: userJson.role,
        });

        setIsAuthenticated(true);
      } else {
        console.log("Nenhuma sessão ativa. Usuário não autenticado.");
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log("Cadastrando novo usuário...");
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role: 'CUSTOMER' }),
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar');
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setUser({ id: data.supabaseUserId, email: data.email, name: data.name, role: data.role });
      router.push('/');
    } catch (error: any) {
      console.error('Erro no cadastro:', error.message);
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Realizando login...");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(`Falha no login: ${error.message}`);
      }

      const userData = await fetch(`/api/users/${data.user.id}`);
      const userJson = await userData.json();

      setIsAuthenticated(true);
      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: userJson.name,
        role: userJson.role,
      });
      console.log("Login bem-sucedido. Usuário atualizado.");
      router.push('/');
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    console.log("Deslogando usuário...");
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    console.log("Usuário deslogado.");
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
