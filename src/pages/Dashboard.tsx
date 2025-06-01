import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, ImageIcon, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OverviewTab from '@/components/dashboard/OverviewTab';
import GalleryTab from '@/components/dashboard/GalleryTab';
import SettingsTab from '@/components/dashboard/SettingsTab';

const Dashboard = () => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder al dashboard</p>
          <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-blue-500 text-white rounded">
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        user={user}
        profileData={profileData}
        subscription_tier={subscription_tier}
      />

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
              <OverviewTab
                credits={credits}
                mockupsCount={mockupsData.length}
                subscription_tier={subscription_tier}
                subscription_end={subscription_end}
                subscribed={subscribed}
                subscriptionLoading={subscriptionLoading}
                onRefreshSubscription={handleRefreshSubscription}
                onManageSubscription={handleManageSubscription}
              />
            </TabsContent>
            
            <TabsContent value="gallery">
              <GalleryTab
                filteredMockups={filteredMockups}
                mockupsData={mockupsData}
                viewMode={viewMode}
                sortBy={sortBy}
                filterBy={filterBy}
                downloadingItems={downloadingItems}
                setViewMode={setViewMode}
                setSortBy={setSortBy}
                setFilterBy={setFilterBy}
                onToggleFavorite={toggleFavorite}
                onDeleteMockup={deleteMockup}
                onDownloadImage={downloadImage}
                onDownloadAll={downloadAllFromMockup}
              />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsTab
                user={user}
                profileData={profileData}
                onSignOut={signOut}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
