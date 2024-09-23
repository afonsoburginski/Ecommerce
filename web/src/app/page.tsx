// app/page.tsx
'use client';
import { HeroBanner } from '@/components/heroBanner';
import { InfoCards } from '@/components/infoCards';
import { ProductGrid } from '@/components/productGrid';
import { BannerImages } from '@/components/bannerImages';
import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex h-full w-full flex-col">
      <HeroBanner />
      <main className="flex flex-1 flex-col gap-4 md:gap-4 md:px-6">
        <div className="grid gap-4 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-full mb-10">
            <div className="my-32" />
            <InfoCards />
            <div className="my-32" />
            <ProductGrid />
            <div className="my-32" />
            <BannerImages />
          </div>
        </div>
      </main>
    </div>
  );
}
