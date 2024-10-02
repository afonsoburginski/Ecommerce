import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, X } from "lucide-react"; // Importa o ícone de remover
import InputWithPrefix from "./InputWithPrefix";
import Image from "next/image";
import React, { useState } from "react";

// Tipos para o ProductForm
interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface ProductDetails {
  id: number | null;
  name: string;
  price: string;
  description: string;
  categoryId: number | null;
  tagId: number | null;
}

interface ProductFormProps {
  details: ProductDetails;
  handleDetailsChange: (field: string, value: any) => void;
  handleImageSelect: (file: File, index: number | "main") => void;
  categories: Category[]; // Recebe categorias como prop
  tags: Tag[]; // Recebe tags como prop
}

export default function ProductForm({ 
  details, 
  handleDetailsChange, 
  handleImageSelect,
  categories,
  tags
}: ProductFormProps) {
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [thumbImagesUrls, setThumbImagesUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newThumbUrls: string[] = [];
    
    files.forEach((file, index) => {
      if (index === 0 && !mainImageUrl) {
        handleImageSelect(file, "main");
        setMainImageUrl(URL.createObjectURL(file));
      } else {
        handleImageSelect(file, index - 1);
        newThumbUrls.push(URL.createObjectURL(file));
      }
    });

    setThumbImagesUrls((prev) => [...prev, ...newThumbUrls]);
  };

  const removeImage = (index: number | "main") => {
    if (index === "main") {
      setMainImageUrl(null);
      handleDetailsChange("mainImage", null);
    } else {
      setThumbImagesUrls((prev) => prev.filter((_, i) => i !== index));
      handleDetailsChange("thumbImages", thumbImagesUrls.filter((_, i) => i !== index));
    }
  };

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
            <div className="flex flex-wrap justify-center gap-2">
              {mainImageUrl && (
                <div className="relative">
                  <Image 
                    src={mainImageUrl} 
                    alt="Imagem Principal" 
                    width={64} 
                    height={64}
                    className="object-cover rounded-md"
                  />
                  <button 
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    onClick={() => removeImage("main")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {thumbImagesUrls.length > 0 && thumbImagesUrls.map((thumbUrl, index) => (
                <div key={index} className="relative">
                  <Image 
                    src={thumbUrl} 
                    alt={`Miniatura ${index + 1}`} 
                    width={64} 
                    height={64}
                    className="object-cover rounded-md"
                  />
                  <button 
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {!mainImageUrl && !thumbImagesUrls.length && "Carregar Imagens"}
          </div>
        </label>
        <input
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select 
            onValueChange={(value) => handleDetailsChange("categoryId", Number(value))} // Converte string para número
            value={details.categoryId !== null ? String(details.categoryId) : undefined} // Usar undefined para placeholder
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category: Category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>Nenhuma categoria disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Select 
            onValueChange={(value) => handleDetailsChange("tagId", Number(value))} // Converte string para número
            value={details.tagId !== null ? String(details.tagId) : undefined} // Usar undefined para placeholder
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma tag" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(tags) && tags.length > 0 ? (
                tags.map((tag: Tag) => (
                  <SelectItem key={tag.id} value={String(tag.id)}>
                    {tag.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>Nenhuma tag disponível</SelectItem>
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
          placeholder="R$ 0,00" // Placeholder adicionado
        />
      </div>
    </>
  );
}
