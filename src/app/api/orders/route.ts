// app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    // Para cada ordem, buscamos o status da transação diretamente do Stripe
    const ordersWithStatus = await Promise.all(
      orders.map(async (order) => {
        if (order.transactionId) {
          console.log(`Fetching Stripe transaction for order ${order.id} with transactionId ${order.transactionId}`);
          try {
            const stripeSession = await stripe.checkout.sessions.retrieve(order.transactionId);
            console.log(`Stripe transaction fetched successfully for order ${order.id}, status: ${stripeSession.payment_status}`);
            return {
              ...order,
              transactionStatus: stripeSession.payment_status,
            };
          } catch (error) {
            console.error(`Error fetching Stripe transaction for order ${order.id}:`, error.message);
            return {
              ...order,
              transactionStatus: "error",
            };
          }
        }
        return { ...order, transactionStatus: "unknown" };
      })
    );

    return NextResponse.json(ordersWithStatus);
  } catch (error) {
    console.error("Erro ao buscar ordens:", error.message);
    return NextResponse.json(
      { error: "Erro ao buscar ordens", details: error.message },
      { status: 500 }
    );
  }
}
