// src/contexts/ProductContext.tsx
"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { useProductsData } from "@/hooks/useProducts";

const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { products, isLoading, isError } = useProductsData();

  return (
    <ProductContext.Provider value={{ products, isLoading, isError }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
