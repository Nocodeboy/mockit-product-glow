
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Plus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CreditBalance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    subscribed: boolean;
    subscription_tier?: string;
    subscription_end?: string;
  }>({ subscribed: false });

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching credits:', error);
          return;
        }

        setCredits(data?.credits || 0);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          return;
        }

        setSubscriptionInfo(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCredits();
    fetchSubscription();
  }, [user]);

  const handleBuyCredits = async (packageType: string) => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para comprar créditos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: packageType,
          planType: 'credits'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el proceso de pago. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "No se pudo abrir el portal de gestión. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-white/20 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Subscription Status */}
      {subscriptionInfo.subscribed && (
        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Crown className="h-5 w-5" />
              Suscripción Activa
            </CardTitle>
            <CardDescription className="text-gray-300">
              Plan {subscriptionInfo.subscription_tier} activo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Plan {subscriptionInfo.subscription_tier}</p>
                <p className="text-sm text-gray-300">
                  Renovación: {subscriptionInfo.subscription_end ? 
                    new Date(subscriptionInfo.subscription_end).toLocaleDateString('es-ES') : 
                    'N/A'
                  }
                </p>
              </div>
              <Button
                onClick={handleManageSubscription}
                className="bg-white/20 hover:bg-white/30 border border-white/40"
              >
                Gestionar Suscripción
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credit Balance */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5" />
            Balance de Créditos
          </CardTitle>
          <CardDescription className="text-gray-300">
            Usa tus créditos para generar mockups profesionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{credits}</p>
                <p className="text-sm text-gray-300">créditos disponibles</p>
              </div>
            </div>
          </div>

          {/* Credit packages */}
          <div className="space-y-3">
            <p className="text-sm text-gray-300 font-medium">Paquetes de créditos:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => handleBuyCredits('credits_50')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                50 créditos - $4.99
              </Button>
              <Button
                onClick={() => handleBuyCredits('credits_100')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                100 créditos - $9.99
              </Button>
              <Button
                onClick={() => handleBuyCredits('credits_500')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                500 créditos - $39.99
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
