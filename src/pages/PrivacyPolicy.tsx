
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
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
                <Shield className="h-7 w-7 text-purple-400" />
                Política de Privacidad
              </CardTitle>
              <p className="text-gray-400">Última actualización: 11 de junio de 2025</p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-gray-300">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
                <p className="mb-4">
                  En MockIT, recopilamos la siguiente información para proporcionar nuestros servicios de generación de mockups con IA:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Información de cuenta: email, nombre de usuario y contraseña</li>
                  <li>Imágenes que subes para generar mockups</li>
                  <li>Mockups generados y configuraciones de preferencias</li>
                  <li>Información de uso y métricas de rendimiento</li>
                  <li>Datos de pago para usuarios premium</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">2. Cómo Utilizamos tu Información</h2>
                <p className="mb-4">Utilizamos tu información para:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Procesar tus imágenes y generar mockups con IA</li>
                  <li>Mantener y mejorar nuestros servicios</li>
                  <li>Comunicarnos contigo sobre tu cuenta y actualizaciones</li>
                  <li>Procesar pagos y gestionar suscripciones</li>
                  <li>Analizar el uso para mejorar la experiencia del usuario</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">3. Compartir Información</h2>
                <p className="mb-4">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                  <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
                  <li>En caso de fusión, adquisición o venta de activos</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">4. Seguridad de Datos</h2>
                <p className="mb-4">
                  Implementamos medidas de seguridad técnicas y administrativas para proteger tu información, incluyendo encriptación de datos y acceso restringido.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">5. Tus Derechos</h2>
                <p className="mb-4">Tienes derecho a:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de tu cuenta</li>
                  <li>Exportar tus datos</li>
                  <li>Retirar tu consentimiento</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">6. Contacto</h2>
                <p>
                  Para consultas sobre privacidad, contáctanos en:{' '}
                  <a href="mailto:privacidad@mockit.com" className="text-purple-400 hover:text-purple-300">
                    privacidad@mockit.com
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

export default PrivacyPolicy;
