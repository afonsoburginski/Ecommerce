import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const loadFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  }
  return null;
};

export const useCustomerData = () => {
  const initialData = loadFromLocalStorage('customers');

  const { data: customers, mutate, error } = useSWR('/api/users', fetcher, {
    fallbackData: initialData,
    onSuccess: (data) => {
      saveToLocalStorage('customers', data);
    },
  });

  return {
    customers,
    error,
  };
};
