import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get the subscription details
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        
        if (subscriptionId && customerId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Update the company with subscription details
          await prisma.company.update({
            where: {
              stripeCustomerId: customerId,
            },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
          
          console.log(`✅ Subscription ${subscriptionId} activated for customer ${customerId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await prisma.company.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        
        console.log(`✅ Subscription ${subscription.id} updated`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Remove subscription details when cancelled
        await prisma.company.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        
        console.log(`✅ Subscription ${subscription.id} cancelled`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
