// app/products/NewProduct/page.tsx
'use client';

import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";
import ProductForm from "@/components/product/ProductForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define the structure for a new product
interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  categoryId: number | null;
  categories: number[];
  tags: number[];
  images: string[];
  variants: Variant[];
}

interface Variant {
  sku: string;
  stock: number;
  price: number;
  size: string;
}

export default function NewProduct() {
  const router = useRouter();
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

  // Initialize the product data with default values
  const [productData, setProductData] = useState<Product>({
    name: "New Product",
    description: "",
    price: 0,
    stock: 0,
    status: "DRAFT",
    categoryId: null,
    categories: [],
    tags: [],
    images: [],
    variants: [], // Initialize with an empty array for variants
  });

  const handleSaveProduct = async (productData: Product) => {
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
      product={productData} // Pass the initialized product data
      categories={categories}
      tags={tags}
      statuses={["DRAFT", "ACTIVE", "ARCHIVED"]}
      onSave={handleSaveProduct}
    />
  );
}
