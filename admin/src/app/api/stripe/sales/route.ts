// app/api/stripe/sales/route.ts
import { NextResponse } from 'next/server';
import { getDailySales } from '@/services/stripe';

export async function GET() {
  try {
    const dailySales = await getDailySales();
    return NextResponse.json(dailySales); // Retorna as vendas diárias
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: 'Failed to fetch data', details: errorMessage },
      { status: 500 }
    );
  }
}
