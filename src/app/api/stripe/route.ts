// app/api/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

export async function GET() {
  try {
    const transactions = await stripe.balanceTransactions.list({
      limit: 100, // Limite de transações a serem retornadas
    });

    const transactionDetails = await Promise.all(
      transactions.data.map(async (txn) => {
        try {
          const charge = txn.source
            ? await stripe.charges.retrieve(txn.source as string)
            : null;

          let customer = null;
          if (charge?.customer && typeof charge.customer === 'string') {
            customer = await stripe.customers.retrieve(charge.customer);
          }

          return {
            id: txn.id,
            amount: txn.amount / 100,
            currency: txn.currency,
            status: txn.type,
            description: charge?.description || "N/A",
            customer: customer ? (customer as Stripe.Customer).name : "N/A",
            email: customer ? (customer as Stripe.Customer).email : "N/A",
            date: new Date(txn.created * 1000).toLocaleString(),
            cardLast4: charge?.payment_method_details?.card?.last4 || "N/A",
          };
        } catch (error) {
          console.error(`Failed to retrieve charge or customer for transaction ${txn.id}`, error);
          return {
            id: txn.id,
            amount: txn.amount / 100,
            currency: txn.currency,
            status: txn.type,
            description: "N/A",
            customer: "N/A",
            email: "N/A",
            date: new Date(txn.created * 1000).toLocaleString(),
            cardLast4: "N/A",
          };
        }
      })
    );

    return NextResponse.json(transactionDetails);
  } catch (error) {
    console.error("Error fetching Stripe transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}