// hooks/useFetchTransactions.ts
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
  transactionStatus: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFetchTransactions() {
  const { data, error, mutate } = useSWR<Order[]>('/api/orders', fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,   // Revalida ao focar na página
    revalidateOnReconnect: true, // Revalida ao reconectar
    refreshInterval: 10000,    // Atualiza a cada 10 segundos
  });

  return {
    orders: data || [],
    loading: !data && !error,
    error: error?.message || null,
    mutate, // Expõe a função mutate para forçar a revalidação manualmente
  };
}
