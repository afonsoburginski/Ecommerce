// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/services/supabaseStorage';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        tags: true,
        variants: true,
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
    const formData = await request.formData();
    const stock = parseInt(formData.get('stock') as string);

    if (isNaN(stock)) {
      return NextResponse.json({ error: 'Stock inválido' }, { status: 400 });
    }
    
    const file = formData.get('image') as File | null;
    console.log('File received:', file);

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categories = JSON.parse(formData.get('categories') as string) as number[];
    const tags = JSON.parse(formData.get('tags') as string) as number[];
    const status = formData.get('status') as string;
    const variants = JSON.parse(formData.get('variants') as string) as any[];

    console.log({ name, description, price, stock, categories, tags, status, variants });

    if (!name || !description || isNaN(price) || isNaN(stock) || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadImage(file);
      if (!imageUrl) {
        console.error('Failed to upload image');
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    const newProductData = {
      name,
      description,
      price,
      stock,
      status,
      images: imageUrl ? [imageUrl] : [],
      categories: {
        connect: categories.map(id => ({ id })),
      },
      tags: {
        connect: tags.map(id => ({ id })),
      },
      variants: {
        create: variants.map((variant: any) => ({
          sku: variant.sku,
          stock: variant.stock,
          size: variant.size,
          color: variant.color,
        })),
      },
    };

    console.log('Saving new product:', newProductData);

    const newProduct = await prisma.product.create({
      data: newProductData,
    });

    console.log('Product saved successfully');
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro Interno do Servidor', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = parseInt(formData.get('id') as string);
    const file = formData.get('image') as File | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const categories = JSON.parse(formData.get('categories') as string) as number[];
    const tags = JSON.parse(formData.get('tags') as string) as number[];
    const status = formData.get('status') as string;
    const variants = JSON.parse(formData.get('variants') as string) as any[];

    if (!id || !name || !description || isNaN(price) || isNaN(stock) || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadImage(file);
      if (!imageUrl) {
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        status,
        images: imageUrl ? [imageUrl] : [],
        categories: {
          set: categories?.map((id: number) => ({ id })),
        },
        tags: {
          set: tags?.map((id: number) => ({ id })),
        },
        variants: {
          deleteMany: {},
          create: variants.map((variant: any) => ({
            sku: variant.sku,
            stock: variant.stock,
            size: variant.size,
            color: variant.color,
          })),
        },
      },
      include: {
        categories: true,
        tags: true,
        variants: true,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error('Error updating product:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

