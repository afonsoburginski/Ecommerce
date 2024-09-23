// src/components/ProductImage.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProductStateContext } from '@/contexts/ProductStateContext';

export default function ProductImage({ product }) {
  const { selectedColor } = useProductStateContext();
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  // Opcional: atualizar a imagem com base na cor selecionada
  useEffect(() => {
    if (selectedColor) {
      const imageForColor = product.images.find((image) => image.includes(selectedColor));
      if (imageForColor) {
        setSelectedImage(imageForColor);
      }
    }
  }, [selectedColor, product]);

  if (!product) {
    return null;
  }

  return (
    <div className="flex flex-col justify-start items-start" style={{ flex: '0 0 600px' }}>
      <div className="relative w-[560px] h-[560px] overflow-hidden cursor-zoom-in group">
        <Image
          src={selectedImage}
          alt={product.name}
          width={560}
          height={560}
          objectFit="cover"
          className="rounded-md group-hover:scale-125 transition-transform duration-300 ease-in-out"
        />
      </div>

      {product.images.length > 1 && (
        <div className="flex gap-4 mt-4 justify-start">
          {product.images.map((image: string, index: number) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`cursor-pointer border-2 rounded-lg ${
                selectedImage === image ? 'border-[#f08abf]' : 'border-transparent'
              } transition-colors duration-300`}
            >
              <Image
                src={image}
                alt={`Imagem adicional ${index + 1}`}
                width={150}
                height={150}
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
