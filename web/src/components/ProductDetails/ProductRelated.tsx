// src/components/ProductRelated.tsx
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useProductStateContext } from '@/contexts/ProductStateContext';

export default function ProductRelated({ relatedProducts }) {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1320px] mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">Produtos Relacionados</h2>
      <div className="grid gap-6 md:grid-cols-4">
        {relatedProducts.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="flex flex-col items-center transition-opacity duration-300 cursor-pointer hover:opacity-90 active:opacity-75">
              <Card className="w-full overflow-hidden h-[300px]">
                <div className="relative w-full h-full">
                  <Image
                    src={product.images?.[0] || 'https://placeholder.com/300'}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </Card>
              <div className="flex items-center justify-between w-full mt-2">
                <div>
                  <h3 className="text-base font-normal">{product.name}</h3>
                  <p className="text-primary font-bold">R$ {product.price.toFixed(2)}</p>
                </div>
                <Button variant="outline" size="icon" className="flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
