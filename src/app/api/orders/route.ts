// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { retrieveSession } from '@/services/stripeService';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
    });

    const ordersWithStatus = await Promise.all(
      orders.map(async (order) => {
        let transactionStatus = "unknown";
        if (order.transactionId) {
          try {
            const stripeSession = await retrieveSession(order.transactionId);
            if (stripeSession?.payment_status) {
              transactionStatus = stripeSession.payment_status === "unpaid" ? "PENDING" :
                                  stripeSession.payment_status === "paid" ? "PAID" : stripeSession.payment_status;
            }

            if (order.status !== transactionStatus) {
              await prisma.order.update({
                where: { id: order.id },
                data: { status: transactionStatus || "unknown" },
              });
            }
          } catch (error) {
            console.error(`Erro ao buscar transação do Stripe para o pedido ${order.id}:`, error.message);
            transactionStatus = "FAILED";
          }
        }
        return { ...order, transactionStatus };
      })
    );

    return NextResponse.json(ordersWithStatus);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error.message);
    return NextResponse.json({ error: 'Erro ao buscar pedidos', details: error.message }, { status: 500 });
  }
}
