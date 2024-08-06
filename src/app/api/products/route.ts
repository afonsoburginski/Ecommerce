// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handler para obter todos os produtos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        tags: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Erro Interno do Servidor', details: error.message },
      { status: 500 }
    );
  }
}
