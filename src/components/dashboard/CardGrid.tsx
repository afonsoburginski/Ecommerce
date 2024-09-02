// src/components/dashboard/CardGrid.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardGrid() {
  const [data, setData] = useState({
    totalSalesAmount: 0,
    balanceAvailable: 0,
    balancePending: 0,
    totalSalesCount: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/stripe');
        const result = await response.json();
        setData({
          totalSalesAmount: result.totalSalesAmount,
          balanceAvailable: result.balanceAvailable,
          balancePending: result.balancePending,
          totalSalesCount: result.totalSalesCount,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const cardData = [
    {
      title: "Total Revenue",
      icon: DollarSign,
      value: formatCurrency(data.balanceAvailable + data.balancePending),
      percentage: "+12.3 from last month",
    },
    {
      title: "Users Today",
      icon: Users,
      value: "1320",
    },
    {
      title: "Total Sales",
      icon: CreditCard,
      value: formatCurrency(data.totalSalesAmount),
    },
    {
      title: "Active Now",
      icon: Activity,
      value: "573",
      percentage: "+201 since last hour",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
      {cardData.map((data, index) => (
        <Card key={index} x-chunk={`dashboard-01-chunk-${index}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {data.title}
            </CardTitle>
            <data.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.value}</div>
            {data.percentage && (
              <p className="text-xs text-muted-foreground">
                {data.percentage}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
