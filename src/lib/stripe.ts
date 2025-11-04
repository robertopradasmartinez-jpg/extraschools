import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  annual: process.env.STRIPE_ANNUAL_PRICE_ID || '',
};
