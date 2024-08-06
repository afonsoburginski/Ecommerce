// src/hooks/useProducts.ts
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useProductsData = () => {
  const { data, error } = useSWR<Product[]>("/api/products", fetcher);

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
