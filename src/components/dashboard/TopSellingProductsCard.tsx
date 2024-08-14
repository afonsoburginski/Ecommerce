import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TopSellingProductsCard() {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    async function fetchTopSellingProducts() {
      try {
        const response = await fetch('/api/products/top-sellers');
        const data = await response.json();
        setTopSellingProducts(data);
      } catch (error) {
        console.error('Erro ao buscar os produtos mais vendidos:', error);
      }
    }

    fetchTopSellingProducts();
  }, []);

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {topSellingProducts.map((product, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`/path/to/product/images/${product.id}.png`} alt={product.name} />
              <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {product.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {product.orderItems.length} vendidos
              </p>
            </div>
            <Badge variant="success">{`R$${product.price.toFixed(2)}`}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
