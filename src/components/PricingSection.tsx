
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: '0',
      period: 'siempre',
      icon: Zap,
      description: 'Perfecto para probar MockIT',
      features: [
        '5 mockups por mes',
        'Resolución estándar',
        'Estilos básicos',
        'Descarga en JPG',
        'Soporte por email'
      ],
      limitations: [
        'Marca de agua en mockups',
        'Sin acceso a estilos premium'
      ],
      buttonText: 'Empezar Gratis',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '19',
      period: 'mes',
      icon: Crown,
      description: 'Para diseñadores y empresas',
      features: [
        '100 mockups por mes',
        'Resolución 4K',
        'Todos los estilos disponibles',
        'Descarga en JPG y PNG',
        'Sin marca de agua',
        'Soporte prioritario',
        'Plantillas exclusivas',
        'API access'
      ],
      buttonText: 'Empezar Prueba Gratis',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Empresas',
      price: '99',
      period: 'mes',
      icon: Building,
      description: 'Para equipos y grandes empresas',
      features: [
        'Mockups ilimitados',
        'Resolución 8K',
        'Estilos personalizados',
        'Descarga en todos los formatos',
        'Sin marca de agua',
        'Soporte 24/7',
        'Manager de cuenta dedicado',
        'API completa',
        'Integración con herramientas',
        'Entrenamiento personalizado'
      ],
      buttonText: 'Contactar Ventas',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Precios Simples y Transparentes
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elige el plan perfecto para tus necesidades. Cancela en cualquier momento.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative bg-white/10 backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-400 bg-gradient-to-b from-purple-500/20 to-transparent' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      Más Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-white/20'
                    }`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <p className="text-gray-400">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full border border-gray-500 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : 'bg-white/20 hover:bg-white/30 border border-white/40'
                    } text-white font-semibold py-3`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            ¿Necesitas algo diferente? Contáctanos para un plan personalizado
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span>✓ Sin compromisos a largo plazo</span>
            <span>✓ Cancela en cualquier momento</span>
            <span>✓ Soporte en español</span>
            <span>✓ Facturación mensual o anual</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
