
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionCardProps {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  subscriptionLoading: boolean;
  onRefreshSubscription: () => void;
  onManageSubscription: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscribed,
  subscription_tier,
  subscription_end,
  subscriptionLoading,
  onRefreshSubscription,
  onManageSubscription
}) => {
  const navigate = useNavigate();

  const getPlanDisplayName = (tier: string) => {
    const planNames = {
      'free': 'Gratuito',
      'pro': 'Pro',
      'enterprise': 'Empresas'
    };
    return planNames[tier as keyof typeof planNames] || tier;
  };

  const getPlanColor = (tier: string) => {
    const colors = {
      'free': 'bg-gray-100 text-gray-800',
      'pro': 'bg-purple-100 text-purple-800',
      'enterprise': 'bg-yellow-100 text-yellow-800'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Gestión de Suscripción
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPlanColor(subscription_tier)}>
                {getPlanDisplayName(subscription_tier)}
              </Badge>
              {subscribed && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Activa
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {subscription_end 
                ? `Tu suscripción se renueva el ${formatDate(subscription_end)}`
                : 'Actualiza tu plan para obtener más créditos y funciones'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefreshSubscription}
              disabled={subscriptionLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${subscriptionLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            {subscribed ? (
              <Button size="sm" onClick={onManageSubscription}>
                Gestionar Plan
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/#pricing')}>
                Mejorar Plan
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
