// src/hooks/useProductMutation.ts
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface UseProductMutationResult {
  isLoading: boolean;
  error: string | null;
  createProduct: (data: any) => Promise<any>;
  updateProduct: (data: any) => Promise<any>;
}

export const useProductMutation = (): UseProductMutationResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: any) => {
    return mutate(`/products`, "POST", data);
  };

  const updateProduct = async (data: any) => {
    return mutate(`/products`, "PUT", data);
  };

  const mutate = async (endpoint: string, method: "POST" | "PUT", data: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance({
        url: endpoint,
        method,
        data,
      });

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, createProduct, updateProduct };
};
