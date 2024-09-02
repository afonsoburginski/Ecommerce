"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProductDetails({
  productData,
  setProductData,
}: {
  productData: Product;
  setProductData: (data: Product) => void;
}) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '');
    const priceValue = Number(inputValue) / 100;
    setProductData({ ...productData, price: priceValue });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData({ ...productData, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProductData({ ...productData, description: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          {productData?.name
            ? "Edit the product details below."
            : "Enter the product details below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                value={productData?.name || ""}
                onChange={handleNameChange}
              />
            </div>
            <div className="w-40">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                className="w-full"
                value={productData?.price.toFixed(2) || "0.00"}
                onChange={handlePriceChange}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productData?.description || ""}
              onChange={handleDescriptionChange}
              className="min-h-32"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
}
