// components/DataTable/useFetchTransactions.ts

import { useEffect, useState } from 'react';
import { Payment } from './Payment';

export function useFetchTransactions() {
  const [transactions, setTransactions] = useState<Payment[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        console.log("Starting fetch for Stripe transactions...");
        
        const response = await fetch('/api/stripe');
        console.log("Fetch response received:", response);

        const data = await response.json();
        console.log("Parsed JSON data:", data);

        if (Array.isArray(data)) {
          const formattedData = data.map((txn: any) => {
            console.log("Processing transaction:", txn);
            return {
              id: txn.id,
              amount: txn.amount,
              currency: txn.currency,
              status: txn.status,
              description: txn.description,
              customer: txn.customer,
              email: txn.email,
              date: txn.date,
            };
          });

          console.log("Formatted transactions:", formattedData);
          setTransactions(formattedData);
        } else {
          console.log("No transactions found.");
          setTransactions([]);
        }
      } catch (err) {
        console.error('Error fetching Stripe transactions:', err);
        setTransactions([]);
      }
    }

    fetchTransactions();
  }, []);

  return transactions;
}
