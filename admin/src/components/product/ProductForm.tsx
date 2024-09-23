// components/product/ProductForm.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import InputWithPrefix from "./InputWithPrefix";

export default function ProductForm({ details, handleDetailsChange, handleImageSelect }) {
  return (
    <>
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
        <Input id="name" value={details.name} onChange={(e) => handleDetailsChange("name", e.target.value)} />
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
        <Textarea id="description" value={details.description} onChange={(e) => handleDetailsChange("description", e.target.value)} />
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
          onChange={(e) => Array.from(e.target.files).forEach(file => handleImageSelect(file))}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select onValueChange={(value) => handleDetailsChange("categoryId", value)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
            <SelectContent>
              {details.categories?.length > 0 ? (
                details.categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)
              ) : (
                <SelectItem disabled>Nenhuma categoria disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Select onValueChange={(value) => handleDetailsChange("tagId", value)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Selecione uma tag" /></SelectTrigger>
            <SelectContent>
              {details.tags?.length > 0 ? (
                details.tags.map((tag) => <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>)
              ) : (
                <SelectItem disabled>Nenhuma tag disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="price">Valor</Label>
        <InputWithPrefix id="price" value={details.price} onChange={(e) => handleDetailsChange("price", e.target.value)} />
      </div>
    </>
  );
}
