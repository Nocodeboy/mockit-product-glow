
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Lock, Eye, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DataProcessing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">Tratamiento de Datos</h1>
            </div>
            <p className="text-xl text-gray-300">
              Información sobre cómo procesamos y protegemos tus datos personales
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  Datos que Recopilamos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>En MockIT recopilamos los siguientes tipos de datos:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Información de cuenta: email, contraseña encriptada</li>
                  <li>Imágenes que subes para generar mockups</li>
                  <li>Mockups generados y guardados en tu cuenta</li>
                  <li>Datos de uso: páginas visitadas, funciones utilizadas</li>
                  <li>Información técnica: IP, navegador, dispositivo</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  Finalidad del Tratamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>Utilizamos tus datos para:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Proporcionar el servicio de generación de mockups con IA</li>
                  <li>Gestionar tu cuenta y autenticación</li>
                  <li>Guardar y organizar tus generaciones</li>
                  <li>Mejorar nuestros servicios y algoritmos</li>
                  <li>Proporcionar soporte técnico</li>
                  <li>Enviar comunicaciones importantes sobre el servicio</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  Base Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>El tratamiento de tus datos se basa en:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Ejecución de contrato:</strong> Para proporcionar el servicio solicitado</li>
                  <li><strong>Interés legítimo:</strong> Para mejorar el servicio y prevenir fraudes</li>
                  <li><strong>Consentimiento:</strong> Para comunicaciones de marketing (opcional)</li>
                  <li><strong>Obligación legal:</strong> Para cumplir con requisitos legales</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Tus Derechos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>Tienes derecho a:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Acceso:</strong> Solicitar una copia de tus datos</li>
                  <li><strong>Rectificación:</strong> Corregir datos inexactos</li>
                  <li><strong>Supresión:</strong> Eliminar tus datos ("derecho al olvido")</li>
                  <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                  <li><strong>Oposición:</strong> Oponerte al tratamiento</li>
                  <li><strong>Limitación:</strong> Restringir el procesamiento</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-400" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Para ejercer tus derechos o resolver dudas sobre el tratamiento de datos, 
                  contáctanos en: <strong>privacidad@mockit.com</strong>
                </p>
                <p>
                  Tiempo de respuesta: 30 días máximo según la normativa GDPR.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProcessing;
