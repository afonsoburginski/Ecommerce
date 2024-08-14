import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createCheckoutSession } from '@/services/stripeService';

export async function POST(request: Request) {
  const { productId, userId } = await request.json();

  try {
    console.log('Iniciando processo de checkout para', { productId, userId });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!product) {
      console.error('Produto não encontrado:', { productId });
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    if (product.stock <= 0) {
      console.error('Produto fora de estoque:', { productId });
      return NextResponse.json({ error: 'Produto fora de estoque' }, { status: 400 });
    }

    if (!user) {
      console.error('Usuário não encontrado:', { userId });
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (!user.stripeCustomerId) {
      console.error('Usuário não possui stripeCustomerId:', user);
      return NextResponse.json({ error: 'Usuário sem stripeCustomerId' }, { status: 400 });
    }

    console.log('Criando sessão de checkout no Stripe para o usuário:', user);

    const session = await createCheckoutSession(user, product);

    console.log('Sessão de checkout criada com sucesso:', session.id);

    const order = await prisma.order.create({
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
        transactionId: session.id,
        status: 'PENDING',
      },
    });

    if (!order) {
      console.error('Erro ao criar pedido no banco de dados');
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
    }

    console.log('Pedido criado com sucesso para o usuário:', user.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error.message, error.stack);
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout', details: error.message }, { status: 500 });
  }
}
