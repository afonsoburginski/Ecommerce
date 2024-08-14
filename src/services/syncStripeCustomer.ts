// src/services/syncStripeCustomer.ts
import prisma from '@/lib/prisma';
import { createCustomer } from '@/services/stripeService';

export async function syncStripeCustomer(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error('Usuário não encontrado');

  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await createCustomer(user.name, user.email);

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
