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
        const response = await fetch('/api/stripe');
        const result = await response.json();
        setData({
          totalSalesAmount: result.totalSalesAmount,
          balanceAvailable: result.balanceAvailable,
          balancePending: result.balancePending,
          totalSalesCount: result.totalSalesCount,
          totalCustomers: result.totalCustomers,
        });
      } catch (error) {
        console.error('Falha ao buscar dados:', error);
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
      title: 'Receita Total',
      icon: DollarSign,
      value: formatCurrency(data.balanceAvailable + data.balancePending),
      percentage: '+12.3 desde o mês passado',
      tooltip: 'Soma do saldo disponível e saldo pendente das vendas.',
    },
    {
      title: 'Clientes Totais',
      icon: Users,
      value: data.totalCustomers,
      tooltip: 'Número total de clientes cadastrados.',
    },
    {
      title: 'Vendas Totais',
      icon: CreditCard,
      value: formatCurrency(data.totalSalesAmount), // Valor bruto das vendas
      tooltip: 'Valor bruto acumulado de todas as vendas.',
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
