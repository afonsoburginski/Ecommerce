import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function listBalanceTransactions(limit = 100) {
  const transactions = await stripe.balanceTransactions.list({ limit });
  let totalSalesAmount = 0;
  let totalSalesCount = 0;

  transactions.data.forEach((txn) => {
    if (txn.type === 'charge' && txn.amount > 0) {
      totalSalesAmount += txn.amount / 100;
      totalSalesCount += 1;
    }
  });

  const balance = await stripe.balance.retrieve();
  const balanceAvailable = balance.available.reduce(
    (acc, bal) => acc + bal.amount / 100,
    0
  );
  const balancePending = balance.pending.reduce(
    (acc, bal) => acc + bal.amount / 100,
    0
  );

  return {
    totalSalesAmount,
    balanceAvailable,
    balancePending,
    totalSalesCount,
  };
}

export async function createCheckoutSession(user: { stripeCustomerId: any; }, product: { name: any; price: number; }, variant: { color: any; size: any; }, quantity: any) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer: user.stripeCustomerId,
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${product.name} - ${variant.color || ''} ${variant.size || ''}`,
          },
          unit_amount: product.price * 100,
        },
        quantity,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
  });

  return session;
}

export async function syncStripeCustomer(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error('Usuário não encontrado');

  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({ name: user.name, email: user.email });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function retrieveSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

export async function retrieveCharge(chargeId: string) {
  return await stripe.charges.retrieve(chargeId);
}

export async function retrieveCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}
