"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function ProductCategory({
  categories = [],
  productData = {},
  handleCategorySelection,
  handleRemoveCategory,
}: {
  categories: Category[];
  productData: Product;
  handleCategorySelection: (categoryId: string) => void;
  handleRemoveCategory: (categoryId: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 grid gap-3">
            <Label htmlFor="category">Category</Label>
            <div className="flex items-center gap-2">
              <Select onValueChange={handleCategorySelection}>
                <SelectTrigger id="category" aria-label="Select category">
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No categories available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 grid gap-3 border-l pl-4">
            <div className="flex items-center gap-2">
              <Label className="mr-2">Categories:</Label>
              {Array.isArray(productData.categories) && productData.categories.length > 0 ? (
                productData.categories.map((categoryId) => {
                  const category = categories.find((category) => category.id === categoryId);
                  return (
                    category && (
                      <Badge key={category.id} variant="default" className="flex items-center gap-1">
                        {category.name}
                        <X className="cursor-pointer" size={16} onClick={() => handleRemoveCategory(category.id)} />
                      </Badge>
                    )
                  );
                })
              ) : (
                <p>No categories selected</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
