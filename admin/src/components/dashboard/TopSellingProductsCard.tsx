import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductData } from '@/hooks/useProductData';

export function TopSellingProductsCard() {
  const { topSellingProducts } = useProductData();

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {Array.isArray(topSellingProducts) && topSellingProducts.length > 0 ? (
          topSellingProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                {product.images?.length > 0 ? (
                  <AvatarImage src={product.images[0]} alt={product.name} />
                ) : (
                  <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {product.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product._count?.orderItems || 0} vendidos
                </p>
              </div>
              <Badge variant="success">{`R$${product.price.toFixed(2)}`}</Badge>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </CardContent>
    </Card>
  );
}
