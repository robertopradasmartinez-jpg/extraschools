import { FileText, Scale, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Términos y Condiciones - ExtraSchools',
  description: 'Términos y condiciones de uso de ExtraSchools',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Scale className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-white/90">
            Última actualización: 5 de noviembre de 2025
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Aviso Importante</h3>
              <p className="text-sm text-blue-800">
                Al acceder y utilizar ExtraSchools, aceptas estar sujeto a estos términos y condiciones.
                Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">1. Aceptación de los Términos</h2>
            </div>
            <div className="prose max-w-none text-gray-600">
              <p>
                Al acceder y utilizar ExtraSchools ("la Plataforma"), aceptas cumplir y estar sujeto a estos
                Términos y Condiciones de Uso. Estos términos se aplican a todos los usuarios de la Plataforma,
                incluyendo padres, empresas de actividades extraescolares y visitantes.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descripción del Servicio</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                ExtraSchools es una plataforma digital que conecta a familias con empresas que ofrecen
                actividades extraescolares. Nuestros servicios incluyen:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Búsqueda y visualización de actividades extraescolares</li>
                <li>Sistema de mensajería entre padres y empresas</li>
                <li>Publicación y gestión de actividades para empresas</li>
                <li>Sistema de reseñas y valoraciones</li>
                <li>Gestión de favoritos y preferencias</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registro y Cuentas de Usuario</h2>
            <div className="prose max-w-none text-gray-600 space-y-3">
              <p><strong>3.1 Registro:</strong> Para acceder a ciertas funcionalidades, debes crear una cuenta proporcionando información veraz y actualizada.</p>
              <p><strong>3.2 Seguridad:</strong> Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas bajo tu cuenta.</p>
              <p><strong>3.3 Tipos de cuenta:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Padres:</strong> Acceso gratuito para buscar y contactar empresas</li>
                <li><strong>Empresas:</strong> Requiere suscripción de pago para publicar actividades</li>
                <li><strong>Administradores:</strong> Gestión y moderación de la plataforma</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Suscripciones y Pagos</h2>
            <div className="prose max-w-none text-gray-600 space-y-3">
              <p><strong>4.1 Planes de suscripción:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Plan Mensual: 25€/mes</li>
                <li>Plan Anual: 250€/año (ahorro de 2 meses)</li>
              </ul>
              <p><strong>4.2 Procesamiento de pagos:</strong> Los pagos se procesan de forma segura a través de Stripe.</p>
              <p><strong>4.3 Renovación automática:</strong> Las suscripciones se renuevan automáticamente al final de cada período.</p>
              <p><strong>4.4 Cancelación:</strong> Puedes cancelar tu suscripción en cualquier momento desde tu panel de empresa. El acceso continuará hasta el final del período pagado.</p>
              <p><strong>4.5 Reembolsos:</strong> No se ofrecen reembolsos por períodos parciales de suscripción.</p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Uso Aceptable</h2>
            <div className="prose max-w-none text-gray-600 space-y-3">
              <p>Al utilizar ExtraSchools, te comprometes a NO:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Publicar información falsa, engañosa o fraudulenta</li>
                <li>Violar derechos de propiedad intelectual de terceros</li>
                <li>Acosar, amenazar o intimidar a otros usuarios</li>
                <li>Utilizar la plataforma para actividades ilegales</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Realizar ingeniería inversa o copiar el código de la plataforma</li>
                <li>Enviar spam o contenido no solicitado</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contenido del Usuario</h2>
            <div className="prose max-w-none text-gray-600 space-y-3">
              <p><strong>6.1 Responsabilidad:</strong> Eres responsable del contenido que publicas en la plataforma.</p>
              <p><strong>6.2 Licencia:</strong> Al publicar contenido, otorgas a ExtraSchools una licencia no exclusiva para usar, mostrar y distribuir dicho contenido en la plataforma.</p>
              <p><strong>6.3 Moderación:</strong> Nos reservamos el derecho de eliminar contenido que viole estos términos sin previo aviso.</p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Relación entre Padres y Empresas</h2>
            <div className="prose max-w-none text-gray-600 space-y-3">
              <p><strong>7.1 Intermediación:</strong> ExtraSchools actúa únicamente como intermediario. No somos responsables de las relaciones contractuales entre padres y empresas.</p>
              <p><strong>7.2 Transacciones:</strong> Los pagos por actividades se realizan directamente entre padres y empresas. ExtraSchools no interviene en estas transacciones.</p>
              <p><strong>7.3 Verificación:</strong> Aunque hacemos esfuerzos por verificar a las empresas, recomendamos a los padres realizar su propia investigación.</p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Todos los derechos de propiedad intelectual sobre la plataforma, incluyendo diseño, código,
                logotipos y contenido, pertenecen a ExtraSchools o sus licenciantes. No puedes utilizar,
                copiar o distribuir ningún elemento sin autorización expresa.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitación de Responsabilidad</h2>
            <div className="prose max-w-none text-gray-600 space-y-3">
              <p>
                ExtraSchools se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos que
                la plataforma esté libre de errores o interrupciones.
              </p>
              <p>
                No seremos responsables de daños indirectos, incidentales o consecuentes que resulten
                del uso o imposibilidad de uso de la plataforma.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificaciones</h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
                significativos serán notificados a los usuarios con al menos 30 días de antelación.
                El uso continuado de la plataforma después de las modificaciones constituye la aceptación
                de los nuevos términos.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Terminación</h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Podemos suspender o terminar tu cuenta si violas estos términos. También puedes cerrar
                tu cuenta en cualquier momento desde la configuración de tu perfil.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Legislación Aplicable</h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Estos términos se rigen por las leyes de España. Cualquier disputa se resolverá en los
                tribunales competentes de España.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contacto</h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Para cualquier pregunta sobre estos términos, puedes contactarnos en:
              </p>
              <ul className="list-none ml-4 space-y-1">
                <li><strong>Email:</strong> info@extraschools.es</li>
                <li><strong>Web:</strong> <a href="https://extraschools.es" className="text-primary-500 hover:text-primary-600">extraschools.es</a></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            Al utilizar ExtraSchools, confirmas que has leído, entendido y aceptado estos Términos y Condiciones.
          </p>
        </div>
      </div>
    </div>
  );
}
