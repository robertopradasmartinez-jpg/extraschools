import { auth } from '@/lib/auth';
import { Star, Gift } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import SubscriptionPlans from '@/components/company/SubscriptionPlans';
import { isOnFreeTrial } from '@/lib/utils';

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
  const isTrial = user?.company ? isOnFreeTrial(user.company) : false;
  
  if (user?.company?.stripeSubscriptionId) {
    // Verificar si la suscripción está activa
    const isActive = user.company.stripeCurrentPeriodEnd && 
      new Date(user.company.stripeCurrentPeriodEnd) > new Date();
    
    if (isActive) {
      // Si es trial, mantener como "none" para mostrar planes
      if (isTrial) {
        currentPlan = 'trial';
      } else {
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
      <div className={`${
        isTrial 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
          : 'bg-gradient-to-r from-primary-500 to-primary-600'
      } rounded-lg shadow-lg p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">
              {isTrial ? '🎉 Prueba Gratuita Activa' : 'Plan Actual'}
            </p>
            <p className="text-2xl font-bold capitalize">
              {currentPlan === 'none' 
                ? 'Sin suscripción' 
                : currentPlan === 'trial' 
                  ? 'Acceso Completo Gratuito'
                  : currentPlan === 'monthly' 
                    ? 'Mensual' 
                    : 'Anual'}
            </p>
            {user?.company?.stripeCurrentPeriodEnd && currentPlan !== 'none' && (
              <p className="text-xs opacity-75 mt-1">
                {isTrial 
                  ? `Tu prueba gratuita termina el: ${new Date(user.company.stripeCurrentPeriodEnd).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : `Válido hasta: ${new Date(user.company.stripeCurrentPeriodEnd).toLocaleDateString('es-ES')}`
                }
              </p>
            )}
          </div>
          {isTrial ? <Gift className="w-12 h-12 opacity-80" /> : <Star className="w-12 h-12 opacity-80" />}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm opacity-90">
            {currentPlan === 'none'
              ? 'Suscríbete para publicar actividades'
              : isTrial
                ? '¡Disfruta de todas las funcionalidades sin límites!'
                : 'Gracias por confiar en nosotros'}
          </p>
          {currentPlan !== 'none' && !isTrial && (
            <button className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium text-sm hover:bg-secondary-50 transition">
              Gestionar Suscripción
            </button>
          )}
        </div>
      </div>

      {/* Trial Info Banner */}
      {isTrial && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Gift className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-blue-900">
                ¡Bienvenido a ExtraSchools! 🎉
              </h3>
              <p className="mt-2 text-sm text-blue-800">
                Tienes acceso <strong>completamente gratuito</strong> a todas las funcionalidades hasta el <strong>31 de agosto de 2026</strong>. 
                Publica actividades, gestiona tu perfil y conecta con familias sin ningún coste.
              </p>
              <p className="mt-2 text-sm text-blue-700">
                Cuando estés listo, podrás elegir un plan de suscripción para continuar disfrutando de todos los beneficios de la plataforma.
              </p>
            </div>
          </div>
        </div>
      )}

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
