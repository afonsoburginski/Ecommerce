"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function ProductImages({
  productData = { images: [] },
  handleImagesChange,
}: {
  productData: Product;
  handleImagesChange: (images: File[]) => void;
}) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      handleImagesChange([...productData.images, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = productData.images.filter((_, i) => i !== index);
    handleImagesChange(updatedFiles);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>Upload and manage product images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {productData.images.length > 0 && (
            <Image
              alt="Product image"
              className="aspect-square w-full rounded-md object-cover"
              height="300"
              src={URL.createObjectURL(productData.images[0])}
              width="300"
            />
          )}
          <div className="grid grid-cols-3 gap-2">
            {productData.images.map((file, index) => (
              <div key={index} className="relative">
                <Image
                  alt={`Product image ${index + 1}`}
                  className="aspect-square w-full rounded-md object-cover"
                  height="84"
                  src={URL.createObjectURL(file)}
                  width="84"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  X
                </button>
              </div>
            ))}
            <label className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed cursor-pointer">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Upload</span>
              <input type="file" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
