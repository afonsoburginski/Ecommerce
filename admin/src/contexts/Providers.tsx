// src/contexts/providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { TransactionsProvider } from './TransactionsContext';
import { ProductProvider } from './ProductContext';
import { CustomerProvider } from './CustomerContext';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/contexts/AuthContext';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        <TransactionsProvider>
          <ProductProvider>
            <CustomerProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CustomerProvider>
          </ProductProvider>
        </TransactionsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
