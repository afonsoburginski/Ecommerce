// app/products/NewProduct/page.tsx
'use client';

import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";
import ProductForm from "@/components/product/ProductForm";

export default function NewProduct() {
  const {
    categories,
    tags,
    isLoading: dataLoading,
    error: dataError,
  } = useProductData();

  const {
    isLoading: mutationLoading,
    error: mutationError,
    mutate,
  } = useProductMutation();

  const handleSaveProduct = async (productData: any) => {
    try {
      const newProduct = await mutate("/products", "POST", productData);
      console.log("Product saved successfully:", newProduct);
      router.push("/products");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (dataLoading || mutationLoading) return <div>Loading...</div>;
  if (dataError) return <div>Error: {dataError.message}</div>;
  if (mutationError) return <div>Error: {mutationError}</div>;

  return (
    <ProductForm
      categories={categories}
      tags={tags}
      statuses={["DRAFT", "ACTIVE", "ARCHIVED"]}
      onSave={handleSaveProduct}
    />
  );
}
