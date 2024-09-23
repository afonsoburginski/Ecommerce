// src/contexts/Providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/toast';
import { ProductProvider } from '@/contexts/ProductContext';
import { CartProvider } from './CartContext';
import { ProductStateProvider } from './ProductStateContext';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <ToastProvider>
        <CartProvider>
          <ProductProvider>
            <ProductStateProvider>
              {children}
            </ProductStateProvider>
          </ProductProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
