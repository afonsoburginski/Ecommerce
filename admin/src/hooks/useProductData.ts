import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useProductData = (): UseProductDataResult => {
  const { data: topSellingProducts, error: topSellingProductsError, mutate: mutateTopSellingProducts } = useSWR('/api/products/top-sellers', fetcher);
  const { data: productsData, error: productsError, mutate: mutateProducts } = useSWR('/api/products', fetcher);
  const { data: categoriesData, error: categoriesError, mutate: mutateCategories } = useSWR('/api/categories', fetcher);
  const { data: tagsData, error: tagsError, mutate: mutateTags } = useSWR('/api/tags', fetcher);

  const isLoading = !productsData || !categoriesData || !tagsData || !topSellingProducts;
  const error = productsError || categoriesError || tagsError || topSellingProductsError;

  return {
    product: null, // Certifique-se de retornar `product`, mesmo que seja `null`
    topSellingProducts: topSellingProducts || [],
    products: productsData || [],
    categories: categoriesData || [],
    tags: tagsData || [],
    isLoading,
    error,
    mutateProducts,
    mutateCategories,
    mutateTags,
    mutateTopSellingProducts,
  };
};
