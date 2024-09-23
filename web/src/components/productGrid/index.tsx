// components/productGrid/index.tsx
'use client'; // Garantir que o componente é client-side

import React from 'react';
import { useRouter } from 'next/navigation'; // Router client-side
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useProductContext } from '@/contexts/ProductContext'; // Utilizando ProductContext para dados

export const ProductGrid = () => {
  const router = useRouter(); // Navegação client-side
  const { products = [], topSellers = [], isLoading, isError } = useProductContext(); // Usando dados do contexto

  if (isLoading) return <p>Carregando produtos...</p>;
  if (isError) return <p>Erro ao carregar produtos.</p>;

  const destaqueProducts = Array.isArray(products) ? products.slice(0, 8) : [];
  const novidadesProducts = Array.isArray(products) ? products.slice(16, 24) : [];

  const handleProductClick = (id: number) => {
    router.push(`/products/${id}`); // Navegação para a página de detalhes do produto
  };

  return (
    <div className="mt-8 mx-auto max-w-[1320px]">
      <h2 className="text-2xl font-semibold text-center mb-6">Nossos produtos</h2>
      <Tabs defaultValue="destaque" className="w-full bg-transparent">
        <TabsList className="flex justify-center mb-6 bg-transparent">
          <TabsTrigger value="destaque">Destaque</TabsTrigger>
          <TabsTrigger value="maisVendidos">Mais Vendidos</TabsTrigger>
          <TabsTrigger value="novidades">Novidades</TabsTrigger>
        </TabsList>

        {/* Produtos em Destaque */}
        <TabsContent value="destaque">
          <div className="grid gap-6 md:grid-cols-4">
            {destaqueProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex flex-col items-center transition-opacity duration-300 cursor-pointer hover:opacity-90 active:opacity-75" 
                onClick={() => handleProductClick(product.id)}
              >
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
                    <p className="text-primary font-bold">R$ {product.price?.toFixed(2)}</p>
                  </div>
                  <Button variant="outline" size="icon" className="flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Produtos Mais Vendidos */}
        <TabsContent value="maisVendidos">
          <div className="grid gap-6 md:grid-cols-4">
            {topSellers.length > 0 ? (
              topSellers.map((product) => (
                <div 
                  key={product.id} 
                  className="flex flex-col items-center transition-opacity duration-300 cursor-pointer hover:opacity-90 active:opacity-75" 
                  onClick={() => handleProductClick(product.id)}
                >
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
                      <p className="text-primary font-bold">R$ {product.price?.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" size="icon" className="flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum produto encontrado.</p>
            )}
          </div>
        </TabsContent>

        {/* Produtos Novidades */}
        <TabsContent value="novidades">
          <div className="grid gap-6 md:grid-cols-4">
            {novidadesProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex flex-col items-center transition-opacity duration-300 cursor-pointer hover:opacity-90 active:opacity-75" 
                onClick={() => handleProductClick(product.id)}
              >
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
                    <h3 className="text-lg font-normal">{product.name}</h3>
                    <p className="text-primary font-bold">R$ {product.price?.toFixed(2)}</p>
                  </div>
                  <Button variant="outline" size="icon" className="flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
