// src/app/providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { StripeTransactionsProvider } from './StripeTransactionsContext';
import { ProductProvider } from './ProductContext';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <StripeTransactionsProvider>
        <ProductProvider>
          {children}
        </ProductProvider>
      </StripeTransactionsProvider>
    </ThemeProvider>
  );
};
