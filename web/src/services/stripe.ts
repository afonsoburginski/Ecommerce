// services/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function createCheckoutSession(lineItems: any[], customerEmail: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail, // Passa o e-mail do cliente para o Stripe
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    console.log('Sessão de checkout criada com sucesso:', session.url);
    return session;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout no Stripe:', error.message);
    throw error;
  }
}
