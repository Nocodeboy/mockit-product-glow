
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ImageIcon, Crown, BarChart3 } from 'lucide-react';

interface StatsCardsProps {
  credits: number;
  mockupsCount: number;
  subscription_tier: string;
  subscription_end: string | null;
  subscribed: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  credits,
  mockupsCount,
  subscription_tier,
  subscription_end,
  subscribed
}) => {
  const getPlanDisplayName = (tier: string) => {
    const planNames = {
      'free': 'Gratuito',
      'pro': 'Pro',
      'enterprise': 'Empresas'
    };
    return planNames[tier as keyof typeof planNames] || tier;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Créditos Restantes</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{credits || 0}</div>
          <p className="text-xs text-muted-foreground">
            Plan {getPlanDisplayName(subscription_tier)}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${Math.min((credits / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mockups Creados</CardTitle>
          <ImageIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockupsCount}</div>
          <p className="text-xs text-muted-foreground">
            Total en tu galería
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plan Actual</CardTitle>
          <Crown className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getPlanDisplayName(subscription_tier)}</div>
          <p className="text-xs text-muted-foreground">
            {subscription_end ? `Hasta ${formatDate(subscription_end)}` : 'Plan gratuito'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado Suscripción</CardTitle>
          <BarChart3 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscribed ? 'Activa' : 'Inactiva'}</div>
          <p className="text-xs text-muted-foreground">
            {subscribed ? 'Suscripción vigente' : 'Sin suscripción activa'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
