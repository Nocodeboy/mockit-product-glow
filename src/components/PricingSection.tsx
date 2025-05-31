
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Zap, Crown, Sparkles } from 'lucide-react';
import PricingCard from './PricingCard';

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
            <PricingCard key={plan.id} plan={plan} />
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
