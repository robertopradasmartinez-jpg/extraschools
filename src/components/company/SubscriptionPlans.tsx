'use client';

import { useState } from 'react';
import { Check, Crown, Zap, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  priceId: string;
  icon: any;
  color: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

interface SubscriptionPlansProps {
  currentPlan: string;
  monthlyPriceId: string;
  annualPriceId: string;
}

export default function SubscriptionPlans({ currentPlan, monthlyPriceId, annualPriceId }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Mensual',
      price: '25',
      period: 'mes',
      priceId: monthlyPriceId,
      icon: Zap,
      color: 'bg-blue-500',
      features: [
        'Actividades ilimitadas',
        'Perfil destacado',
        'Estadísticas completas',
        'Soporte prioritario',
        'Gestión de mensajes',
        'Sin permanencia',
      ],
    },
    {
      id: 'annual',
      name: 'Anual',
      price: '250',
      period: 'año',
      priceId: annualPriceId,
      icon: Crown,
      color: 'bg-primary-500',
      features: [
        'Actividades ilimitadas',
        'Perfil destacado',
        'Estadísticas completas',
        'Soporte prioritario',
        'Gestión de mensajes',
        '2 meses gratis',
      ],
      popular: true,
      savings: '2 meses gratis',
    },
  ];

  const handleSubscribe = async (priceId: string, planId: string) => {
    try {
      setLoading(planId);

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          plan: planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de pago');
      }

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar el pago');
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`bg-white rounded-lg shadow-lg overflow-hidden ${
            plan.popular ? 'ring-2 ring-primary-500' : ''
          } ${currentPlan === plan.id ? 'opacity-75' : ''}`}
        >
          {plan.popular && (
            <div className="bg-primary-500 text-white text-center py-2 text-sm font-medium">
              Más Popular
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`${plan.color} p-3 rounded-lg`}>
                <plan.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                {currentPlan === plan.id && (
                  <span className="text-xs text-primary-600 font-medium">
                    Plan Actual
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
              <span className="text-gray-600">/{plan.period}</span>
              {plan.savings && (
                <div className="mt-2">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.savings}
                  </span>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.priceId, plan.id)}
              disabled={currentPlan === plan.id || loading !== null}
              className={`w-full py-3 px-4 rounded-lg font-medium transition flex items-center justify-center ${
                currentPlan === plan.id
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : loading === plan.id
                  ? 'bg-gray-300 text-gray-600 cursor-wait'
                  : plan.popular
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {loading === plan.id ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : currentPlan === plan.id ? (
                'Plan Actual'
              ) : (
                'Seleccionar Plan'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
