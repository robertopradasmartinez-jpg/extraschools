import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario es una empresa
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true },
    });

    if (!user || user.role !== 'COMPANY' || !user.company) {
      return NextResponse.json(
        { error: 'Solo empresas pueden suscribirse' },
        { status: 403 }
      );
    }

    const { priceId, plan } = await req.json();

    // Validar el price ID
    if (priceId !== STRIPE_PRICES.monthly && priceId !== STRIPE_PRICES.annual) {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      );
    }

    // Crear o recuperar customer de Stripe
    let customerId = user.company.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.company.name,
        metadata: {
          companyId: user.company.id,
          userId: user.id,
        },
      });

      customerId = customer.id;

      // Guardar el customer ID en la base de datos
      await prisma.company.update({
        where: { id: user.company.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Crear Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/company/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/company/subscription?canceled=true`,
      metadata: {
        companyId: user.company.id,
        userId: user.id,
        plan: plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago' },
      { status: 500 }
    );
  }
}
