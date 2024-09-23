// /api/stripe/checkout.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createCheckoutSession } from '@/services/stripe';

export async function POST(request: Request) {
  const { cart, userId } = await request.json(); // Recebemos também o `userId` do frontend

  try {
    if (!cart || !userId) {
      return NextResponse.json({ error: 'Carrinho ou usuário não informado' }, { status: 400 });
    }

    // Busca o usuário selecionado
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Usuário não encontrado ou e-mail ausente' }, { status: 404 });
    }

    // Verifica se todos os itens do carrinho têm os parâmetros necessários
    for (const item of cart) {
      if (!item.productId || !item.variantId || !item.quantity) {
        return NextResponse.json({ error: 'Parâmetros do item do carrinho estão faltando' }, { status: 400 });
      }
    }

    // Busca as variantes no banco de dados
    const variants = await prisma.variant.findMany({
      where: {
        id: { in: cart.map((item) => item.variantId) },
      },
      include: { product: true },
    });

    if (variants.length !== cart.length) {
      return NextResponse.json({ error: 'Algumas variantes não foram encontradas' }, { status: 404 });
    }

    // Monta os lineItems para o Stripe
    const lineItems = cart.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${variant.product.name} - ${variant.color || ''} ${variant.size || ''}`,
          },
          unit_amount: variant.product.price * 100, // Converte o preço para centavos
        },
        quantity: item.quantity,
      };
    });

    // Cria a sessão de checkout no Stripe com o e-mail do usuário
    const session = await createCheckoutSession(lineItems, user.email); // Passa o e-mail do usuário para a sessão

    // Cria o pedido no banco de dados com a referência ao `userId`
    const order = await prisma.order.create({
      data: {
        user: {
          connect: { id: userId }, // Relaciona o pedido ao usuário selecionado
        },
        transactionId: session.id, // ID da sessão de checkout no Stripe
        status: 'PENDING',
        orderItems: {
          create: cart.map((item) => {
            const variant = variants.find((v) => v.id === item.variantId);
            return {
              productId: variant.productId,
              variantId: variant.id,
              quantity: item.quantity,
              price: variant.product.price,
            };
          }),
        },
      },
    });

    // Atualiza o estoque
    await prisma.variant.updateMany({
      where: { id: { in: cart.map((item) => item.variantId) } },
      data: { stock: { decrement: 1 } },
    });

    return NextResponse.json({ url: session.url }); // Retorna a URL do checkout do Stripe
  } catch (error) {
    console.error('Erro durante o processo de checkout:', error);
    return NextResponse.json({ error: 'Falha ao criar a sessão de checkout', details: error.message }, { status: 500 });
  }
}
