import useSWR from 'swr';

interface UseProductDataResult {
  product: Product | null;
  products: Product[];
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  mutateProducts: () => void;
  mutateCategories: () => void;
  mutateTags: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useProductData = (productId?: string): UseProductDataResult => {
  const { data: productsData, error: productsError, mutate: mutateProducts } = useSWR('/api/products', fetcher);
  const { data: categoriesData, error: categoriesError, mutate: mutateCategories } = useSWR('/api/categories', fetcher);
  const { data: tagsData, error: tagsError, mutate: mutateTags } = useSWR('/api/tags', fetcher);

  const product = productId ? productsData?.find((p: Product) => p.id === Number(productId)) || null : null;

  const isLoading = !productsData || !categoriesData || !tagsData;
  const error = productsError || categoriesError || tagsError;

  return {
    product,
    products: productsData || [],
    categories: categoriesData || [],
    tags: tagsData || [],
    isLoading,
    error,
    mutateProducts,
    mutateCategories,
    mutateTags,
  };
};
