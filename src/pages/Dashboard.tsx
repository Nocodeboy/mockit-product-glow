
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserGenerations } from '@/components/dashboard/UserGenerations';
import { AccountSettings } from '@/components/dashboard/AccountSettings';
import { CreditBalance } from '@/components/dashboard/CreditBalance';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Image, Settings, CreditCard, ArrowLeft } from 'lucide-react';
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
      // Limpiar los parámetros de la URL
      navigate('/dashboard', { replace: true });
    } else if (canceled === 'true') {
      toast({
        title: "Pago cancelado",
        description: "El proceso de pago fue cancelado.",
        variant: "destructive",
      });
      // Limpiar los parámetros de la URL
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
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
            </div>
          </div>
          <UserMenu />
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              ¡Bienvenido, {user?.email?.split('@')[0]}!
            </CardTitle>
            <CardDescription className="text-gray-300">
              Administra tus generaciones, cuenta y créditos desde aquí
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Credit Balance */}
        <CreditBalance />

        {/* Main Dashboard Content */}
        <Tabs defaultValue="generations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generations" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Mis Generaciones
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generations">
            <UserGenerations />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
