import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useState } from "react";

interface ProductImagesProps {
  productImages?: string[];
  onImagesChange?: (images: string[]) => void;
}

export default function ProductImages({ productImages = [], onImagesChange }: ProductImagesProps) {
  const [images, setImages] = useState<string[]>(productImages);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      const updatedImages = [...images, ...uploadedImages];
      setImages(updatedImages);
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (onImagesChange) {
      onImagesChange(updatedImages);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>Upload and manage product images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {images.length > 0 && (
            <Image
              alt="Product image"
              className="aspect-square w-full rounded-md object-cover"
              height="300"
              src={images[0] ?? "/placeholder.png"}
              width="300"
            />
          )}
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  alt={`Product image ${index + 1}`}
                  className="aspect-square w-full rounded-md object-cover"
                  height="84"
                  src={image ?? "/placeholder.png"}
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
