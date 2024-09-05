'use client';

import Product from "@/components/product";

export default function NewProduct() {
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Product />
        </main>
      </div>
    </div>
  );
}
