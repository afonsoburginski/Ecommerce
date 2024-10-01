// app/api/orders/sales/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface DailySales {
  date: string;
  total: number;
  transactionsCount: number;
}

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: firstDay,
          lte: lastDay,
        },
        status: 'PAID',
      },
      include: {
        orderItems: true,
      },
    });

    const salesMap: { [key: string]: { total: number; transactionsCount: number } } = {};

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];

      if (!salesMap[date]) {
        salesMap[date] = { total: 0, transactionsCount: 0 };
      }

      const orderTotal = order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      salesMap[date].total += orderTotal;
      salesMap[date].transactionsCount += 1;
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailySales: DailySales[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      if (salesMap[date]) {
        dailySales.push({
          date,
          total: parseFloat(salesMap[date].total.toFixed(2)),
          transactionsCount: salesMap[date].transactionsCount,
        });
      } else {
        dailySales.push({
          date,
          total: 0,
          transactionsCount: 0,
        });
      }
    }

    return NextResponse.json(dailySales);
  } catch (error: any) {
    console.error('Erro ao buscar vendas diárias:', error);
    return NextResponse.json({ error: 'Erro ao buscar vendas diárias', detalhes: error.message }, { status: 500 });
  }
}
