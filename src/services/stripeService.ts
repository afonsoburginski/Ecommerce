// src/services/stripeService.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
});

export async function createCheckoutSession(user, product, variant, quantity) {
  try {
    console.log('Criando sessão de checkout para o usuário:', user.id, 'e variação do produto:', variant.id);
    
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
    
    console.log('Sessão de checkout criada com sucesso:', session.id);
    return session;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout no Stripe:', error.message, error.stack);
    throw new Error(`Erro ao criar sessão de checkout no Stripe: ${error.message}`);
  }
}

export async function retrieveSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

export async function listBalanceTransactions(limit = 100) {
  return await stripe.balanceTransactions.list({ limit });
}

export async function retrieveCharge(chargeId: string) {
  return await stripe.charges.retrieve(chargeId);
}

export async function retrieveCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

export async function createCustomer(name: string, email: string) {
  return await stripe.customers.create({ name, email });
}
