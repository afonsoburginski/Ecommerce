"use client";

import { useProductForm } from "@/hooks/useProductForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ColorSelect from "../ColorSelect";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Componente de Input com prefixo R$
const InputWithPrefix = ({ id, value, onChange }) => {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1 text-gray-500">R$</span>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className="pl-10"
      />
    </div>
  );
};

export default function ProductRegister() {
  const {
    details,
    handleImageSelect,
    handleDetailsChange,
    handleSave,
    variants = [],
    handleVariantChange,
    handleAddVariant,
    handleRemoveVariant,
  } = useProductForm();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar Produto
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-4xl sm:max-w-2xl flex flex-col h-full px-4">
      <SheetHeader className="flex flex-row items-center justify-between w-full space-y-0 space-x-2">
        <SheetTitle>Adicionar Produto</SheetTitle>
        <Button size="sm" variant="outline">
          Visualização
        </Button>
      </SheetHeader>
        <hr className="border-gray-300" />
        <div className="flex-1 overflow-y-auto px-1">
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <Label htmlFor="name">Nome</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-gray-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nome do produto ou serviço, visível para os clientes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="name"
              value={details.name}
              onChange={(e) => handleDetailsChange("name", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <Label htmlFor="description">Descrição</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-gray-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Aparece no checkout, no portal do cliente e entre aspas.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="description"
              value={details.description}
              onChange={(e) => handleDetailsChange("description", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <Label htmlFor="imageUpload">Carregar Imagens</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-gray-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Aparece no checkout. JPEG, PNG ou WEBP com menos de 2 MB.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <label htmlFor="imageUpload" className="block w-full mt-2">
              <div className="border border-dashed border-gray-300 p-3 rounded-md text-center text-sm cursor-pointer hover:bg-gray-100">
                Carregar Imagens
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={(e) => {
                Array.from(e.target.files).forEach(file => handleImageSelect(file));
              }}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => handleDetailsChange("categoryId", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {details.categories?.length > 0 ? (
                    details.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>Nenhuma categoria disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Select onValueChange={(value) => handleDetailsChange("tagId", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma tag" />
                </SelectTrigger>
                <SelectContent>
                  {details.tags?.length > 0 ? (
                    details.tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>Nenhuma tag disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="price">Valor</Label>
            <InputWithPrefix
              id="price"
              value={details.price}
              onChange={(e) => handleDetailsChange("price", e.target.value)}
            />
          </div>

          {/* Variações do Produto */}
          <div>
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
                <PlusCircle className="h-4 w-4" /> Adicionar Variante
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-4 pt-4 flex justify-end bg-white">
          <Button variant="default" size="sm" onClick={handleSave}>
            Salvar Produto
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
