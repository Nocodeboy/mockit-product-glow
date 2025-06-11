
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicy = () => {
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
                <Cookie className="h-7 w-7 text-purple-400" />
                Política de Cookies
              </CardTitle>
              <p className="text-gray-400">Última actualización: 11 de junio de 2025</p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-gray-300">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">¿Qué son las Cookies?</h2>
                <p className="mb-4">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas MockIT. Nos ayudan a mejorar tu experiencia y el funcionamiento de nuestra plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Tipos de Cookies que Utilizamos</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Cookies Esenciales</h3>
                  <p className="mb-2">Necesarias para el funcionamiento básico de la plataforma:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Autenticación de usuario</li>
                    <li>Preferencias de sesión</li>
                    <li>Configuración de seguridad</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Cookies de Funcionalidad</h3>
                  <p className="mb-2">Mejoran tu experiencia recordando tus preferencias:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Configuraciones de interfaz</li>
                    <li>Idioma preferido</li>
                    <li>Historial de generaciones</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Cookies Analíticas</h3>
                  <p className="mb-2">Nos ayudan a entender cómo usas MockIT:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Métricas de uso</li>
                    <li>Rendimiento del sistema</li>
                    <li>Patrones de navegación</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Cookies de Terceros</h2>
                <p className="mb-4">
                  Utilizamos algunos servicios de terceros que pueden establecer cookies:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Supabase:</strong> Para autenticación y almacenamiento de datos</li>
                  <li><strong>Stripe:</strong> Para procesamiento de pagos (solo usuarios premium)</li>
                  <li><strong>Proveedores de IA:</strong> Para el procesamiento de imágenes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Gestión de Cookies</h2>
                <p className="mb-4">
                  Puedes controlar las cookies a través de:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Configuración de tu navegador</li>
                  <li>Panel de preferencias en tu cuenta</li>
                  <li>Herramientas de privacidad del navegador</li>
                </ul>
                <p className="mb-4">
                  <strong>Nota:</strong> Deshabilitar las cookies esenciales puede afectar el funcionamiento de MockIT.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Tiempo de Conservación</h2>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Cookies de sesión:</strong> Se eliminan al cerrar el navegador</li>
                  <li><strong>Cookies persistentes:</strong> Duración de 1 año máximo</li>
                  <li><strong>Cookies analíticas:</strong> 2 años máximo</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Actualizaciones</h2>
                <p className="mb-4">
                  Esta política puede actualizarse ocasionalmente. Te notificaremos sobre cambios significativos a través de la plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Contacto</h2>
                <p>
                  Para consultas sobre cookies, contáctanos en:{' '}
                  <a href="mailto:cookies@mockit.com" className="text-purple-400 hover:text-purple-300">
                    cookies@mockit.com
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

export default CookiePolicy;
