// components/product/ProductRoot.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetFooter, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import { useProductForm } from "@/hooks/useProductForm";

export default function ProductRoot() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Estado para controlar o painel de visualização
  const {
    details,
    handleImageSelect,
    handleDetailsChange,
    handleSave,
    variants,
    handleVariantChange,
    handleAddVariant,
    handleRemoveVariant,
  } = useProductForm();

  // Define a largura adicional quando a visualização está aberta
  const sheetAdditionalClass = isPreviewOpen ? "max-w-6xl" : "max-w-4xl";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Adicionar Produto</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent
        additionalClass={sheetAdditionalClass}
        className="flex flex-col h-full" // Removido padding geral
      >
        {/* SheetHeader Posicionado no Topo */}
        <SheetHeader>
          <div className="flex flex-row items-center justify-between">
            <SheetTitle>Adicionar Produto</SheetTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            >
              {isPreviewOpen ? "Fechar Visualização" : "Visualização"}
            </Button>
          </div>
        </SheetHeader>

        {/* Conteúdo Principal e Segunda Coluna */}
        <div className="flex flex-row flex-1 mt-4">
          {/* Conteúdo Principal */}
          <div 
            className={`flex flex-col flex-1 transition-all duration-500 ease-in-out ${isPreviewOpen ? "w-2/3 border-r border-gray-300 pr-4" : "w-full pr-4"}`} // Adicionado pr-4
          >
            <div className="flex-1 overflow-y-auto">
              <ProductForm
                details={details}
                handleDetailsChange={handleDetailsChange}
                handleImageSelect={handleImageSelect}
              />
              <ProductTable
                variants={variants}
                handleVariantChange={handleVariantChange}
                handleAddVariant={handleAddVariant}
                handleRemoveVariant={handleRemoveVariant}
              />
            </div>
            {/* SheetFooter Alinhado com Conteúdo Principal */}
            <SheetFooter className="mt-4">
              <Button variant="default" size="sm" onClick={handleSave}>
                Salvar Produto
              </Button>
            </SheetFooter>
          </div>

          {/* Segunda Coluna: Visualização */}
          {isPreviewOpen && (
            <div className="w-1/3 h-full bg-gray-100 transition-all duration-500 ease-in-out">
              {/* Opcional: Adicionar padding interno apenas ao conteúdo da visualização */}
              <div className="p-2">
                <h2 className="text-lg font-semibold">Visualização do Produto</h2>
                <p>Conteúdo de visualização será exibido aqui futuramente.</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
