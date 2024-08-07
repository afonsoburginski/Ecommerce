// src/components/product/ProductForm.tsx

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductDetails from "@/components/product/ProductDetails";
import ProductStock from "@/components/product/ProductStock";
import ProductCategory from "@/components/product/ProductCategory";
import ProductStatus from "@/components/product/ProductStatus";
import ProductImages from "@/components/product/ProductImages";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  tags: Tag[];
  statuses: string[];
  colors: Color[];
  onSave: (productData: any) => Promise<void>;
}

export default function ProductForm({
  product,
  categories,
  tags,
  statuses,
  colors,
  onSave,
}: ProductFormProps) {
  const [productData, setProductData] = useState<Product>({
    name: product?.name || "New Product",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || "DRAFT",
    categoryId: product?.categoryId || null,
    categories: product?.categories?.map((category) => category.id) || [],
    tags: product?.tags?.map((tag) => tag.id) || [],
    images: product?.images || [],
    variants: product?.variants || [], // Initialize variants
  });

  useEffect(() => {
    if (product) {
      setProductData({
        ...product,
        categories: product.categories?.map((category) => category.id) || [],
        tags: product.tags?.map((tag) => tag.id) || [],
        variants: product.variants || [],
      });
    }
  }, [product]);

  const router = useRouter();

  const handleSaveProduct = async () => {
    if (productData) {
      await onSave(productData);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {productData.name}
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                In stock
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm" onClick={handleSaveProduct}>
                  Save Product
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <ProductDetails
                  productData={productData}
                  setProductData={setProductData}
                />
                <ProductStock
                  productData={productData}
                  setProductData={setProductData}
                  colors={colors} // Pass colors to ProductStock
                />
                <ProductCategory
                  categories={categories}
                  tags={tags}
                  productData={productData}
                  setProductData={setProductData}
                />
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <ProductStatus
                  statuses={statuses}
                  productData={productData}
                  setProductData={setProductData}
                />
                <ProductImages />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" onClick={handleSaveProduct}>
                Save Product
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
