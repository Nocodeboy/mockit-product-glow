
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: '$0',
      period: 'por mes',
      description: 'Perfect para probar MockIT',
      icon: <Star className="h-6 w-6" />,
      features: [
        '5 mockups por mes',
        'Calidad estándar',
        'Formatos básicos',
        'Marca de agua incluida',
        'Soporte por email'
      ],
      limitations: [
        'Funciones limitadas',
        'Sin prioridad en soporte'
      ],
      buttonText: 'Comenzar Gratis',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: 'por mes',
      description: 'Ideal para profesionales y pequeñas empresas',
      icon: <Zap className="h-6 w-6" />,
      features: [
        '100 mockups por mes',
        'Calidad premium HD',
        'Todos los formatos',
        'Sin marca de agua',
        'Soporte prioritario',
        'Descargas ilimitadas',
        'Múltiples estilos',
        'API básica'
      ],
      buttonText: 'Elegir Pro',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Empresas',
      price: '$99',
      period: 'por mes',
      description: 'Para equipos grandes y agencias',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Mockups ilimitados',
        'Máxima calidad 4K',
        'Estilos personalizados',
        'White-label completo',
        'Soporte 24/7 dedicado',
        'API completa',
        'Integraciones avanzadas',
        'Manager de cuenta',
        'Facturación personalizada'
      ],
      buttonText: 'Contactar Ventas',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Planes Para Cada Necesidad
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde proyectos personales hasta equipos empresariales, tenemos el plan perfecto para ti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-xl transition-all duration-300 ${
                plan.popular 
                  ? 'border-2 border-purple-500 scale-105 shadow-lg' 
                  : 'border hover:border-purple-200'
              }`}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  Más Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <li key={`limit-${index}`} className="flex items-start opacity-60">
                      <span className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-center">—</span>
                      <span className="text-gray-500 line-through">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : ''
                  }`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿Necesitas más de 100 mockups al mes? ¿Tienes requisitos especiales?
          </p>
          <Button variant="link" className="text-purple-600 hover:text-purple-700">
            Contáctanos para un plan personalizado →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
