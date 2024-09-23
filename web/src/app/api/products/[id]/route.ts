import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number(params.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: true,
        tags: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verificação de estoque
    const isProductInStock = product.stock > 0;

    const relatedProducts = await prisma.product.findMany({
      where: {
        id: {
          not: productId,
        },
      },
      take: 4,
    });

    const response = NextResponse.json({ 
      product, 
      relatedProducts,
      stock: isProductInStock // Inclui o status de estoque na resposta
    });
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
