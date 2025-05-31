
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

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
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (planType: string) => {
    if (!session) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planType },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      }
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const openCustomerPortal = async () => {
    if (!session) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      }
    });

    if (error) {
      throw error;
    }

    window.open(data.url, '_blank');
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
