import { useState, useEffect } from "react";

interface UseProductDataResult {
  product: Product | null;
  products: Product[];
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
}

export const useProductData = (productId?: string): UseProductDataResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [categoriesResponse, tagsResponse, productsResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
          fetch("/api/products"),
        ]);

        if (!categoriesResponse.ok || !tagsResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to fetch categories, tags, or products");
        }

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();
        const productsData = await productsResponse.json();

        setCategories(categoriesData);
        setTags(tagsData);
        setProducts(productsData);

        if (productId) {
          const productData = productsData.find((p: Product) => p.id === Number(productId));
          if (!productData) {
            throw new Error("Product not found");
          }
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
    products,
    categories,
    tags,
    isLoading,
    error,
  };
};
