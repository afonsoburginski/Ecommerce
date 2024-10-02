import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// Função para atualizar o status da ordem
async function updateOrderStatus(orderId: number, status: OrderStatus) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function GET() {
  try {
    // Buscar todas as ordens na base de dados, incluindo os itens do pedido e as informações do usuário
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Mapear as ordens e retornar as informações diretamente da base de dados
    const ordersWithDetails = orders.map((order) => ({
      ...order,
      transactionStatus: order.status, // Utilizando o status da ordem diretamente
      paymentMethod: order.transactionId ? 'N/A' : 'N/A', // Placeholder ou logica baseada na sua base de dados
    }));

    // Retornar as ordens como resposta JSON
    return NextResponse.json(ordersWithDetails);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: 'Erro ao buscar pedidos', detalhes: errorMessage }, { status: 500 });
  }
}
