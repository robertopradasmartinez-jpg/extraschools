import { Heart, Target, Users, Shield, Lightbulb, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'ExtraSchools conecta familias con las mejores actividades extraescolares en España. Conoce nuestra misión, valores y compromiso con la educación infantil.',
 keywords: ['sobre extraschools', 'quiénes somos', 'misión educativa', 'valores', 'actividades extraescolares'],
  openGraph: {
    title: 'Sobre Nosotros | ExtraSchools',
    description: 'Conectamos familias con las mejores actividades extraescolares en España',
    url: 'https://extraschools.es/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-white/90">
            Conectando familias con las mejores actividades extraescolares
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Misión */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Target className="w-8 h-8 text-primary-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Nuestra Misión</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>
              En ExtraSchools creemos que encontrar la actividad extraescolar adecuada debería ser algo sencillo, rápido y seguro. Por eso hemos creado el primer marketplace informativo que centraliza la oferta de actividades en cada ciudad, para que las familias puedan tomar decisiones informadas y los centros y profesionales puedan llegar a más personas sin complicaciones.
            </p>
            <p>
              Nacemos con una misión clara: ahorrar tiempo a las familias y ayudar a las empresas y profesionales del sector educativo a captar nuevos clientes, siempre con un enfoque de calidad, transparencia e inclusión.
            </p>
          </div>
        </div>

        {/* Compromiso */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-primary-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Nuestro Compromiso</h2>
          </div>
          <div className="prose max-w-none text-gray-600">
            <p>
              Queremos que cada usuario se sienta acompañado y seguro en nuestra plataforma. Solo trabajamos con centros y actividades que comparten nuestros valores, porque creemos que no todo vale. Apostamos por un crecimiento sostenible, sin prisas, pero con una visión ambiciosa: estar presentes en todas las grandes ciudades de España, ofreciendo una experiencia clara, útil y humana.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Lightbulb className="w-8 h-8 text-primary-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Nuestros Valores</h2>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                ✨ Calidad frente a cantidad
              </h3>
              <p className="text-gray-600">
                Priorizamos empresas y actividades que cumplan con nuestros estándares de excelencia
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                🚀 Simplicidad tecnológica
              </h3>
              <p className="text-gray-600">
                Una plataforma fácil de usar, sin complejidades innecesarias
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                🔍 Transparencia
              </h3>
              <p className="text-gray-600">
                Información clara y reseñas reales para decisiones informadas
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                🤝 Relación respetuosa
              </h3>
              <p className="text-gray-600">
                Trato cercano y profesional con usuarios, proveedores, instituciones y colaboradores
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                🌟 Inclusión
              </h3>
              <p className="text-gray-600">
                Actividades para todos los intereses, edades y necesidades
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-primary-50 border-l-4 border-primary-500 rounded-r-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              En ExtraSchools, creemos que &quot;cada niño tiene un talento único esperando a ser descubierto&quot;. Nuestra misión es conectar a las familias con las mejores actividades extraescolares de su ciudad.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-primary-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">¿Quieres formar parte?</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Ya seas padre buscando la actividad perfecta o una empresa queriendo
            llegar a más familias, ExtraSchools es tu plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/auth/signup"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition text-center"
            >
              Registrarse como padre
            </a>
            <a
              href="/auth/signup?type=company"
              className="inline-block px-6 py-3 bg-white text-primary-500 border-2 border-primary-500 rounded-lg font-semibold hover:bg-secondary-50 transition text-center"
            >
              Registrar empresa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
