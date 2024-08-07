// src/hooks/useProductMutation.ts
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface UseProductMutationResult {
  isLoading: boolean;
  error: string | null;
  mutate: (url: string, method: "POST" | "PUT", data: any) => Promise<any>;
}

export const useProductMutation = (): UseProductMutationResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (url: string, method: "POST" | "PUT", data: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance({
        url,
        method,
        data,
      });

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      console.error(`Error during ${method}:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, mutate };
};
