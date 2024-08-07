// app/products/EditProduct/[productId]/page.tsx
'use client';

import { useRouter, useParams } from "next/navigation";
import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";
import ProductForm from "@/components/product/ProductForm";

export default function EditProduct() {
  const { productId } = useParams();
  const router = useRouter();

  const {
    product,
    categories,
    tags,
    isLoading: dataLoading,
    error: dataError,
  } = useProductData(productId);

  const {
    isLoading: mutationLoading,
    error: mutationError,
    mutate,
  } = useProductMutation();

  const handleSaveProduct = async (productData: any) => {
    try {
      const updatedProduct = await mutate(`/products/${productId}`, "PUT", productData);
      console.log("Product updated successfully:", updatedProduct);
      router.push("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (dataLoading || mutationLoading) return <div>Loading...</div>;
  if (dataError) return <div>Error: {dataError.message}</div>;
  if (mutationError) return <div>Error: {mutationError}</div>;

  return (
    product && (
      <ProductForm
        product={product}
        categories={categories}
        tags={tags}
        statuses={["DRAFT", "ACTIVE", "ARCHIVED"]}
        onSave={handleSaveProduct}
      />
    )
  );
}
