
import React, { useState } from 'react';
import { Download, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MockupGalleryProps {
  mockups: string[];
  isLoading: boolean;
}

export const MockupGallery: React.FC<MockupGalleryProps> = ({ mockups, isLoading }) => {
  const { toast } = useToast();
  const [downloadingItems, setDownloadingItems] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const downloadImage = async (imageUrl: string, index: number) => {
    setDownloadingItems(prev => new Set([...prev, index]));
    
    try {
      // Validar URL antes de descargar
      const url = new URL(imageUrl);
      
      const response = await fetch(imageUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('El archivo no es una imagen válida');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Determinar extensión basada en el content-type
      const extension = contentType.includes('png') ? 'png' : 
                      contentType.includes('webp') ? 'webp' : 'jpg';
      
      link.download = `mockup-profesional-${index + 1}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Descarga completada",
        description: `Mockup ${index + 1} descargado exitosamente`,
      });
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast({
        title: "Error al descargar",
        description: `No se pudo descargar el mockup ${index + 1}: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setDownloadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const downloadAll = async () => {
    if (mockups.length === 0) {
      toast({
        title: "No hay mockups",
        description: "No hay mockups para descargar",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Iniciando descarga masiva",
      description: `Descargando ${mockups.length} mockups...`,
    });
    
    // Descargar de a uno para evitar problemas de red
    for (let i = 0; i < mockups.length; i++) {
      setTimeout(() => {
        downloadImage(mockups[i], i);
      }, i * 800); // Espaciar las descargas para evitar sobrecarga
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
    console.error(`Error loading image at index ${index}`);
  };

  const handleImageLoad = (index: number) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Generando mockups profesionales...
          </h3>
          <p className="text-gray-300 mb-6">
            Nuestro AI está creando 10 variaciones únicas de tu producto
          </p>
          <div className="mt-6 bg-gray-700 rounded-full h-2 overflow-hidden max-w-md mx-auto">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse w-3/4 transition-all duration-1000"></div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Esto puede tomar entre 30-60 segundos...
          </p>
        </div>
      </div>
    );
  }

  if (mockups.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Mockups Generados ({mockups.length})
        </h2>
        <Button
          onClick={downloadAll}
          disabled={mockups.length === 0}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar Todos
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mockups.map((mockup, index) => (
          <div
            key={index}
            className="group relative aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-600 hover:border-purple-400 transition-all duration-300"
          >
            {imageErrors.has(index) ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <AlertCircle className="h-8 w-8 mb-2" />
                <span className="text-xs text-center">Error al cargar</span>
              </div>
            ) : (
              <img
                src={mockup}
                alt={`Mockup ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError(index)}
                onLoad={() => handleImageLoad(index)}
                loading="lazy"
              />
            )}
            
            {/* Overlay con controles */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button
                size="sm"
                onClick={() => downloadImage(mockup, index)}
                disabled={downloadingItems.has(index) || imageErrors.has(index)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                {downloadingItems.has(index) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
              
              {!imageErrors.has(index) && (
                <Button
                  size="sm"
                  onClick={() => openImageInNewTab(mockup)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Número de mockup */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              #{index + 1}
              {imageErrors.has(index) ? (
                <AlertCircle className="h-3 w-3 text-red-400" />
              ) : (
                <CheckCircle className="h-3 w-3 text-green-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-400 space-y-2">
        <p>💡 Tip: Haz clic en cualquier imagen para descargarla o verla en tamaño completo</p>
        <p>🎨 Cada mockup es único y generado específicamente para tu producto</p>
      </div>
    </div>
  );
};
