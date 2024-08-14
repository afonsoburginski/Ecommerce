// app/api/products/top-sellers/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const topSellingProducts = await prisma.product.findMany({
      take: 5,
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(topSellingProducts, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao buscar os produtos mais vendidos:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Erro ao buscar os produtos mais vendidos', details: error.message },
      { status: 500 }
    );
  }
}
