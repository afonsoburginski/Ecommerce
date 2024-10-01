// src/app/page.tsx
'use client';
import React from 'react';
import { CardGrid } from '@/components/dashboard/CardGrid';
import { TopSellingProductsCard } from '@/components/dashboard/TopSellingProductsCard';
import { TransactionsCard } from '@/components/dashboard/TransactionsCard';
import Chart from '@/components/dashboard/BarChart';

export default function Dashboard() {
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-6">
        <CardGrid />
        <div className="grid gap-4 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Chart />
          <TopSellingProductsCard />
          <TransactionsCard />
        </div>
      </main>
    </div>
  );
}
