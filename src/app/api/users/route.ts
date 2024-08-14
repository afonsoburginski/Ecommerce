// app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();
  
  try {
    const stripeCustomer = await stripe.customers.create({
      name,
      email,
    });

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        stripeCustomerId: stripeCustomer.id,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.stripeCustomerId) {
      await stripe.customers.del(user.stripeCustomerId);
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
