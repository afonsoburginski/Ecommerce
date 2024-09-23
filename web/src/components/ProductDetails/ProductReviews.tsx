// src/components/ProductReviews.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProductReviews({ product }) {
  if (!product) {
    return null;
  }

  return (
    <div className="w-full max-w-[1320px] mt-8">
      <Card className="w-full shadow-none">
        <CardHeader>
          <CardTitle>Reviews do produto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{product.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
