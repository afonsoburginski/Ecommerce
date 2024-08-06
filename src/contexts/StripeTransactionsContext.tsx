// context/StripeTransactionsContext.tsx
'use client';
import { Payment } from '@/types/global';
import React, { createContext, useContext } from 'react';
import useSWR from 'swr';

interface StripeTransactionsContextValue {
  transactions: Payment[];
  loading: boolean;
  error: string | null;
}

const StripeTransactionsContext = createContext<StripeTransactionsContextValue | undefined>(undefined);

export const useStripeTransactions = (): StripeTransactionsContextValue => {
  const context = useContext(StripeTransactionsContext);
  if (!context) {
    throw new Error('useStripeTransactions must be used within a StripeTransactionsProvider');
  }
  return context;
};

const fetcher = async (url: string): Promise<Payment[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }
  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid data format');
  }

  return data.map((txn: any) => ({
    id: txn.id,
    amount: txn.amount,
    currency: txn.currency,
    status: txn.status,
    description: txn.description,
    customer: txn.customer,
    email: txn.email,
    date: txn.date,
    cardLast4: txn.cardLast4,
  }));
};

export const StripeTransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, error, isValidating } = useSWR<Payment[]>('/api/stripe', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60 * 60 * 1000, 
    refreshInterval: 0,
    revalidateIfStale: true,
  });

  return (
    <StripeTransactionsContext.Provider value={{ transactions: data || [], loading: !data && isValidating, error: error?.message || null }}>
      {children}
    </StripeTransactionsContext.Provider>
  );
};
