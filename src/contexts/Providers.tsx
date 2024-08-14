// src/app/providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { StripeTransactionsProvider } from './StripeTransactionsContext';
import { ProductProvider } from './ProductContext';
import { CustomerProvider } from './CustomerContext';
import { ToastProvider } from '@/components/ui/toast';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <StripeTransactionsProvider>
        <ProductProvider>
          <CustomerProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CustomerProvider>
        </ProductProvider>
      </StripeTransactionsProvider>
    </ThemeProvider>
  );
};
