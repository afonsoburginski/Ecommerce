// app/EditProduct/[productId]/page.tsx
'use client';

import { useParams } from "next/navigation";
import { useFetchData } from "@/hooks/useFetchData";
import ProductForm from "@/components/product/ProductForm";

export default function EditProduct() {
  const { productId } = useParams();
  const [product, productLoading, productError] = useFetchData<Product>(`/api/products/${productId}`);
  const [categories] = useFetchData<Category[]>("/api/categories");
  const [tags] = useFetchData<Tag[]>("/api/tags");
  const statuses = ["DRAFT", "ACTIVE", "ARCHIVED"];

  const handleSaveProduct = async (productData: Product) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Failed to update product:", errorDetails);
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      console.log("Product updated successfully:", updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (productLoading) return <div>Loading...</div>;
  if (productError) return <div>Error: {productError.message}</div>;

  return (
    product && (
      <ProductForm
        product={product}
        categories={categories || []}
        tags={tags || []}
        statuses={statuses}
        onSave={handleSaveProduct}
      />
    )
  );
}
