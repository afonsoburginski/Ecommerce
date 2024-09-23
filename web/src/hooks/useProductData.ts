// src/hooks/useProductData.ts
import useSWR from 'swr';

export function useProductData() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: products, error: productsError } = useSWR('/api/products', fetcher);
  const { data: topSellers, error: topSellersError } = useSWR('/api/products/top-sellers', fetcher);
  const { data: tags, error: tagsError } = useSWR('/api/tags', fetcher);
  const { data: categories, error: categoriesError } = useSWR('/api/categories', fetcher);

  const isLoading = !products || !topSellers || !tags || !categories;
  const isError = productsError || topSellersError || tagsError || categoriesError;

  return {
    products,
    topSellers,
    tags,
    categories,
    isError,
    isLoading,
  };
}
