// context/StripeTransactionsContext.tsx
'use client';
import React, { createContext, useContext } from 'react';
import { useFetchTransactions } from '@/hooks/useFetchTransactions';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: number;
  createdAt: string;
  total: number;
  user: {
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  transactionStatus: string;
}

interface StripeTransactionsContextValue {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshTransactions: () => void; // Função para forçar a atualização
}

const StripeTransactionsContext = createContext<StripeTransactionsContextValue | undefined>(undefined);

export const useStripeTransactions = (): StripeTransactionsContextValue => {
  const context = useContext(StripeTransactionsContext);
  if (!context) {
    throw new Error('useStripeTransactions must be used within a StripeTransactionsProvider');
  }
  return context;
};

export const StripeTransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { orders, loading, error, mutate } = useFetchTransactions();

  return (
    <StripeTransactionsContext.Provider value={{ orders, loading, error, refreshTransactions: mutate }}>
      {children}
    </StripeTransactionsContext.Provider>
  );
};
