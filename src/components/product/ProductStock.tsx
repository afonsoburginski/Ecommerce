// src/components/product/ProductStock.tsx

import { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import ColorSelect from "@/components/ColorSelect";

interface Variant {
  sku: string;
  stock: number;
  size?: string;
  color?: string;
}

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  categoryId: number | null;
  categories: number[];
  tags: number[];
  images: string[];
  variants: Variant[];
}

interface ProductStockProps {
  productData: Product;
  setProductData: Dispatch<SetStateAction<Product>>;
}

export default function ProductStock({
  productData,
  setProductData,
}: ProductStockProps) {
  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock</CardTitle>
        <CardDescription>Manage stock, sizes, and colors.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">SKU</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-[100px]">Size</TableHead>
              <TableHead className="w-[300px]">Color</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(productData.variants || []).map((variant, index) => (
              <TableRow key={index}>
                <TableCell className="font-semibold">
                  <Input
                    type="text"
                    className="w-full"
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(index, "sku", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Label htmlFor={`stock-${index}`} className="sr-only">
                    Stock
                  </Label>
                  <Input
                    id={`stock-${index}`}
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(index, "stock", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    className="w-full"
                    value={variant.size}
                    onChange={(e) =>
                      handleVariantChange(index, "size", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <ColorSelect
                    value={variant.color || ""}
                    onChange={(value) => handleVariantChange(index, "color", value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1"
          onClick={handleAddVariant}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Variant
        </Button>
      </CardFooter>
    </Card>
  );
}
