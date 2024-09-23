// services/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function listBalanceTransactions(limit = 100) {
  // Obter transações de saldo do Stripe
  const transactions = await stripe.balanceTransactions.list({ limit });
  let totalSalesAmount = 0;
  let totalSalesCount = 0;

  // Calcular o valor total das vendas e o número de vendas
  transactions.data.forEach((txn) => {
    if (txn.type === 'charge' && txn.amount > 0) {
      totalSalesAmount += txn.amount / 100; // Convertendo de centavos para reais
      totalSalesCount += 1;
    }
  });

  // Obter o saldo disponível e pendente
  const balance = await stripe.balance.retrieve();
  const balanceAvailable = balance.available.reduce(
    (acc, bal) => acc + bal.amount / 100,
    0
  );
  const balancePending = balance.pending.reduce(
    (acc, bal) => acc + bal.amount / 100,
    0
  );

  // Obter o número de clientes cadastrados no Stripe
  const customers = await stripe.customers.list();
  const totalCustomers = customers.data.length;

  return {
    totalSalesAmount,
    balanceAvailable,
    balancePending,
    totalSalesCount,
    totalCustomers, // Adiciona o número total de clientes
  };
}

export async function getDailySales(limit = 100) {
  const transactions = await stripe.balanceTransactions.list({ limit });

  // Agrupar transações por data
  const salesByDay = transactions.data.reduce((acc, txn) => {
    if (txn.type === 'charge' && txn.amount > 0) {
      const date = new Date(txn.created * 1000).toISOString().split('T')[0]; // Formato YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 }; // Inicializar total e contador
      }
      acc[date].total += txn.amount / 100; // Convertendo de centavos para reais
      acc[date].count += 1; // Contador de transações
    }
    return acc;
  }, {});

  // Converter o resultado em um array de objetos
  const dailySales = Object.keys(salesByDay).map(date => ({
    date,
    total: salesByDay[date].total,
    transactionsCount: salesByDay[date].count, // Adicionar número de transações
  }));

  return dailySales;
}



export async function retrieveSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return null;
  }
}

export async function retrieveCharge(chargeId: string) {
  try {
    const charge = await stripe.charges.retrieve(chargeId);
    return charge;
  } catch (error) {
    console.error('Failed to retrieve charge:', error);
    return null;
  }
}
