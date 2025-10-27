export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: '#effde8' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-gray-600">
            Conectando familias con las mejores actividades extraescolares
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              En ExtraSchools creemos que encontrar la actividad extraescolar adecuada debería ser algo sencillo, rápido y seguro. Por eso hemos creado el primer marketplace informativo que centraliza la oferta de actividades en cada ciudad, para que las familias puedan tomar decisiones informadas y los centros y profesionales puedan llegar a más personas sin complicaciones.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Nacemos con una misión clara: ahorrar tiempo a las familias y ayudar a las empresas y profesionales del sector educativo a captar nuevos clientes, siempre con un enfoque de calidad, transparencia e inclusión.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Nuestro Compromiso</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Queremos que cada usuario se sienta acompañado y seguro en nuestra plataforma. Solo trabajamos con centros y actividades que comparten nuestros valores, porque creemos que no todo vale. Apostamos por un crecimiento sostenible, sin prisas, pero con una visión ambiciosa: estar presentes en todas las grandes ciudades de España, ofreciendo una experiencia clara, útil y humana.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Nuestros Valores</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-500 font-bold mr-3 text-2xl">•</span>
                <span className="leading-relaxed"><strong>Calidad frente a cantidad:</strong> Priorizamos empresas y actividades que cumplan con nuestros estándares de excelencia</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 font-bold mr-3 text-2xl">•</span>
                <span className="leading-relaxed"><strong>Simplicidad tecnológica:</strong> Una plataforma fácil de usar, sin complejidades innecesarias</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 font-bold mr-3 text-2xl">•</span>
                <span className="leading-relaxed"><strong>Transparencia:</strong> Información clara y reseñas reales para decisiones informadas</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 font-bold mr-3 text-2xl">•</span>
                <span className="leading-relaxed"><strong>Relación respetuosa:</strong> Trato cercano y profesional con usuarios, proveedores, instituciones y colaboradores</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 font-bold mr-3 text-2xl">•</span>
                <span className="leading-relaxed"><strong>Inclusión:</strong> Actividades para todos los intereses, edades y necesidades</span>
              </li>
            </ul>

            <div className="mt-12 p-8 bg-primary-50 border-l-4 border-primary-500 rounded-r-lg">
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
            En ExtraSchools, creemos que &quot;cada niño tiene un talento único esperando a ser descubierto&quot;. Nuestra misión es conectar a las familias con las mejores actividades extraescolares de su ciudad.
          </p>
            </div>

            <div className="mt-12 p-8 bg-secondary-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Quieres formar parte?</h3>
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
      </section>
    </div>
  )
}
