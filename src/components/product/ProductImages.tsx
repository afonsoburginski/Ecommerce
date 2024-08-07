import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Upload } from "lucide-react";

interface ProductImagesProps {
  productImages?: string[];
}

export default function ProductImages({ productImages = ["/placeholder.png"] }: ProductImagesProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Image
            alt="Product image"
            className="aspect-square w-full rounded-md object-cover"
            height="300"
            src={productImages[0] ?? "/placeholder.png"}
            width="300"
          />
          <div className="grid grid-cols-3 gap-2">
            {productImages.map((image, index) => (
              <button key={index}>
                <Image
                  alt={`Product image ${index + 1}`}
                  className="aspect-square w-full rounded-md object-cover"
                  height="84"
                  src={image ?? "/placeholder.png"}
                  width="84"
                />
              </button>
            ))}
            <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Upload</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
