// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

export async function POST(request: Request) {
  const { productId, userId } = await request.json();

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: user.stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    const transaction = await prisma.transaction.create({
      data: {
        stripeId: session.id,
        amount: product.price,
        status: "pending",
      },
    });

    await prisma.order.create({
      data: {
        userId: user.id,
        total: product.price,
        orderItems: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price,
          },
        },
        transactionId: transaction.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de checkout", details: error.message },
      { status: 500 }
    );
  }
}
