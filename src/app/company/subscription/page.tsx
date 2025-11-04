import { auth } from '@/lib/auth';
import { Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import SubscriptionPlans from '@/components/company/SubscriptionPlans';

export default async function CompanySubscriptionPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div>No autorizado</div>;
  }

  // Obtener la empresa y su suscripción
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true },
  });

  let currentPlan = 'none';
  
  if (user?.company?.stripeSubscriptionId) {
    // Verificar si la suscripción está activa
    const isActive = user.company.stripeCurrentPeriodEnd && 
      new Date(user.company.stripeCurrentPeriodEnd) > new Date();
    
    if (isActive) {
      // Determinar qué plan tiene basado en el price ID
      const priceId = user.company.stripePriceId;
      if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID || priceId?.includes('month')) {
        currentPlan = 'monthly';
      } else if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID || priceId?.includes('year') || priceId?.includes('annual')) {
        currentPlan = 'annual';
      } else if (priceId) {
        // Si tiene algún price ID pero no coincide, asumir que tiene suscripción
        currentPlan = 'monthly'; // Por defecto mostrar mensual si no podemos determinar
      }
    }
  }



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Suscripción
        </h1>
        <p className="mt-2 text-gray-600">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Plan Actual</p>
            <p className="text-2xl font-bold capitalize">
              {currentPlan === 'none' ? 'Sin suscripción' : currentPlan === 'monthly' ? 'Mensual' : 'Anual'}
            </p>
            {user?.company?.stripeCurrentPeriodEnd && currentPlan !== 'none' && (
              <p className="text-xs opacity-75 mt-1">
                Válido hasta: {new Date(user.company.stripeCurrentPeriodEnd).toLocaleDateString('es-ES')}
              </p>
            )}
          </div>
          <Star className="w-12 h-12 opacity-80" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm opacity-90">
            {currentPlan === 'none'
              ? 'Suscríbete para publicar actividades'
              : 'Gracias por confiar en nosotros'}
          </p>
          {currentPlan !== 'none' && (
            <button className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium text-sm hover:bg-secondary-50 transition">
              Gestionar Suscripción
            </button>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <SubscriptionPlans 
        currentPlan={currentPlan}
        monthlyPriceId={process.env.STRIPE_MONTHLY_PRICE_ID || ''}
        annualPriceId={process.env.STRIPE_ANNUAL_PRICE_ID || ''}
      />

      {/* Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          ¿Por qué suscribirte?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl mb-2">🚀</div>
            <p className="font-semibold text-gray-900">Visibilidad</p>
            <p className="text-sm text-gray-600">Llega a más familias</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-gray-900">Estadísticas</p>
            <p className="text-sm text-gray-600">Analiza tu rendimiento</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💼</div>
            <p className="font-semibold text-gray-900">Profesional</p>
            <p className="text-sm text-gray-600">Perfil destacado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
