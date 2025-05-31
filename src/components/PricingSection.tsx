
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Sparkles } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: '$0',
      period: 'por mes',
      description: 'Perfecto para probar MockIT',
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
      popular: false,
      gradient: 'from-gray-400 to-gray-600'
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
      popular: true,
      gradient: 'from-purple-500 to-pink-500'
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
      popular: false,
      gradient: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-purple-50 relative">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-pink-100/20 to-purple-100/20"></div>
      </div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Planes Para Cada <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Necesidad</span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Desde proyectos personales hasta equipos empresariales, tenemos el plan perfecto para ti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`group relative hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/80 backdrop-blur-sm ${
                plan.popular 
                  ? 'border-2 border-purple-300 scale-105 shadow-xl shadow-purple-200/50' 
                  : 'border border-gray-200/50 hover:border-purple-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge 
                    className={`bg-gradient-to-r ${plan.gradient} text-white shadow-lg px-4 py-1`}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-r ${plan.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {plan.icon}
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <p className="text-gray-600 mt-2 leading-relaxed">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`h-5 w-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mr-3 mt-0.5 flex-shrink-0`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <li key={`limit-${index}`} className="flex items-start opacity-60">
                      <span className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-center text-gray-400">—</span>
                      <span className="text-gray-500 line-through leading-relaxed">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full h-12 font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg hover:shadow-purple-300/50 transform hover:scale-105 text-white border-0` 
                      : 'hover:bg-gray-50'
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

        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg max-w-2xl mx-auto">
            <p className="text-gray-700 mb-4 text-lg">
              ¿Necesitas más de 100 mockups al mes? ¿Tienes requisitos especiales?
            </p>
            <Button variant="link" className="text-purple-600 hover:text-purple-700 font-semibold">
              Contáctanos para un plan personalizado →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
