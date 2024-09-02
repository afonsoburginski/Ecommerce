"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ProductCard({
  product,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  handlePurchase,
  loading,
  getSelectedVariantStock,
}) {
  return (
    <Card key={product.id}>
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={200}
            className="rounded-lg"
          />
        ) : (
          <Image
            src="/placeholder.svg"
            alt="Placeholder"
            width={300}
            height={200}
            className="rounded-lg"
          />
        )}
        <p className="mt-2 text-sm">Preço: R${product.price.toFixed(2)}</p>

        <div className="mt-4">
          <Label className="block mb-2">Escolha a cor:</Label>
          <ToggleGroup
            type="single"
            value={selectedVariant[product.id]?.color}
            onValueChange={(value) =>
              setSelectedVariant((prev) => ({
                ...prev,
                [product.id]: {
                  ...prev[product.id],
                  color: value,
                  size: null, // Reset size when a new color is selected
                },
              }))
            }
            className="flex flex-wrap gap-2 justify-start"
          >
            {Array.from(new Set(product.variants.map((variant) => variant.color))).map((color) => (
              <ToggleGroupItem key={color} value={color}>
                {color}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {selectedVariant[product.id]?.color && (
            <>
              <Label className="block mb-2 mt-4">Escolha o tamanho:</Label>
              <ToggleGroup
                type="single"
                value={selectedVariant[product.id]?.size}
                onValueChange={(value) =>
                  setSelectedVariant((prev) => ({
                    ...prev,
                    [product.id]: {
                      ...prev[product.id],
                      size: value,
                    },
                  }))
                }
                className="flex flex-wrap gap-2 justify-start"
              >
                {product.variants
                  .filter((variant) => variant.color === selectedVariant[product.id]?.color)
                  .map((variant) => (
                    <ToggleGroupItem key={variant.sku} value={variant.size}>
                      {variant.size}
                    </ToggleGroupItem>
                  ))}
              </ToggleGroup>
            </>
          )}

          <p className="mt-2 text-sm">Estoque: {getSelectedVariantStock(product.id)}</p>

          <div className="flex items-center mt-4">
            <Input
              type="number"
              value={Math.min(quantity, getSelectedVariantStock(product.id))}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={getSelectedVariantStock(product.id)}
              className="mr-2 w-20"
              disabled={getSelectedVariantStock(product.id) <= 0}
            />
            <Button
              onClick={() => handlePurchase(product.id)}
              disabled={
                loading ||
                getSelectedVariantStock(product.id) <= 0 ||
                !selectedVariant[product.id]?.color ||
                !selectedVariant[product.id]?.size
              }
              className={`w-full ${getSelectedVariantStock(product.id) > 0 ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}
            >
              {getSelectedVariantStock(product.id) > 0 ? "Comprar" : "Indisponível"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
