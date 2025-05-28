
import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MockupGalleryProps {
  mockups: string[];
  isLoading: boolean;
}

export const MockupGallery: React.FC<MockupGalleryProps> = ({ mockups, isLoading }) => {
  const { toast } = useToast();

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mockup-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Descarga iniciada",
        description: `Mockup ${index + 1} descargado exitosamente`,
      });
    } catch (error) {
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar la imagen",
        variant: "destructive",
      });
    }
  };

  const downloadAll = async () => {
    toast({
      title: "Descargando todas las imágenes",
      description: "Las descargas comenzarán automáticamente",
    });
    
    for (let i = 0; i < mockups.length; i++) {
      setTimeout(() => {
        downloadImage(mockups[i], i);
      }, i * 500); // Escalonamos las descargas
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Generando mockups profesionales...
          </h3>
          <p className="text-gray-300">
            Nuestro AI está creando 10 variaciones únicas de tu producto
          </p>
          <div className="mt-6 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Mockups Generados ({mockups.length})
        </h2>
        <Button
          onClick={downloadAll}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
            <img
              src={mockup}
              alt={`Mockup ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                size="sm"
                onClick={() => downloadImage(mockup, index)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Número de mockup */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>💡 Tip: Haz clic en cualquier imagen para descargarla individualmente</p>
      </div>
    </div>
  );
};
