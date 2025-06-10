
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OptimizedGallery } from './OptimizedGallery';

interface UserMockup {
  id: string;
  original_image_url: string;
  mockup_urls: string[];
  style: string;
  is_favorite: boolean;
  created_at: string;
}

export const UserGenerations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mockups, setMockups] = useState<UserMockup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserMockups = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_mockups')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching mockups:', error);
          return;
        }

        setMockups(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMockups();
  }, [user]);

  const handleToggleFavorite = async (mockupId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('user_mockups')
        .update({ is_favorite: !currentFavorite })
        .eq('id', mockupId);

      if (error) {
        console.error('Error updating favorite:', error);
        return;
      }

      setMockups(prev => 
        prev.map(mockup => 
          mockup.id === mockupId 
            ? { ...mockup, is_favorite: !currentFavorite }
            : mockup
        )
      );

      toast({
        title: currentFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
        description: currentFavorite ? "La generación fue eliminada de tus favoritos" : "La generación fue añadida a tus favoritos",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (mockupId: string) => {
    try {
      const { error } = await supabase
        .from('user_mockups')
        .delete()
        .eq('id', mockupId);

      if (error) {
        console.error('Error deleting mockup:', error);
        return;
      }

      setMockups(prev => prev.filter(mockup => mockup.id !== mockupId));

      toast({
        title: "Generación eliminada",
        description: "La generación fue eliminada correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = index === -1 ? 'original.png' : `mockup-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Descarga iniciada",
        description: index === -1 ? "La imagen original se está descargando" : "El mockup se está descargando",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar la imagen",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-square mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <ImageIcon className="h-7 w-7 text-primary" />
          Mis Generaciones {mockups.length > 0 && `(${mockups.length})`}
        </CardTitle>
        <CardDescription className="text-base">
          Gestiona y descarga tus mockups generados con inteligencia artificial
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <OptimizedGallery
          mockups={mockups}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      </CardContent>
    </Card>
  );
};
