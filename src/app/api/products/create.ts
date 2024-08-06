// src/app/api/products/create.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, sku, categories, tags, status } = body;

    if (!name || !description || !price || !stock || !sku || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        sku,
        status,
        categories: {
          connect: categories?.map((id: number) => ({ id })),
        },
        tags: {
          connect: tags?.map((id: number) => ({ id })),
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
