// src/contexts/ProductContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useProductData } from '@/hooks/useProductData';

interface ProductContextType {
  products: any[];
  topSellers: any[];
  tags: any[];
  categories: any[];
  isError: boolean;
  isLoading: boolean;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { products, topSellers, tags, categories, isError, isLoading } = useProductData();

  return (
    <ProductContext.Provider value={{ products, topSellers, tags, categories, isError, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
