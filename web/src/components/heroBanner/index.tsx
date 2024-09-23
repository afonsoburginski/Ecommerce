import React from "react";
import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="relative w-full h-[60vh]">
      <Image
        src="https://owyaxdsnwzcavzstoxbi.supabase.co/storage/v1/object/public/Images/banners/Mundo%20Encantado.svg"
        alt="Hero Banner"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
    </div>
  );
}
