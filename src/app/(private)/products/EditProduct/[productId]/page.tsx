// src/app/products/EditProduct/[productId]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useProductData } from "@/hooks/useProductData";
import { useProductMutation } from "@/hooks/useProductMutation";
import ProductForm from "@/components/product/ProductForm";
import { useToast } from "@/components/ui/use-toast";

export default function EditProduct() {
  const { productId } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { product, categories, tags, error } = useProductData(productId);
  const { updateProduct } = useProductMutation();

  const handleSaveProduct = async (productData: Product) => {
    try {
      await updateProduct({ ...productData, id: Number(productId) });
      toast({
        title: "Success",
        description: (
          <span>
            Product <strong style={{ color: 'green' }}>{productData.name}</strong> was updated successfully.
          </span>
        ),
      });
      router.push("/products");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update product ${productData.name}.`,
      });
      console.error("Error updating product:", error);
    }
  };

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
