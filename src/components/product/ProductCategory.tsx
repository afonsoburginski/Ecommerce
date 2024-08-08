"use client";

import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProductCategoryProps {
  categories: Category[];
  tags: Tag[];
  productData: Product;
  setProductData: Dispatch<SetStateAction<Product>>;
}

export default function ProductCategory({
  categories,
  tags,
  productData,
  setProductData,
}: ProductCategoryProps) {
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
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 grid gap-3">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2">
              <Select onValueChange={handleTagSelection}>
                <SelectTrigger id="tags" aria-label="Select tags">
                  <SelectValue placeholder="Select tags" />
                </SelectTrigger>
                <SelectContent>
                  {tags.length > 0 &&
                    tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 grid gap-3 border-l pl-4">
            <div className="flex items-center gap-2">
              <Label className="mr-2">Categories:</Label>
              {productData.categories.map((categoryId) => {
                const category = categories.find((category) => category.id === categoryId);
                return (
                  category && (
                    <Badge key={category.id} variant="default" className="flex items-center gap-1">
                      {category.name}
                      <X
                        className="cursor-pointer"
                        size={16}
                        onClick={() => handleRemoveCategory(category.id)}
                      />
                    </Badge>
                  )
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <Label className="mr-2">Tags:</Label>
              {productData.tags.map((tagId) => {
                const tag = tags.find((tag) => tag.id === tagId);
                return (
                  tag && (
                    <Badge key={tag.id} variant="default" className="flex items-center gap-1">
                      {tag.name}
                      <X
                        className="cursor-pointer"
                        size={16}
                        onClick={() => handleRemoveTag(tag.id)}
                      />
                    </Badge>
                  )
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
