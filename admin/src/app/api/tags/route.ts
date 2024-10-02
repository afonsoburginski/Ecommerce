// app/api/tags/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar tags:', error.message, error.stack);
      return NextResponse.json(
        { error: 'Erro Interno do Servidor', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Erro desconhecido:', error);
      return NextResponse.json(
        { error: 'Erro Interno do Servidor', details: 'Erro desconhecido' },
        { status: 500 }
      );
    }
  }
}
