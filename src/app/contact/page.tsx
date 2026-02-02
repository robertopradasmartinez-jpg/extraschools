import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contacto | ExtraSchools',
  description: 'Ponte en contacto con nosotros. Estamos aquí para ayudarte.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contacta con Nosotros
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte. 
            Completa el formulario y nos pondremos en contacto contigo lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-rose-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <a 
                      href="mailto:info@extraschools.es" 
                      className="text-gray-600 hover:text-rose-500 transition"
                    >
                      info@extraschools.es
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-rose-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Teléfono</h3>
                    <a 
                      href="tel:+34900123456" 
                      className="text-gray-600 hover:text-rose-500 transition"
                    >
                      +34 900 123 456
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-rose-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Dirección</h3>
                    <p className="text-gray-600">
                      Calle Principal, 123<br />
                      28001 Madrid, España
                    </p>
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">
                  Horario de Atención
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Lunes - Viernes: 9:00 - 18:00</p>
                  <p>Sábados: 10:00 - 14:00</p>
                  <p>Domingos: Cerrado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Envíanos un Mensaje
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Preguntas Frecuentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Cómo puedo publicar una actividad?
              </h3>
              <p className="text-gray-600">
                Regístrate como empresa y accede a tu panel de control para crear y gestionar tus actividades.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Es gratuito para los padres?
              </h3>
              <p className="text-gray-600">
                Sí, buscar y contactar con empresas es completamente gratuito para los padres.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Cómo funciona el sistema de mensajería?
              </h3>
              <p className="text-gray-600">
                Una vez registrado, puedes enviar mensajes directamente a las empresas desde la página de cada actividad.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Cuánto tiempo tarda en responderse?
              </h3>
              <p className="text-gray-600">
                Normalmente respondemos en menos de 24 horas durante días laborables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
