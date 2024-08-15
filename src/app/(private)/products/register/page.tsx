// app/products/register/page.tsx
'use client';

import ProductForm from "@/components/product/ProductForm";
import { useProductData } from "@/hooks/useProductData";

export default function NewProduct() {
  const { categories, tags, error: dataError } = useProductData();

  if (dataError) return <div>Error: {dataError.message}</div>;

  return (
    <ProductForm
      categories={categories}
      tags={tags}
      statuses={["ACTIVE", "DRAFT", "ARCHIVED"]}
    />
  );
}
