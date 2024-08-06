'use client';

import { useFetchData } from "@/hooks/useFetchData";
import ProductForm from "@/components/product/ProductForm";

export default function NewProduct() {
  const [categories] = useFetchData<Category[]>("/api/categories");
  const [tags] = useFetchData<Tag[]>("/api/tags");
  const statuses = ["DRAFT", "ACTIVE", "ARCHIVED"];

  const handleSaveProduct = async (productData: Product) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Failed to save product:", errorDetails);
        throw new Error("Failed to save product");
      }

      const newProduct = await response.json();
      console.log("Product saved successfully:", newProduct);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <ProductForm
      categories={categories || []}
      tags={tags || []}
      statuses={statuses}
      onSave={handleSaveProduct}
    />
  );
}
