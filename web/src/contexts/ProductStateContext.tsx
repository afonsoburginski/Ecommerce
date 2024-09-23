// src/contexts/ProductStateContext.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { useProductState } from '@/hooks/useProductState';

const ProductStateContext = createContext<any>(null);

export const ProductStateProvider = ({ product, children }) => {
  const productState = useProductState(product);

  return (
    <ProductStateContext.Provider value={productState}>
      {children}
    </ProductStateContext.Provider>
  );
};

export const useProductStateContext = () => {
  return useContext(ProductStateContext);
};
