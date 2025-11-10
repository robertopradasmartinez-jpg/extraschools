import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad - ExtraSchools',
  description: 'Política de privacidad y protección de datos de ExtraSchools',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-white/90">
            Tu privacidad es nuestra prioridad
          </p>
          <p className="text-sm text-white/75 mt-2">
            Última actualización: Noviembre 2025
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Intro */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            En <strong>ExtraSchools</strong>, nos comprometemos a proteger tu privacidad y tus datos personales. 
            Esta política describe cómo recopilamos, usamos y protegemos tu información de acuerdo con el 
            Reglamento General de Protección de Datos (RGPD) y la legislación española vigente.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Datos que recopilamos */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                1. Información que Recopilamos
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Datos de registro:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Contraseña (encriptada)</li>
                  <li>Tipo de cuenta (padre, empresa, admin)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Datos de empresas:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nombre de la empresa</li>
                  <li>CIF/NIF</li>
                  <li>Dirección</li>
                  <li>Teléfono de contacto</li>
                  <li>Información de actividades publicadas</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Datos de navegación:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador</li>
                  <li>Páginas visitadas</li>
                  <li>Tiempo de navegación</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cómo usamos los datos */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                2. Cómo Usamos tu Información
              </h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Procesar transacciones y pagos</li>
              <li>Enviar comunicaciones relacionadas con tu cuenta</li>
              <li>Responder a tus consultas y solicitudes</li>
              <li>Personalizar tu experiencia en la plataforma</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Prevenir fraudes y abusos</li>
            </ul>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Lock className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                3. Seguridad de los Datos
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encriptación SSL/TLS en todas las comunicaciones</li>
                <li>Contraseñas encriptadas con algoritmos seguros</li>
                <li>Servidores seguros con copias de seguridad regulares</li>
                <li>Acceso restringido a datos personales</li>
                <li>Auditorías de seguridad periódicas</li>
              </ul>
            </div>
          </div>

          {/* Tus derechos */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <UserCheck className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                4. Tus Derechos (RGPD)
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Limitación:</strong> Solicitar la restricción del tratamiento</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, contacta con nosotros en: <a href="mailto:info@extraschools.es" className="text-primary-500 hover:underline">info@extraschools.es</a>
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                5. Cookies y Tecnologías Similares
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Utilizamos cookies para mejorar tu experiencia:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio</li>
                <li><strong>Cookies de rendimiento:</strong> Para analizar el uso del sitio</li>
                <li><strong>Cookies de personalización:</strong> Para recordar tus preferencias</li>
              </ul>
              <p className="mt-4">
                Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar a la funcionalidad del sitio.
              </p>
            </div>
          </div>

          {/* Compartir datos */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Mail className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                6. Compartir Información
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                No vendemos ni alquilamos tus datos personales. Solo compartimos información en estos casos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Con empresas que publican actividades (solo para facilitar el contacto)</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Cuando sea requerido por ley o autoridades competentes</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </div>
          </div>

          {/* Cambios */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cambios en esta Política
            </h2>
            <p className="text-gray-700">
              Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos 
              por email o mediante un aviso en la plataforma. La fecha de última actualización se muestra 
              al inicio de esta política.
            </p>
          </div>

          {/* Contacto */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Tienes preguntas sobre tu privacidad?
            </h3>
            <p className="text-gray-700 mb-6">
              Estamos aquí para ayudarte con cualquier duda sobre tus datos
            </p>
            <a
              href="mailto:info@extraschools.es"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
