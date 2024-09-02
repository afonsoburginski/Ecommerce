// app/api/users/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

// Função auxiliar para lidar com erros
const handleError = (error: any, message: string, status: number = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
};

// GET: Obter todos os usuários
export async function GET() {
  return prisma.user.findMany()
    .then(users => NextResponse.json(users))
    .catch(error => handleError(error, 'Failed to fetch users'));
}

// POST: Criar um novo usuário
export async function POST(request: Request) {
  const { name, email, password, role, address, phone, cpf, dateOfBirth } = await request.json();

  return stripe.customers.create({ name, email })
    .then(stripeCustomer =>
      prisma.user.create({
        data: {
          name,
          email,
          password,
          role,
          address,
          phone,
          cpf,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          stripeCustomerId: stripeCustomer.id,
          createdAt: new Date(),
        },
      })
    )
    .then(newUser => NextResponse.json(newUser))
    .catch(error => handleError(error, 'Failed to create user'));
}

// DELETE: Deletar um usuário
export async function DELETE(request: Request) {
  const { id } = await request.json();

  return prisma.user.findUnique({ where: { id } })
    .then(user => {
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return (user.stripeCustomerId
        ? stripe.customers.del(user.stripeCustomerId)
        : Promise.resolve()
      ).then(() => prisma.user.delete({ where: { id } }))
    })
    .then(() => NextResponse.json({ message: 'User deleted successfully' }))
    .catch(error => handleError(error, 'Failed to delete user'));
}
