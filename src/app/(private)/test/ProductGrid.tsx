"use client";

import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  handlePurchase,
  loading,
  getSelectedVariantStock,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          quantity={quantity}
          setQuantity={setQuantity}
          handlePurchase={handlePurchase}
          loading={loading}
          getSelectedVariantStock={getSelectedVariantStock}
        />
      ))}
    </div>
  );
}
