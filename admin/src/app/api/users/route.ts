import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const handleError = (error: any, message: string, status: number = 500) => {
  console.error("Error message:", message);
  console.error("Error details:", error);
  return NextResponse.json({ error: message, details: error.toString() }, { status });
};

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Retorna a lista de usuários
    return NextResponse.json(users);
  } catch (error) {
    return handleError(error, 'Failed to fetch users');
  }
}
