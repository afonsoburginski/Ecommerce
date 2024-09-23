// src/hooks/useProductState.ts
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export function useProductState(product: any) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const getSelectedVariant = () => {
    if (!selectedColor || !selectedSize) return null;
    return product?.variants.find(
      (variant: any) => variant.color === selectedColor && variant.size === selectedSize
    );
  };

  const selectedVariant = getSelectedVariant();
  const stock = selectedVariant ? selectedVariant.stock : 0;
  const sku = selectedVariant ? selectedVariant.sku : 'N/A';

  const availableSizes = selectedColor
    ? product?.variants
        .filter((variant: any) => variant.color === selectedColor)
        .map((variant: any) => variant.size)
    : [];

  const productCategories = product?.categories?.map((category: any) => category.name).join(', ') || '';
  const productTags = product?.tags?.map((tag: any) => tag.name).join(', ') || '';

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        color: selectedColor,
        size: selectedSize,
        sku: selectedVariant.sku,
        variantId: selectedVariant.id,
        image: product.images[0],
      };
      addToCart(cartItem);
      console.log('Produto adicionado ao carrinho:', cartItem);
    }
  };

  return {
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
  };
}
