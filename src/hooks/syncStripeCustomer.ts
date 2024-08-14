// src/hooks/syncStripeCustomer.ts
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function syncStripeCustomer(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Se o usuário já tem um stripeCustomerId, não precisa criar um novo cliente no Stripe
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Cria um novo cliente no Stripe
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
  });

  // Atualiza o usuário com o stripeCustomerId
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}
