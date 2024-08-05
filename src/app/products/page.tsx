"use client";

import { useState } from "react";
import ProductTable from "@/components/ProductTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Products() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <ProductTable status="active" />
            </TabsContent>
            <TabsContent value="archived">
              <ProductTable status="archived" />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
