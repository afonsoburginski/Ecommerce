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
  status: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  orderItems: OrderItem[];
  transactionId: string;
  paymentMethod: string; // Incluindo o campo paymentMethod para capturar os últimos 4 dígitos
}

interface FormattedOrder {
  id: number;
  amount: number;
  status: string;
  email: string;
  customer: string;
  phone: string;
  address: string;
  date: string;
  transactionId: string;
  paymentMethod: string;
  orderItems: OrderItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFetchTransactions() {
  const { data, error, mutate } = useSWR<Order[]>('/api/orders', fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 10000,
  });

  const formattedData: FormattedOrder[] = data?.map(order => ({
    id: order.id,
    amount: order.total,
    status: order.status,
    email: order.user.email,
    customer: order.user.name,
    phone: order.user.phone,
    address: order.user.address,
    date: new Date(order.createdAt).toLocaleDateString(),
    transactionId: order.transactionId,
    paymentMethod: order.paymentMethod,
    orderItems: order.orderItems,
  })) || [];

  return {
    orders: formattedData,
    loading: !data && !error,
    error: error?.message || null,
    mutate,
  };
}
