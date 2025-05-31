
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    buttonText: string;
    buttonVariant: 'default' | 'outline';
    popular: boolean;
    gradient: string;
  };
}

const PricingCard = ({ plan }: PricingCardProps) => {
  const { user } = useAuth();
  const { subscription_tier, createCheckoutSession, openCustomerPortal } = useSubscription();
  const [loading, setLoading] = React.useState(false);

  const isCurrentPlan = subscription_tier === plan.id;
  const isUpgrade = ['pro', 'enterprise'].includes(plan.id) && subscription_tier === 'free';

  const handlePlanSelection = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para suscribirte');
      return;
    }

    if (isCurrentPlan) {
      // Abrir portal del cliente para gestionar suscripción
      try {
        await openCustomerPortal();
      } catch (error) {
        toast.error('Error al abrir el portal de gestión');
      }
      return;
    }

    if (plan.id === 'free') {
      toast.info('Ya tienes acceso al plan gratuito');
      return;
    }

    try {
      setLoading(true);
      const { url } = await createCheckoutSession(plan.id);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (isCurrentPlan) {
      return subscription_tier === 'free' ? 'Plan Actual' : 'Gestionar Plan';
    }
    if (plan.id === 'free') {
      return 'Plan Gratuito';
    }
    return isUpgrade ? 'Mejorar Plan' : plan.buttonText;
  };

  return (
    <Card 
      className={`group relative hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/80 backdrop-blur-sm ${
        plan.popular 
          ? 'border-2 border-purple-300 scale-105 shadow-xl shadow-purple-200/50' 
          : 'border border-gray-200/50 hover:border-purple-200'
      } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
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

      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <Badge className="bg-green-500 text-white shadow-lg px-3 py-1">
            Plan Actual
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
        </ul>

        <Button 
          className={`w-full h-12 font-semibold transition-all duration-300 ${
            isCurrentPlan
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : plan.popular 
                ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg hover:shadow-purple-300/50 transform hover:scale-105 text-white border-0` 
                : 'hover:bg-gray-50'
          }`}
          variant={isCurrentPlan ? 'default' : plan.buttonVariant}
          size="lg"
          onClick={handlePlanSelection}
          disabled={loading}
        >
          {loading ? 'Procesando...' : getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
