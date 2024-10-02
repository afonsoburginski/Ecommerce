import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React from "react";

const colorOptions = [
  { label: "Red", value: "red", color: "#FF5630" },
  { label: "Orange", value: "orange", color: "#FF8B00" },
  { label: "Yellow", value: "yellow", color: "#FFC400" },
  { label: "Green", value: "green", color: "#36B37E" },
  { label: "Blue", value: "blue", color: "#0065FF" },
  { label: "Purple", value: "purple", color: "#6554C0" },
  { label: "Pink", value: "pink", color: "#FF69B4" },
  { label: "Brown", value: "brown", color: "#8B4513" },
  { label: "Black", value: "black", color: "#000000" },
  { label: "White", value: "white", color: "#FFFFFF" },
  { label: "Grey", value: "grey", color: "#A9A9A9" },
  { label: "Teal", value: "teal", color: "#008080" },
  { label: "Cyan", value: "cyan", color: "#00FFFF" },
  { label: "Magenta", value: "magenta", color: "#FF00FF" },
  { label: "Lime", value: "lime", color: "#00FF00" },
  { label: "Indigo", value: "indigo", color: "#4B0082" },
];

interface ProductTableProps {
  variants: Variant[];
  handleVariantChange: (index: number, field: keyof Variant, value: any) => void;
  handleAddVariant: () => void;
  handleRemoveVariant: (index: number) => void;
}

interface Variant {
  sku: string;
  stock: number;
  size: string;
  color: string;
}

export default function ProductTable({
  variants,
  handleVariantChange,
  handleAddVariant,
  handleRemoveVariant,
}: ProductTableProps) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Variações do produto</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">SKU</TableHead>
            <TableHead className="w-24">Estoque</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead className="w-64">Cor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(variants) && variants.length > 0 ? (
            variants.map((variant, index) => (
              <TableRow key={index}>
                <TableCell className="p-1">
                  <Input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                    className="w-28"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))}
                    className="w-28"
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="text"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                    className="w-72"
                  />
                </TableCell>
                <TableCell className="w-64 p-1">
                  <Select
                    value={variant.color}
                    onValueChange={(value) => handleVariantChange(index, "color", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma cor" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <span
                            className="inline-block w-4 h-4 mr-2 rounded-full"
                            style={{ backgroundColor: color.color }}
                          ></span>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-1">
                  <Button variant="outline" onClick={() => handleRemoveVariant(index)}>
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>Nenhuma variante disponível</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-2">
        <Button variant="outline" onClick={handleAddVariant}>
          <PlusCircle className="h-4 w-4" /> Adicionar
        </Button>
      </div>
    </>
  );
}
