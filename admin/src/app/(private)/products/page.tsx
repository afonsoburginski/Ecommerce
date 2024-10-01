"use client";

import { useState } from "react";
import ProductTable from "@/components/ProductTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProductRoot } from "@/components/product";
import { Button } from "@/components/ui/button";

export default function Products() {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="ALL">Todos</TabsTrigger>
                <TabsTrigger value="ACTIVE">Ativos</TabsTrigger>
                <TabsTrigger value="ARCHIVED">Arquivados</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button onClick={handleAddProduct}>Adicionar Produto</Button>
              </div>
            </div>
            <TabsContent value="ALL">
              <ProductTable status="ALL" />
            </TabsContent>
            <TabsContent value="ACTIVE">
              <ProductTable status="ACTIVE" />
            </TabsContent>
            <TabsContent value="ARCHIVED">
              <ProductTable status="ARCHIVED" />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {isSheetOpen && (
        <ProductRoot
          product={selectedProduct}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </div>
  );
}
