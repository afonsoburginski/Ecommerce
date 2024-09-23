// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import Product from '@/components/ProductDetails';
import prisma from '@/lib/prisma';

export default async function ProductDetailsPage({ params }) {
  const { id } = params;

  try {
    const productId = Number(id);
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: true,
        tags: true,
        variants: true,
      },
    });

    if (!product) {
      notFound();
    }

    // Buscar produtos relacionados
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: {
          not: productId,
        },
      },
      take: 4,
    });

    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <main className="flex flex-1 flex-col gap-4 md:gap-4 md:px-6 items-center justify-center">
          <Product product={product} relatedProducts={relatedProducts} />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
