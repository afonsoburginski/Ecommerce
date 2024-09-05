import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { retrieveSession, retrieveCharge } from '@/services/stripe';
import Stripe from "stripe";
import { OrderStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// Função para atualizar o status do pedido no banco de dados
async function updateOrderStatus(orderId: number, status: OrderStatus) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

// Função para obter detalhes do pagamento a partir do Stripe
async function getPaymentDetails(transactionId: string): Promise<{ status: OrderStatus; last4: string }> {
  const stripeSession = await retrieveSession(transactionId);

  if (!stripeSession?.payment_status) {
    throw new Error('Falha ao recuperar o status do pagamento');
  }

  const transactionStatus: OrderStatus = stripeSession.payment_status === "unpaid" ? "PENDING" :
                                         stripeSession.payment_status === "paid" ? "PAID" :
                                         "FAILED";

  const paymentIntentId = stripeSession.payment_intent as string;
  let paymentMethodLast4 = "N/A";

  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId) as unknown as Stripe.PaymentIntent & { charges: { data: Array<{ id: string }> } };

    const chargeId = paymentIntent.charges?.data[0]?.id;
    if (chargeId) {
      const charge = await retrieveCharge(chargeId);
      paymentMethodLast4 = charge?.payment_method_details?.card?.last4 || "N/A";
    }
  }

  return { status: transactionStatus, last4: paymentMethodLast4 };
}

export async function GET() {
  try {
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

    const ordersWithPaymentDetails = await Promise.all(
      orders.map(async (order) => {
        let transactionStatus = order.status;
        let paymentMethodLast4 = "N/A";

        if (order.transactionId) {
          try {
            const paymentDetails = await getPaymentDetails(order.transactionId);
            transactionStatus = paymentDetails.status;
            paymentMethodLast4 = paymentDetails.last4;

            if (order.status !== transactionStatus) {
              await updateOrderStatus(order.id, transactionStatus);
            }
          } catch {
            transactionStatus = "FAILED" as OrderStatus;
          }
        }

        return {
          ...order,
          transactionStatus,
          paymentMethod: paymentMethodLast4,
        };
      })
    );

    return NextResponse.json(ordersWithPaymentDetails);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: 'Erro ao buscar pedidos', detalhes: errorMessage }, { status: 500 });
  }
}
