// src/lib/products.ts
import prisma from '@/lib/prisma';

export async function getProductData(productId: number) {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma should only be used on the server');
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
    return null;
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },
    },
    take: 4,
  });

  return { product, relatedProducts };
}

export async function getStockStatus(productId: number) {
  if (typeof window === 'undefined') {
    throw new Error('getStockStatus should be called on the client side');
  }

  try {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stock status');
    }

    const data = await response.json();
    return data.stock;
  } catch (error) {
    console.error('Error fetching stock status:', error);
    return false;
  }
}
