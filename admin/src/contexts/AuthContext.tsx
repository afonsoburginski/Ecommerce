// src/contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    Cookie.set('token', token);
    setIsAuthenticated(true);
    router.push('/');
  };

  const logout = () => {
    Cookie.remove('token');
    setIsAuthenticated(false);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
