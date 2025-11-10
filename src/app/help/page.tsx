import { Mail, Phone, MessageCircle, BookOpen, Search, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Centro de Ayuda - ExtraSchools',
  description: 'Encuentra respuestas a las preguntas más frecuentes sobre ExtraSchools',
};

export default function HelpPage() {
  const faqs = [
    {
      category: 'Para Padres',
      icon: Users,
      questions: [
        {
          q: '¿Cómo busco actividades para mi hijo?',
          a: 'Puedes usar nuestro buscador en la página principal, filtrando por edad, categoría, ciudad y precio. También puedes ver el mapa para encontrar actividades cerca de ti.',
        },
        {
          q: '¿Puedo guardar actividades favoritas?',
          a: 'Sí, inicia sesión y haz clic en el icono de corazón en cualquier actividad. Podrás ver todas tus favoritas en tu perfil.',
        },
        {
          q: '¿Cómo contacto con una empresa?',
          a: 'Desde la página de detalle de cada actividad, puedes enviar un mensaje directo a la empresa a través de nuestro sistema de mensajería interno.',
        },
        {
          q: '¿Es gratuito para los padres?',
          a: 'Sí, ExtraSchools es completamente gratuito para padres. Solo pagas directamente a la empresa por la actividad que elijas.',
        },
      ],
    },
    {
      category: 'Para Empresas',
      icon: BookOpen,
      questions: [
        {
          q: '¿Cómo registro mi empresa?',
          a: 'Haz clic en "Registrar empresa" en el menú superior, completa el formulario y podrás empezar a publicar tus actividades.',
        },
        {
          q: '¿Cuánto cuesta publicar actividades?',
          a: 'Ofrecemos dos planes: Mensual por 25€/mes y Anual por 250€/año (2 meses gratis). Puedes publicar actividades ilimitadas.',
        },
        {
          q: '¿Cómo edito mis actividades?',
          a: 'Desde tu panel de empresa, ve a "Mis Actividades" y haz clic en el botón de editar en cualquier actividad publicada.',
        },
        {
          q: '¿Puedo pausar mi suscripción?',
          a: 'Puedes cancelar tu suscripción en cualquier momento desde el panel de empresa. Tus actividades se ocultarán hasta que reactives tu plan.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Search className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="text-xl text-white/90">
            Encuentra respuestas rápidas a tus preguntas
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link
            href="/contact"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-center"
          >
            <Mail className="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600">info@extraschools.es</p>
          </Link>

          <Link
            href="/contact"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-center"
          >
            <MessageCircle className="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Chat</h3>
            <p className="text-sm text-gray-600">Envíanos un mensaje</p>
          </Link>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Phone className="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
            <p className="text-sm text-gray-600">Próximamente</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="pb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <section.icon className="w-8 h-8 text-primary-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {section.category}
                  </h3>
                </div>

                <div className="space-y-6">
                  {section.questions.map((faq, idx) => (
                    <div key={idx} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {faq.q}
                      </h4>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-gray-600 mb-6">
            Nuestro equipo está aquí para ayudarte
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
