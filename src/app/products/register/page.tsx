// app/products/register/page.tsx
'use client';

import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";
import ProductForm from "@/components/product/ProductForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  categoryId: number | null;
  categories: number[];
  tags: number[];
  images: File[];
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
  const { categories, tags, error: dataError } = useProductData();
  const { error: mutationError, createProduct } = useProductMutation();
  const { toast } = useToast();

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
      await createProduct(productData);
      toast({
        title: "Success",
        description: `Product ${productData.name} was saved successfully.`,
      });
      router.push("/products");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save product ${productData.name}.`,
      });
      console.error("Error saving product:", error);
    }
  };  

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

