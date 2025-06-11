
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Gift, Zap } from 'lucide-react';

interface CreditsBannerProps {
  credits: number;
  isFirstVisit?: boolean;
}

export const CreditsBanner: React.FC<CreditsBannerProps> = ({ 
  credits, 
  isFirstVisit = false 
}) => {
  if (isFirstVisit && credits >= 5) {
    return (
      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <Gift className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  ¡Bienvenido a MockIT! 
                  <Badge className="bg-green-500 text-white">GRATIS</Badge>
                </h3>
                <p className="text-green-300 text-sm">
                  Tienes <span className="font-bold">{credits} generaciones gratuitas</span> para empezar
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{credits}</div>
              <div className="text-xs text-green-300">créditos</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-green-200 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Cada generación crea 10 mockups únicos • Uso comercial incluido
          </div>
        </CardContent>
      </Card>
    );
  }

  if (credits > 0) {
    return (
      <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30 mb-4">
        <Zap className="h-4 w-4 text-purple-400" />
        <span className="text-white text-sm">
          <span className="font-semibold">{credits}</span> generaciones disponibles
        </span>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 mb-4">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-300 text-sm font-medium">
              Sin créditos disponibles
            </p>
            <p className="text-orange-200 text-xs">
              Upgrade para seguir generando mockups
            </p>
          </div>
          <Badge className="bg-orange-500">Upgrade</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
