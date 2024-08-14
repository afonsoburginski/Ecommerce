// src/app/api/stripe/sync-customer.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { syncStripeCustomer } from '@/services/syncStripeCustomer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    try {
      const stripeCustomerId = await syncStripeCustomer(userId);
      res.status(200).json({ stripeCustomerId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
