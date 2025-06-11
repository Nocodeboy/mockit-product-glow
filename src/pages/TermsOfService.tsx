
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <FileText className="h-7 w-7 text-purple-400" />
                Términos y Condiciones
              </CardTitle>
              <p className="text-gray-400">Última actualización: 11 de junio de 2025</p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-gray-300">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">1. Aceptación de los Términos</h2>
                <p className="mb-4">
                  Al acceder y utilizar MockIT, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no puedes usar nuestro servicio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">2. Descripción del Servicio</h2>
                <p className="mb-4">
                  MockIT es una plataforma que utiliza inteligencia artificial para generar mockups profesionales a partir de imágenes de productos proporcionadas por los usuarios.
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Generación automática de mockups con IA</li>
                  <li>Almacenamiento seguro de generaciones</li>
                  <li>Gestión de favoritos y descargas</li>
                  <li>Sistema de créditos para uso del servicio</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">3. Registro de Cuenta</h2>
                <p className="mb-4">
                  Para utilizar MockIT, debes crear una cuenta proporcionando información precisa y actualizada. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">4. Uso Aceptable</h2>
                <p className="mb-4">Te comprometes a no:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Subir contenido ilegal, ofensivo o que viole derechos de autor</li>
                  <li>Intentar comprometer la seguridad del sistema</li>
                  <li>Usar el servicio para fines comerciales no autorizados</li>
                  <li>Crear múltiples cuentas para eludir limitaciones</li>
                  <li>Interferir con el funcionamiento normal del servicio</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">5. Propiedad Intelectual</h2>
                <p className="mb-4">
                  Los mockups generados son de tu propiedad. MockIT se reserva los derechos sobre la tecnología, algoritmos y la plataforma en sí. Respetas que las imágenes que subas no violen derechos de terceros.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">6. Pagos y Suscripciones</h2>
                <p className="mb-4">
                  Los planes premium requieren pago. Los cargos son no reembolsables excepto cuando la ley lo requiera. Los precios pueden cambiar con previo aviso.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">7. Limitación de Responsabilidad</h2>
                <p className="mb-4">
                  MockIT se proporciona "tal como está". No garantizamos que el servicio será ininterrumpido o libre de errores. Nuestra responsabilidad está limitada al máximo permitido por la ley.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">8. Terminación</h2>
                <p className="mb-4">
                  Podemos suspender o terminar tu cuenta si violas estos términos. Puedes cancelar tu cuenta en cualquier momento desde la configuración.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">9. Contacto</h2>
                <p>
                  Para consultas legales, contáctanos en:{' '}
                  <a href="mailto:legal@mockit.com" className="text-purple-400 hover:text-purple-300">
                    legal@mockit.com
                  </a>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
