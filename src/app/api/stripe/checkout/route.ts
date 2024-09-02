import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createCheckoutSession } from '@/services/stripeService';

export async function POST(request: Request) {
  const { productId, userId, variantId, quantity } = await request.json();

  try {
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!variant || !variant.product) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    if (variant.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'User not found or missing Stripe ID' }, { status: 404 });
    }

    const totalPrice = variant.product.price * quantity;

    const session = await createCheckoutSession(user, variant.product, variant, quantity);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        transactionId: session.id,
        status: 'PENDING',
        total: totalPrice, // Adicionando o campo total
        orderItems: {
          create: {
            productId: variant.productId,
            variantId: variant.id,
            quantity,
            price: totalPrice,
          },
        },
      },
    });

    await prisma.variant.update({
      where: { id: variantId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create checkout session', details: error.message }, { status: 500 });
  }
}
