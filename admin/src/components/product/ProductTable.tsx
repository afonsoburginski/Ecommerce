// components/product/ProductTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ColorSelect from "../ColorSelect";

export default function ProductTable({ variants, handleVariantChange, handleAddVariant, handleRemoveVariant }) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Variações do produto</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">SKU</TableHead>
            <TableHead className="w-24">Estoque</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Cor</TableHead>
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
                    className="w-20"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="text"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                    className="w-40"
                  />
                </TableCell>
                <TableCell className="w-44 p-1">
                  <ColorSelect
                    value={variant.color}
                    onChange={(value) => handleVariantChange(index, "color", value)}
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Button variant="outline" onClick={() => handleRemoveVariant(index)}>X</Button>
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
          <PlusCircle className="h-4 w-4" /> Adicionar Variante
        </Button>
      </div>
    </>
  );
}
