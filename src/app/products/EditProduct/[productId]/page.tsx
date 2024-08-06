// app/products/EditProduct/[productId]/page.tsx
'use client';

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";

export default function EditProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [statuses] = useState<string[]>(["DRAFT", "ACTIVE", "ARCHIVED"]);
  const { productId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const { product } = await response.json();
        setProduct(product);

        // Fetch categories and tags
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleSaveProduct = async (productData: any) => {
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

  return (
    product && (
      <ProductForm
        product={product}
        categories={categories}
        tags={tags}
        statuses={statuses}
        onSave={handleSaveProduct}
      />
    )
  );
}
