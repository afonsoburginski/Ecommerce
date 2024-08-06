// app/products/NewProduct/page.tsx
'use client';

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [statuses] = useState<string[]>(["DRAFT", "ACTIVE", "ARCHIVED"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        setTags(data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleSaveProduct = async (productData: any) => {
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
      categories={categories}
      tags={tags}
      statuses={statuses}
      onSave={handleSaveProduct}
    />
  );
}
