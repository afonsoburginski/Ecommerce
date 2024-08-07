// src/hooks/useProductMutation.ts
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface UseProductMutationResult {
  isLoading: boolean;
  error: string | null;
  mutate: (endpoint: string, method: "POST" | "PUT", data: any) => Promise<any>;
}

export const useProductMutation = (): UseProductMutationResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      console.error(`Error during ${method}:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, mutate };
};
