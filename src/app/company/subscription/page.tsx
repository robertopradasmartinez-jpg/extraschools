import { auth } from '@/lib/auth';
import { Check, Crown, Zap, Star } from 'lucide-react';

export default async function CompanySubscriptionPage() {
  const session = await auth();

  // TODO: Obtener suscripción real de Stripe
  const currentPlan = 'free'; // 'free' | 'basic' | 'premium'

  const plans = [
    {
      id: 'free',
      name: 'Gratis',
      price: '0',
      icon: Check,
      color: 'bg-gray-500',
      features: [
        'Hasta 2 actividades',
        'Perfil básico de empresa',
        'Estadísticas básicas',
        'Soporte por email',
      ],
      limitations: [
        'Sin destacar actividades',
        'Sin acceso a analytics avanzado',
      ],
    },
    {
      id: 'basic',
      name: 'Básico',
      price: '29',
      icon: Zap,
      color: 'bg-blue-500',
      features: [
        'Hasta 10 actividades',
        'Perfil destacado',
        'Estadísticas completas',
        'Soporte prioritario',
        'Destacar 2 actividades',
        'Insignia verificado',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '79',
      icon: Crown,
      color: 'bg-yellow-500',
      features: [
        'Actividades ilimitadas',
        'Perfil premium',
        'Analytics avanzado',
        'Soporte 24/7',
        'Destacar actividades ilimitadas',
        'Aparece primero en búsquedas',
        'Acceso a API',
        'Gestor de cuenta dedicado',
      ],
    },
  ];

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
            <p className="text-2xl font-bold capitalize">{currentPlan === 'free' ? 'Gratis' : currentPlan}</p>
          </div>
          <Star className="w-12 h-12 opacity-80" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm opacity-90">
            {currentPlan === 'free'
              ? 'Actualiza para desbloquear más funcionalidades'
              : 'Gracias por confiar en nosotros'}
          </p>
          {currentPlan !== 'free' && (
            <button className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium text-sm hover:bg-secondary-50 transition">
              Gestionar Suscripción
            </button>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <span className="text-gray-600">/mes</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <li key={`limit-${index}`} className="flex items-start opacity-50">
                    <span className="text-sm text-gray-500 ml-7">
                      ✗ {limitation}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                disabled={currentPlan === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  currentPlan === plan.id
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {currentPlan === plan.id ? 'Plan Actual' : 'Seleccionar Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Comparación de Características
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Característica
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                  Gratis
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                  Básico
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-sm text-gray-900">
                  Número de actividades
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">2</td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">10</td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">
                  Ilimitadas
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-900">
                  Actividades destacadas
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-red-500">✗</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">2</td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-900">
                  Analytics avanzado
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-red-500">✗</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-red-500">✗</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-900">
                  Soporte
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">
                  Email
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">
                  Prioritario
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">
                  24/7
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Próximamente:</strong> Integración completa con Stripe para gestionar
          pagos y suscripciones de forma automática.
        </p>
      </div>
    </div>
  );
}
