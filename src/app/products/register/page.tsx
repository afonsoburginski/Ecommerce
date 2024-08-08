// app/products/NewProduct/page.tsx
'use client';

import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";
import ProductForm from "@/components/product/ProductForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const [productData, setProductData] = useState<Product>({
    name: "New Product",
    description: "",
    price: 0,
    stock: 0,
    status: "ACTIVE",
    categoryId: null,
    categories: [],
    tags: [],
    images: [],
    variants: [],
  });

  const handleSaveProduct = async (productData: Product) => {
    try {
      await mutate("/products", "POST", productData);
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
      product={productData}
      categories={categories}
      tags={tags}
      statuses={["ACTIVE", "DRAFT", "ARCHIVED"]}
      onSave={handleSaveProduct}
    />
  );
}
