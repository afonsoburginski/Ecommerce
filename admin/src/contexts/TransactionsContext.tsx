'use client';
import React, { createContext, useContext } from 'react';
import { useFetchTransactions } from '@/hooks/useFetchTransactions';

interface FormattedOrder {
  id: number;
  amount: number;
  status: string;
  email: string;
  customer: string;
  date: string;
  transactionId: string;
}

interface TransactionsContextValue {
  orders: FormattedOrder[];
  loading: boolean;
  error: string | null;
  refreshTransactions: () => void;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

export const useTransactions = (): TransactionsContextValue => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { orders, loading, error, mutate } = useFetchTransactions();

  return (
    <TransactionsContext.Provider value={{ orders, loading, error, refreshTransactions: mutate }}>
      {children}
    </TransactionsContext.Provider>
  );
};
