// src/app/products/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductTable from "@/components/ProductTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Products() {
  const [activeTab, setActiveTab] = useState("ALL");
  const router = useRouter();

  const handleAddProduct = () => {
    router.push("/products/register");
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1" onClick={handleAddProduct}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
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
    </div>
  );
}
