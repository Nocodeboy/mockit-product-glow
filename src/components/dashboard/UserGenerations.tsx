
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Download, Heart, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      link.download = `mockup-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Descarga iniciada",
        description: "El mockup se está descargando",
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
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/20 rounded-lg h-48 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mockups.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Mis Generaciones
          </CardTitle>
          <CardDescription className="text-gray-300">
            Aquí aparecerán todos tus mockups generados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No tienes generaciones aún
            </h3>
            <p className="text-gray-300 mb-4">
              Sube tu primera imagen para comenzar a crear mockups profesionales
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Mis Generaciones ({mockups.length})
        </CardTitle>
        <CardDescription className="text-gray-300">
          Gestiona y descarga tus mockups generados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockups.map((mockup) => (
            <div key={mockup.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white font-medium">
                    Estilo: {mockup.style || 'Profesional'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(mockup.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(mockup.id, mockup.is_favorite)}
                    className={`${
                      mockup.is_favorite 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${mockup.is_favorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(mockup.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <img
                    src={mockup.original_image_url}
                    alt="Imagen original"
                    className="w-full h-24 object-cover rounded-lg border-2 border-purple-400"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                    Original
                  </div>
                </div>
                
                {mockup.mockup_urls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Mockup ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-white/20"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(url, index)}
                        className="bg-white/20 hover:bg-white/30"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
