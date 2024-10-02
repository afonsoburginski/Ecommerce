import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/services/supabaseStorage';
import { ProductStatus } from '@prisma/client';

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

    const file = formData.get('image') as File | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categories = JSON.parse(formData.get('categories') as string) as number[];
    const tags = JSON.parse(formData.get('tags') as string) as number[];
    const variants = JSON.parse(formData.get('variants') as string);

    const status = ProductStatus.ACTIVE;

    for (const variant of variants) {
      if (variant.stock === undefined || variant.stock === null || isNaN(variant.stock) || variant.stock < 0) {
        return NextResponse.json({ error: 'Stock inválido ou ausente' }, { status: 400 });
      }
    }

    if (!name || !description || isNaN(price)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadImage(file);
      if (!imageUrl) {
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    const newProductData = {
      name,
      description,
      price,
      status,
      images: imageUrl ? [imageUrl] : [],
      categories: { connect: categories.map(id => ({ id })) },
      tags: { connect: tags.map(id => ({ id })) },
      variants: {
        create: variants.map((variant: any) => ({
          sku: variant.sku,
          stock: variant.stock,
          size: variant.size,
          color: variant.color,
        })),
      },
    };

    const newProduct = await prisma.product.create({
      data: newProductData,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Erro Interno do Servidor:', error.message);
    return NextResponse.json({ error: 'Erro Interno do Servidor', details: error.message }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get('Content-Type');
    let data: any = {};

    if (contentType?.includes('application/json')) {
      const body = await request.json();
      const { id, status } = body;

      if (!id || !status) {
        return NextResponse.json({ error: 'ID ou status faltando' }, { status: 400 });
      }

      data = {
        status: status.toUpperCase(),
      };

      const updatedProduct = await prisma.product.update({
        where: { id: id },
        data,
        include: {
          categories: true,
          tags: true,
          variants: true,
        },
      });

      return NextResponse.json(updatedProduct, { status: 200 });
    } else {
      const formData = await request.formData();
      const id = parseInt(formData.get('id') as string);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      const name = formData.get('name') as string | null;
      if (name) data.name = name;

      const description = formData.get('description') as string | null;
      if (description) data.description = description;

      const price = formData.get('price') as string | null;
      if (price && !isNaN(parseFloat(price))) data.price = parseFloat(price);

      const stock = formData.get('stock') as string | null;
      if (stock && !isNaN(parseInt(stock))) data.stock = parseInt(stock);

      const status = formData.get('status') as string | null;
      if (status) data.status = status;

      const file = formData.get('image') as File | null;
      if (file) {
        const imageUrl = await uploadImage(file);
        if (!imageUrl) {
          return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }
        data.images = { set: [imageUrl] };
      }

      const categories = formData.get('categories') as string | null;
      if (categories) {
        const categoriesArray = JSON.parse(categories) as number[];
        data.categories = { set: categoriesArray.map(id => ({ id })) };
      }

      const tags = formData.get('tags') as string | null;
      if (tags) {
        const tagsArray = JSON.parse(tags) as number[];
        data.tags = { set: tagsArray.map(id => ({ id })) };
      }

      const variants = formData.get('variants') as string | null;
      if (variants) {
        const variantsArray = JSON.parse(variants) as any[];
        data.variants = {
          deleteMany: {},
          create: variantsArray.map(variant => ({
            sku: variant.sku,
            stock: variant.stock,
            size: variant.size,
            color: variant.color,
          })),
        };
      }

      const updatedProduct = await prisma.product.update({
        where: { id: id },
        data,
        include: {
          categories: true,
          tags: true,
          variants: true,
        },
      });

      return NextResponse.json(updatedProduct, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error updating product:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
