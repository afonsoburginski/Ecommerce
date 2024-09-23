import React from 'react';
import Image from 'next/image';

export function BannerImages() {
  const banners = [
    'https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/placeholder.png',
    'https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/placeholder.png',
    'https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/placeholder.png',
    'https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/placeholder.png',
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-8 mx-auto max-w-[1320px]">
      <h2 className="text-3xl font-bold text-primary text-center">Nossa Galeria</h2>
      <p className="text-lg text-secondary-foreground mt-2 text-center">Conheça a loja e se apaixone!</p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-6">
        {banners.map((src, index) => (
          <div key={index} className="w-[320px] h-[320px]">
            <Image
              src={src}
              alt={`Banner ${index + 1}`}
              width={360}
              height={360}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
