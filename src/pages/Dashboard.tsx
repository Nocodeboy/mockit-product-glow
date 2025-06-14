
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SuspenseUserGenerations } from '@/components/LazyComponents';
import { AccountSettings } from '@/components/dashboard/AccountSettings';
import { CreditBalance } from '@/components/dashboard/CreditBalance';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Sparkles, Image, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast({
        title: "¡Pago exitoso!",
        description: "Tu suscripción o compra de créditos se ha procesado correctamente.",
      });
      navigate('/dashboard', { replace: true });
    } else if (canceled === 'true') {
      toast({
        title: "Pago cancelado",
        description: "El proceso de pago fue cancelado.",
        variant: "destructive",
      });
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, toast, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
            </div>
          </div>
          <UserMenu />
        </div>

        {/* Welcome Section - Made darker */}
        <Card className="mb-8 border-slate-700/50 bg-slate-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              ¡Bienvenido de vuelta, {user?.email?.split('@')[0]}! 👋
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Administra tus generaciones, cuenta y créditos desde tu panel personalizado
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Credit Balance with darker styling */}
        <ErrorBoundary>
          <div className="mb-8">
            <CreditBalance />
          </div>
        </ErrorBoundary>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="generations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/90 backdrop-blur-sm border-slate-700/50">
            <TabsTrigger 
              value="generations" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-gray-300"
            >
              <Image className="h-4 w-4" />
              Mis Generaciones
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-gray-300"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generations">
            <ErrorBoundary>
              <SuspenseUserGenerations />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="account">
            <ErrorBoundary>
              <AccountSettings />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
