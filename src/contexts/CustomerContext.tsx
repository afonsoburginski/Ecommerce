"use client";

import React, { createContext, ReactNode, useContext } from 'react';
import { useCustomerData } from '@/hooks/useCustomerData';

interface CustomerContextType {
  customers: any[];
  error: any;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const customerData = useCustomerData();

  return (
    <CustomerContext.Provider value={customerData}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
};
