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
  CreditCard,
  Filter,
  SortDesc,
  ExternalLink,
  Grid,
  List
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
  const [filteredMockups, setFilteredMockups] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'favorites'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites'>('all');
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set());

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

  // Filtrar y ordenar mockups
  useEffect(() => {
    let filtered = [...mockupsData];

    // Aplicar filtros
    if (filterBy === 'favorites') {
      filtered = filtered.filter(mockup => mockup.is_favorite);
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'favorites':
          if (a.is_favorite && !b.is_favorite) return -1;
          if (!a.is_favorite && b.is_favorite) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredMockups(filtered);
  }, [mockupsData, sortBy, filterBy]);

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

  const toggleFavorite = async (mockupId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('user_mockups')
        .update({ is_favorite: !currentFavorite })
        .eq('id', mockupId);

      if (error) throw error;

      setMockupsData(prev => 
        prev.map(mockup => 
          mockup.id === mockupId 
            ? { ...mockup, is_favorite: !currentFavorite }
            : mockup
        )
      );

      toast.success(!currentFavorite ? 'Añadido a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Error al actualizar favorito');
    }
  };

  const deleteMockup = async (mockupId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mockup?')) return;

    try {
      const { error } = await supabase
        .from('user_mockups')
        .delete()
        .eq('id', mockupId);

      if (error) throw error;

      setMockupsData(prev => prev.filter(mockup => mockup.id !== mockupId));
      toast.success('Mockup eliminado correctamente');
    } catch (error) {
      console.error('Error deleting mockup:', error);
      toast.error('Error al eliminar mockup');
    }
  };

  const downloadImage = async (imageUrl: string, index: number, mockupId: string) => {
    const downloadKey = `${mockupId}-${index}`;
    setDownloadingItems(prev => new Set([...prev, downloadKey]));
    
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `mockup-${mockupId}-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Imagen descargada correctamente');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error al descargar la imagen');
    } finally {
      setDownloadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(downloadKey);
        return newSet;
      });
    }
  };

  const downloadAllFromMockup = async (mockup: any) => {
    toast.success(`Descargando ${mockup.mockup_urls.length} imágenes...`);
    
    for (let i = 0; i < mockup.mockup_urls.length; i++) {
      setTimeout(() => {
        downloadImage(mockup.mockup_urls[i], i, mockup.id);
      }, i * 500);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Mi Galería</h3>
          <p className="text-gray-600">
            {filteredMockups.length} de {mockupsData.length} generaciones
            {filterBy === 'favorites' && ' favoritas'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filtros */}
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'favorites')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todas</option>
            <option value="favorites">Favoritas</option>
          </select>
          
          {/* Ordenamiento */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'favorites')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="favorites">Favoritas primero</option>
          </select>
          
          {/* Vista */}
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredMockups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterBy === 'favorites' ? 'No tienes mockups favoritos' : 'No tienes mockups aún'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterBy === 'favorites' 
                ? 'Marca algunos mockups como favoritos para verlos aquí'
                : 'Crea tu primer mockup para verlo aquí'
              }
            </p>
            <Button onClick={() => navigate('/')}>
              {filterBy === 'favorites' ? 'Ver todos los mockups' : 'Crear Mockup'}
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMockups.map((mockup) => (
            <Card key={mockup.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{mockup.style || 'Sin estilo'}</Badge>
                    {mockup.is_favorite && (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(mockup.created_at)}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                {/* Grid de imágenes */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {mockup.mockup_urls.slice(0, 4).map((url: string, index: number) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={url}
                        alt={`Mockup ${index + 1}`}
                        className="w-full h-full object-cover rounded-md cursor-pointer group-hover:opacity-75 transition-opacity"
                        onClick={() => window.open(url, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(url, index, mockup.id);
                          }}
                          disabled={downloadingItems.has(`${mockup.id}-${index}`)}
                        >
                          {downloadingItems.has(`${mockup.id}-${index}`) ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {mockup.mockup_urls.length > 4 && (
                  <p className="text-sm text-gray-500 text-center mb-4">
                    +{mockup.mockup_urls.length - 4} imágenes más
                  </p>
                )}
                
                {/* Acciones */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => downloadAllFromMockup(mockup)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar Todo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(mockup.id, mockup.is_favorite)}
                  >
                    <Heart className={`h-4 w-4 ${mockup.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMockup(mockup.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Vista de lista */
        <div className="space-y-4">
          {filteredMockups.map((mockup) => (
            <Card key={mockup.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    <img
                      src={mockup.mockup_urls[0]}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md cursor-pointer"
                      onClick={() => window.open(mockup.mockup_urls[0], '_blank')}
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{mockup.style || 'Sin estilo'}</Badge>
                      {mockup.is_favorite && (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {mockup.mockup_urls.length} imágenes • {formatDate(mockup.created_at)}
                    </p>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadAllFromMockup(mockup)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(mockup.id, mockup.is_favorite)}
                    >
                      <Heart className={`h-4 w-4 ${mockup.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMockup(mockup.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
