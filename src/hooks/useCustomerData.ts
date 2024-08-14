// src/hooks/useCustomerData.ts
import axios from 'axios';
import useSWR from 'swr';
import { useToast } from '@/components/ui/use-toast';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useCustomerData = () => {
  const { toast } = useToast();
  const { data: customers, mutate, error } = useSWR('/api/users', fetcher);

  const addCustomer = async (newCustomer: { name: string, email: string, password: string, role: string }) => {
    try {
      const response = await axios.post('/api/users', newCustomer);
      const addedCustomer = response.data;
      mutate([...customers, addedCustomer], false);
      toast({
        title: "Success",
        description: `Customer ${newCustomer.name} was added successfully.`,
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: `Failed to add customer ${newCustomer.name}.`,
        variant: "destructive",
      });
    }
  };

  const deleteCustomer = async (customerId: number) => {
    try {
      const customer = customers.find((customer: any) => customer.id === customerId);
      await axios.delete('/api/users', { data: { id: customerId } });
      mutate(customers.filter((customer: any) => customer.id !== customerId), false);
      toast({
        title: "Success",
        description: `Customer ${customer.name} was deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: `Failed to delete customer.`,
        variant: "destructive",
      });
    }
  };

  return {
    customers,
    addCustomer,
    deleteCustomer,
    error,
  };
};
