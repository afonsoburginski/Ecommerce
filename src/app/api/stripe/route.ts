import { NextResponse } from 'next/server';
import { listBalanceTransactions } from '@/services/stripe';

export async function GET() {
  try {
    const balanceData = await listBalanceTransactions();

    return NextResponse.json(balanceData);
  } catch (error) {
    console.error('Error fetching Stripe data:', error);

    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: 'Failed to fetch data', details: errorMessage },
      { status: 500 }
    );
  }
}
