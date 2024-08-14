// context/StripeTransactionsContext.tsx
'use client';
import React, { createContext, useContext } from 'react';
import useSWR from 'swr';

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
  transactionStatus: string; // Add this field
}

interface StripeTransactionsContextValue {
  orders: Order[];
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

const fetcher = async (url: string): Promise<Order[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  const data = await response.json();
  console.log('Fetched Orders:', data); // Log dos dados recebidos
  return data;
};

export const StripeTransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, error, isValidating } = useSWR<Order[]>('/api/orders', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60 * 60 * 1000,
    refreshInterval: 0,
    revalidateIfStale: true,
  });

  console.log('Orders in Context:', data); // Log dos dados no contexto

  return (
    <StripeTransactionsContext.Provider value={{ orders: data || [], loading: !data && isValidating, error: error?.message || null }}>
      {children}
    </StripeTransactionsContext.Provider>
  );
};
