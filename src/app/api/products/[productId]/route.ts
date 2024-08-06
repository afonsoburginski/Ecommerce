// src/app/api/products/[productId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
      include: {
        categories: true,
        tags: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch statuses (assuming you have a table or logic to get available statuses)
    const statuses = ['ACTIVE', 'DRAFT', 'ARCHIVED'];

    return NextResponse.json({ product, statuses }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar produto:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Erro Interno do Servidor', details: error.message },
      { status: 500 }
    );
  }
}
