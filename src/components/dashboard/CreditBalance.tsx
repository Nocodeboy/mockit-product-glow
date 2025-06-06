
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

    fetchCredits();
  }, [user]);

  const handleBuyCredits = () => {
    toast({
      title: "Próximamente",
      description: "La compra de créditos estará disponible pronto.",
    });
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
    <Card className="mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{credits}</p>
              <p className="text-sm text-gray-300">créditos disponibles</p>
            </div>
          </div>
          <Button
            onClick={handleBuyCredits}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Comprar Créditos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
