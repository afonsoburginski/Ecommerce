import { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductCategoryProps {
  categories: Category[];
  tags: Tag[];
  productData: Product;
  setProductData: Dispatch<SetStateAction<Product>>;
}

export default function ProductCategory({ categories, tags, productData, setProductData }: ProductCategoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) =>
                setProductData({ ...productData, categoryId: Number(value) })
              }
              value={productData.categoryId?.toString() || ""}
            >
              <SelectTrigger
                id="category"
                aria-label="Select category"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 && categories.map((category) => (
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
          <div className="grid gap-3">
            <Label htmlFor="tags">Tags</Label>
            <Select
              onValueChange={(value) =>
                setProductData({
                  ...productData,
                  tags: [...productData.tags, { id: Number(value), name: tags.find(tag => tag.id === Number(value))?.name || "" }]
                })
              }
              multiple
            >
              <SelectTrigger id="tags" aria-label="Select tags">
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent>
                {tags.length > 0 && tags.map((tag) => (
                  <SelectItem
                    key={tag.id}
                    value={tag.id.toString()}
                  >
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
