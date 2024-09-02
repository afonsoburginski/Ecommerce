"use client";

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

export default function ProductStock({
  productData,
  handleVariantChange,
  handleAddVariant,
  colors,
}: {
  productData: Product;
  handleVariantChange: (index: number, field: keyof Variant, value: string | number) => void;
  handleAddVariant: () => void;
  colors: Color[];
}) {
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
            {productData?.variants?.length > 0 ? (
              productData.variants.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold">
                    <Input
                      type="text"
                      className="w-full"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
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
                      onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      className="w-full"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <ColorSelect
                      value={variant.color || ""}
                      onChange={(value) => handleVariantChange(index, "color", value)}
                      colors={colors}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No variants available.
                </TableCell>
              </TableRow>
            )}
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
