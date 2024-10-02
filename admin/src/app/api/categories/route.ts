// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Erro ao buscar categorias:', err.message, err.stack);
    return NextResponse.json(
      { error: 'Erro Interno do Servidor', details: err.message },
      { status: 500 }
    );
  }
}
