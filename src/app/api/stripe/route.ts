// app/api/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

export async function GET() {
  try {
    // Listar transações de saldo
    const transactions = await stripe.balanceTransactions.list({
      limit: 100,
    });

    let totalSalesAmount = 0; // Valor bruto das vendas
    let totalSalesCount = 0; // Quantidade de vendas

    // Calcular o valor bruto das vendas e a quantidade de vendas
    transactions.data.forEach((txn) => {
      if (txn.type === 'charge' && txn.amount > 0) {
        totalSalesAmount += txn.amount / 100; // Converte para dólares/reais
        totalSalesCount += 1;
      }
    });

    // Obter saldo disponível e saldo futuro (líquido)
    const balance = await stripe.balance.retrieve();
    const balanceAvailable = balance.available.reduce(
      (acc, bal) => acc + bal.amount / 100,
      0
    );
    const balancePending = balance.pending.reduce(
      (acc, bal) => acc + bal.amount / 100,
      0
    );

    return NextResponse.json({
      totalSalesAmount, // Valor bruto em vendas
      balanceAvailable, // Receita líquida disponível
      balancePending,   // Receita pendente
      totalSalesCount,  // Quantidade de vendas
    });
  } catch (error) {
    console.error("Error fetching Stripe data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
}
