// src/app/products/EditProduct/[productId]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";
import ProductForm from "@/components/product/ProductForm";

export default function EditProduct() {
  const { productId } = useParams();
  const router = useRouter();

  const { product, categories, tags, isLoading, error } = useProductData(productId);
  const { updateProduct } = useProductMutation();

  const handleSaveProduct = async (productData: Product) => {
    try {
      // Pass the entire product object including the ID
      await updateProduct({ ...productData, id: Number(productId) });
      router.push("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product data.</div>;

  return (
    <ProductForm
      product={product}
      categories={categories}
      tags={tags}
      statuses={["ACTIVE", "DRAFT", "ARCHIVED"]}
      onSave={handleSaveProduct}
    />
  );
}
