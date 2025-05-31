
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  credits: number;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
    credits: 5
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user || !session) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Checking subscription for user:', user.email);
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error checking subscription:', error);
        toast.error('Error al verificar suscripción');
        return;
      }

      console.log('Subscription data received:', data);

      if (data) {
        setSubscriptionData({
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier || 'free',
          subscription_end: data.subscription_end,
          credits: data.credits || 5
        });
      }
    } catch (error) {
      console.error('Error in checkSubscription:', error);
      toast.error('Error al verificar suscripción');
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (planType: string) => {
    if (!session) {
      toast.error('Debes iniciar sesión para suscribirte');
      throw new Error('Usuario no autenticado');
    }

    try {
      console.log('Creating checkout session for plan:', planType);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error creating checkout:', error);
        toast.error(`Error al crear sesión de pago: ${error.message}`);
        throw error;
      }

      if (data?.error) {
        console.error('Server error:', data.error);
        toast.error(`Error del servidor: ${data.error}`);
        throw new Error(data.error);
      }

      console.log('Checkout session created:', data);
      return data;
    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al procesar el pago: ${errorMessage}`);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    if (!session) {
      toast.error('Debes iniciar sesión');
      throw new Error('Usuario no autenticado');
    }

    try {
      console.log('Opening customer portal');
      
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error opening portal:', error);
        toast.error('Error al abrir portal de gestión');
        throw error;
      }

      console.log('Portal session created:', data);
      
      // Abrir en nueva ventana
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error in openCustomerPortal:', error);
      toast.error('Error al abrir portal de gestión');
      throw error;
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  return {
    ...subscriptionData,
    loading,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal
  };
};
