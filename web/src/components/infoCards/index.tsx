import React from 'react';
import Image from 'next/image';
import { Card, CardTitle } from '@/components/ui/card';

export function InfoCards() {
  const categories = [
    {
      image: 'https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/baby-care.svg',
      title: 'New Born & Baby Care',
      description: 'Explore nossa linha completa de produtos para bebês.',
      borderColor: '#8bb6f2'
    },
    {
      image: 'https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/clothing.svg',
      title: 'Roupas Infantis',
      description: 'Encontre roupas confortáveis e estilosas para crianças.',
      borderColor: '#f08abf'
    },
    {
      image: 'https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/games.svg',
      title: 'Brinquedos e Jogos',
      description: 'Divirta-se com nossa seleção de jogos educativos e divertidos.',
      borderColor: '#5daedd'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary">Nossa Loja</h2>
        <p className="text-lg text-secondary-foreground mt-2">Descubra nossas categorias</p>
      </div>
      <div className="flex space-x-6 max-w-[1320px]">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="flex flex-row items-center p-4 space-x-4"
            style={{
              border: `2px dotted ${category.borderColor}`
            }}
          >
            <div className="w-[100px] h-[100px]">
              <Image
                src={category.image}
                alt={category.title}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle
                className="text-lg font-bold"
                style={{
                  color: category.borderColor
                }}
              >
                {category.title}
              </CardTitle>
              <p className="text-sm mt-2">{category.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
