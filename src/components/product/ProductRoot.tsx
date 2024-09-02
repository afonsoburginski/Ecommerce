"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/services/supabaseStorage";
import { useToast } from "@/components/ui/use-toast";
import { ProductProvider } from "@/contexts/ProductContext";

interface ProductRootProps {
  product?: Product;
  categories: Category[];
  tags: Tag[];
  statuses: string[];
  colors?: Color[];
  children: React.ReactNode;
}

export default function ProductRoot({
  product,
  categories,
  tags,
  statuses,
  colors,
  children,
}: ProductRootProps) {
  const [productData, setProductData] = useState<Product>({
    name: product?.name || "New Product",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || "ACTIVE",
    categoryId: product?.categoryId || null,
    categories: product?.categories?.map((category) => category.id) || [],
    tags: product?.tags?.map((tag) => tag.id) || [],
    images: product?.images || [],
    variants: product?.variants || [],
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
  const { toast } = useToast();

  const handleSaveProduct = async () => {
    const uploadedImages: string[] = [];
    for (const image of productData.images) {
      const publicUrl = await uploadImage(image as File);
      if (publicUrl) {
        uploadedImages.push(publicUrl);
      }
    }

    const updatedProductData = {
      ...productData,
      images: uploadedImages,
    };

    try {
      await createProduct(updatedProductData);
      toast({
        title: "Success",
        description: `Product ${updatedProductData.name} was saved successfully.`,
      });
      router.push("/products");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save product ${updatedProductData.name}.`,
      });
    }
  };

  const handleImagesChange = (images: File[]) => {
    setProductData((prev) => ({ ...prev, images }));
  };

  const handleTagSelection = (tagId: string) => {
    const id = Number(tagId);
    if (!productData.tags.includes(id)) {
      setProductData({ ...productData, tags: [...productData.tags, id] });
    }
  };

  const handleCategorySelection = (categoryId: string) => {
    const id = Number(categoryId);
    if (!productData.categories.includes(id)) {
      setProductData({ ...productData, categories: [...productData.categories, id] });
    }
  };

  const handleRemoveCategory = (categoryId: number) => {
    setProductData({
      ...productData,
      categories: productData.categories.filter((id) => id !== categoryId),
    });
  };

  const handleRemoveTag = (tagId: number) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((id) => id !== tagId),
    });
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleAddVariant = () => {
    const newVariant: Variant = { sku: "", stock: 0, size: "", color: "" };
    setProductData({
      ...productData,
      variants: [...(productData.variants || []), newVariant],
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ProductProvider
      value={{
        productData,
        setProductData,
        handleSaveProduct,
        handleImagesChange,
        handleTagSelection,
        handleCategorySelection,
        handleRemoveCategory,
        handleRemoveTag,
        handleVariantChange,
        handleAddVariant,
        categories,
        tags,
        statuses,
        colors,
      }}
    >
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
              {children}
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
    </ProductProvider>
  );
}

function createProduct(updatedProductData: any) {
  console.log("Produto criado:", updatedProductData);
}