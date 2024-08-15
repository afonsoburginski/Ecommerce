// app/products/register/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { uploadImage } from "@/services/supabaseStorage";
import ProductForm from "@/components/product/ProductForm";
import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
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
    categories: [],
    tags: [],
    images: [],
    variants: [],
  });

  const handleSaveProduct = async (productData: Product) => {
    try {
      const uploadedImages: string[] = [];
      for (const image of productData.images) {
        const publicUrl = await uploadImage(image);
        if (publicUrl) {
          uploadedImages.push(publicUrl);
        } else {
          throw new Error('Falha no upload de uma ou mais imagens.');
        }
      }
  
      if (uploadedImages.length === 0) {
        throw new Error('Nenhuma imagem foi carregada.');
      }
  
      const updatedProductData = {
        ...productData,
        images: uploadedImages,
      };
  
      await createProduct(updatedProductData);
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
