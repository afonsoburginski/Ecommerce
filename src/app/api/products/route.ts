// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        tags: true,
        variants: true, // Include variants here
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Erro Interno do Servidor', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categories, tags, status, variants } = body;

    // Validate required fields for the product
    if (!name || !description || typeof price !== 'number' || typeof stock !== 'number' || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure variants are valid
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (!variant.sku || typeof variant.stock !== 'number') {
          return NextResponse.json({ error: 'Missing variant fields' }, { status: 400 });
        }
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        status,
        categories: {
          connect: categories?.map((id: number) => ({ id })),
        },
        tags: {
          connect: tags?.map((id: number) => ({ id })),
        },
        variants: {
          create: variants.map((variant: Variant) => ({
            sku: variant.sku,
            stock: variant.stock,
            size: variant.size,
            color: variant.color,
          })),
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