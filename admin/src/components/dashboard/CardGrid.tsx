'use client';

import React, { useEffect, useState } from 'react';
import { Activity, CreditCard, DollarSign, Users, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function CardGrid() {
  const [data, setData] = useState({
    totalSalesAmount: 0,
    balanceAvailable: 0,
    balancePending: 0,
    totalSalesCount: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/orders');
        const result = await response.json();
        const totalSalesAmount = result.reduce((acc: any, order: { orderItems: any[]; }) => acc + order.orderItems.reduce((itemAcc: number, item: { price: number; quantity: number; }) => itemAcc + item.price * item.quantity, 0), 0);
        const totalSalesCount = result.length;
        const totalCustomers = new Set(result.map((order: { userId: any; }) => order.userId)).size;

        setData({
          totalSalesAmount,
          balanceAvailable: 0,
          balancePending: 0,
          totalSalesCount,
          totalCustomers,
        });
      } catch (error) {
        console.error('Falha ao buscar dados:', error);
      }
    }

    fetchData();
  }, []);

  const formatCurrency = (amount: string | number | bigint) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount as number)) {
      return 'Invalid amount';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericAmount);
  };
  

  const cardData = [
    {
      title: 'Receita Total',
      icon: DollarSign,
      value: formatCurrency(data.totalSalesAmount),
      percentage: '+12.3 desde o mês passado',
      tooltip: 'Soma do valor total de vendas realizadas.',
    },
    {
      title: 'Clientes Totais',
      icon: Users,
      value: data.totalCustomers,
      tooltip: 'Número total de clientes que fizeram compras.',
    },
    {
      title: 'Vendas Totais',
      icon: CreditCard,
      value: data.totalSalesCount,
      tooltip: 'Número total de pedidos realizados.',
    },
    {
      title: 'Ativos Agora',
      icon: Activity,
      value: '573',
      percentage: '+201 na última hora',
      tooltip: 'Número de usuários ativos no momento.',
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {cardData.map((data, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {data.title}
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <data.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.value}</div>
              {data.percentage && (
                <p className="text-xs text-muted-foreground">{data.percentage}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
