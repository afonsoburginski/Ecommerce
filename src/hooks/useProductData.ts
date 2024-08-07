// src/hooks/useProductData.ts
import { useState, useEffect } from "react";

interface UseProductDataResult {
  product: Product | null;
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
}

export const useProductData = (productId?: string): UseProductDataResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchCategoriesAndTags = Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        const [categoriesResponse, tagsResponse] = await fetchCategoriesAndTags;

        if (!categoriesResponse.ok || !tagsResponse.ok) {
          throw new Error("Failed to fetch categories or tags");
        }

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        setCategories(categoriesData);
        setTags(tagsData);

        if (productId) {
          const productResponse = await fetch(`/api/products/${productId}`);
          if (!productResponse.ok) {
            throw new Error("Failed to fetch product");
          }
          const productData = await productResponse.json();
          setProduct(productData);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return {
    product,
    categories,
    tags,
    isLoading,
    error,
  };
};
