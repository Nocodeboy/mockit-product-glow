
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        setError('Error al cargar créditos');
        return;
      }

      setCredits(data?.credits || 0);
    } catch (err) {
      console.error('Credits fetch error:', err);
      setError('Error inesperado al cargar créditos');
    } finally {
      setLoading(false);
    }
  };

  const consumeCredit = async (): Promise<boolean> => {
    if (!user || credits <= 0) {
      toast({
        title: "Sin créditos",
        description: "No tienes créditos suficientes para esta acción",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: credits - 1 })
        .eq('id', user.id);

      if (error) {
        console.error('Error consuming credit:', error);
        toast({
          title: "Error",
          description: "No se pudo descontar el crédito",
          variant: "destructive",
        });
        return false;
      }

      setCredits(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error('Credit consumption error:', err);
      toast({
        title: "Error",
        description: "Error inesperado al procesar crédito",
        variant: "destructive",
      });
      return false;
    }
  };

  const addCredits = async (amount: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: credits + amount })
        .eq('id', user.id);

      if (error) {
        console.error('Error adding credits:', error);
        return false;
      }

      setCredits(prev => prev + amount);
      return true;
    } catch (err) {
      console.error('Add credits error:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return {
    credits,
    loading,
    error,
    fetchCredits,
    consumeCredit,
    addCredits
  };
};
