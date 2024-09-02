import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { retrieveSession, retrieveCharge } from '@/services/stripeService';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

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
        let transactionStatus = "unknown";
        let paymentMethodLast4 = "N/A";

        if (order.transactionId) {
          try {
            const stripeSession = await retrieveSession(order.transactionId);

            if (stripeSession?.payment_status) {
              transactionStatus = stripeSession.payment_status === "unpaid" ? "PENDING" :
                                  stripeSession.payment_status === "paid" ? "PAID" : stripeSession.payment_status;

              const paymentIntentId = stripeSession.payment_intent as string;

              if (paymentIntentId) {
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                const chargeId = paymentIntent?.charges?.data[0]?.id;
                if (chargeId) {
                  const charge = await retrieveCharge(chargeId);
                  paymentMethodLast4 = charge?.payment_method_details?.card?.last4 || "N/A";
                }
              }
            }

            if (order.status !== transactionStatus) {
              await prisma.order.update({
                where: { id: order.id },
                data: { status: transactionStatus || "unknown" },
              });
            }
          } catch (error) {
            transactionStatus = "FAILED";
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
    return NextResponse.json({ error: 'Erro ao buscar pedidos', detalhes: error.message }, { status: 500 });
  }
}
