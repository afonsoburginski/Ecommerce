// src/components/ProductInfo.tsx
'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useProductStateContext } from '@/contexts/ProductStateContext';

export default function ProductInfo({ product }) {
  const {
    quantity,
    setQuantity,
    selectedColor,
    handleColorChange,
    selectedSize,
    handleSizeChange,
    stock,
    sku,
    availableSizes,
    productCategories,
    productTags,
    handleAddToCart,
  } = useProductStateContext();

  if (!product) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col justify-start items-start">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-xl font-bold text-primary mb-2">R$ {product.price.toFixed(2)}</p>
      <p className="text-base whitespace-pre-wrap mb-4">{product.description}</p>

      {/* Escolha da cor */}
      <div className="mb-4 flex flex-col items-start">
        <label className="text-base font-medium mb-2 block">Escolha a cor:</label>
        <ToggleGroup
          type="single"
          value={selectedColor}
          onValueChange={handleColorChange}
          className="flex gap-2 justify-start"
        >
          {Array.from(new Set(product.variants.map((variant: any) => variant.color))).map((color) => (
            <ToggleGroupItem
              key={color}
              value={color}
              disabled={!product.variants.some((variant: any) => variant.color === color)}
              className={clsx('border rounded-md px-4 py-2', {
                'bg-primary text-white': selectedColor === color,
                'bg-transparent': selectedColor !== color,
              })}
            >
              {color}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Escolha do tamanho */}
      <div className="mb-4 flex flex-col items-start">
        <label className="text-base font-medium mb-2 block">Escolha o tamanho:</label>
        <ToggleGroup
          type="single"
          value={selectedSize}
          onValueChange={handleSizeChange}
          className="flex gap-2 justify-start"
        >
          {Array.from(new Set(product.variants.map((variant: any) => variant.size))).map((size) => (
            <ToggleGroupItem
              key={size}
              value={size}
              disabled={!availableSizes.includes(size)}
              className={clsx('border rounded-md px-4 py-2', {
                'bg-primary text-white': selectedSize === size,
                'bg-transparent': selectedSize !== size,
              })}
            >
              {size}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {selectedColor && selectedSize && <p className="mt-2 text-sm">Disponível em estoque: {stock}</p>}

      {/* Quantidade e botão de adicionar ao carrinho */}
      <div className="flex items-center gap-4">
        <Input
          type="number"
          id="quantity"
          value={Math.min(quantity, stock || 1)}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min={1}
          max={stock || 1}
          className="w-24"
          disabled={stock === 0}
        />
        <Button variant="outline" className="flex items-center justify-center" onClick={handleAddToCart}>
          <ShoppingCart strokeWidth={1.5} className="mr-2 h-5 w-5" />
          Adicionar ao Carrinho
        </Button>
      </div>

      {/* Detalhes do produto */}
      <Card className="mt-6 w-full shadow-none">
        <CardHeader>
          <CardTitle>Detalhes do produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm">
              <strong>SKU:</strong> {sku}
            </p>
            <p className="text-sm">
              <strong>Categoria:</strong> {productCategories}
            </p>
          </div>
          <p className="text-sm mt-2">
            <strong>Tags:</strong> {productTags}
          </p>
        </CardContent>
      </Card>

      {/* Informações de compra segura */}
      <Card className="mt-6 w-full shadow-none">
        <CardHeader className="pb-4">
          <CardTitle>Compra segura e garantida</CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="flex justify-start">
            <Image
              src="https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/credit-cards.svg"
              alt="Formas de pagamento com cartão de crédito"
              width={300}
              height={50}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
