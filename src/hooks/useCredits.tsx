
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query for better caching and error handling
  const {
    data: credits = 0,
    isLoading: loading,
    error,
    refetch: fetchCredits
  } = useQuery({
    queryKey: ['credits', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        throw new Error('Error al cargar créditos');
      }

      return data?.credits || 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on permission errors
      if (error?.message?.includes('permission') || error?.message?.includes('auth')) {
        return false;
      }
      return failureCount < 2;
    }
  });

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

      // Update the cache immediately for better UX
      queryClient.setQueryData(['credits', user.id], Math.max(0, credits - 1));
      
      // Refresh data from server to ensure consistency
      setTimeout(() => fetchCredits(), 1000);

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

      // Update cache immediately
      queryClient.setQueryData(['credits', user.id], credits + amount);
      
      // Refresh from server
      setTimeout(() => fetchCredits(), 1000);

      return true;
    } catch (err) {
      console.error('Add credits error:', err);
      return false;
    }
  };

  return {
    credits,
    loading,
    error: error?.message || null,
    fetchCredits,
    consumeCredit,
    addCredits
  };
};
