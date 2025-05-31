
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  ImageIcon, 
  Star, 
  Calendar, 
  Settings, 
  Crown,
  ArrowLeft,
  Download,
  Heart,
  Trash2,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    credits, 
    loading: subscriptionLoading,
    checkSubscription,
    openCustomerPortal 
  } = useSubscription();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState<any>(null);
  const [mockupsData, setMockupsData] = useState<any[]>([]);

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        setProfileData(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadProfileData();
  }, [user]);

  // Cargar mockups del usuario
  useEffect(() => {
    const loadMockups = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_mockups')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading mockups:', error);
          return;
        }

        setMockupsData(data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadMockups();
  }, [user]);

  const handleRefreshSubscription = async () => {
    try {
      await checkSubscription();
      toast.success('Estado de suscripción actualizado');
    } catch (error) {
      toast.error('Error al actualizar suscripción');
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error('Error al abrir portal de gestión');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanDisplayName = (tier: string) => {
    const planNames = {
      'free': 'Gratuito',
      'pro': 'Pro',
      'enterprise': 'Empresas'
    };
    return planNames[tier as keyof typeof planNames] || tier;
  };

  const getPlanColor = (tier: string) => {
    const colors = {
      'free': 'bg-gray-100 text-gray-800',
      'pro': 'bg-purple-100 text-purple-800',
      'enterprise': 'bg-yellow-100 text-yellow-800'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder al dashboard</p>
          <Button onClick={() => navigate('/')}>
            Ir al inicio
          </Button>
        </div>
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
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
            <div className="text-2xl font-bold">{mockupsData.length}</div>
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

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gestión de Suscripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getPlanColor(subscription_tier)}>
                  {getPlanDisplayName(subscription_tier)}
                </Badge>
                {subscribed && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Activa
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {subscription_end 
                  ? `Tu suscripción se renueva el ${formatDate(subscription_end)}`
                  : 'Actualiza tu plan para obtener más créditos y funciones'
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshSubscription}
                disabled={subscriptionLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${subscriptionLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              {subscribed ? (
                <Button size="sm" onClick={handleManageSubscription}>
                  Gestionar Plan
                </Button>
              ) : (
                <Button size="sm" onClick={() => navigate('/#pricing')}>
                  Mejorar Plan
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const GalleryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mi Galería ({mockupsData.length} mockups)</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            Ordenar
          </Button>
        </div>
      </div>

      {mockupsData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes mockups aún</h3>
            <p className="text-gray-600 mb-6">Crea tu primer mockup para verlo aquí</p>
            <Button onClick={() => navigate('/')}>
              Crear Mockup
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockupsData.map((mockup) => (
            <Card key={mockup.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={mockup.original_image_url}
                  alt="Mockup"
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className={`h-4 w-4 ${mockup.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{formatDate(mockup.created_at)}</span>
                  <Badge variant="outline">{mockup.style || 'Sin estilo'}</Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData?.avatar_url} />
              <AvatarFallback>
                {user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Cambiar Avatar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <input 
                type="text" 
                defaultValue={profileData?.full_name || user.email}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                defaultValue={user.email}
                className="w-full p-2 border rounded-md mt-1"
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificaciones por Email</p>
              <p className="text-sm text-gray-600">Recibir actualizaciones sobre nuevas funciones</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recordatorios de Créditos</p>
              <p className="text-sm text-gray-600">Avisar cuando queden pocos créditos</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button>Guardar Cambios</Button>
        <Button variant="outline">Cancelar</Button>
        <Button variant="destructive" onClick={signOut}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a MockIT
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Mi Cuenta</h1>
                <p className="text-gray-600">Gestiona tu perfil y contenido</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getPlanColor(subscription_tier)}>
                Plan {getPlanDisplayName(subscription_tier)}
              </Badge>
              <Avatar>
                <AvatarImage src={profileData?.avatar_url} />
                <AvatarFallback>
                  {user.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-400">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Mi Galería
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            
            <TabsContent value="gallery">
              <GalleryTab />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
