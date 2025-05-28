
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { MockupGallery } from '@/components/MockupGallery';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Camera, Zap } from 'lucide-react';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedMockups, setGeneratedMockups] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setGeneratedMockups([]);
  };

  const handleGenerateMockups = async () => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    try {
      // TODO: Implementar llamada a Replicate API
      toast({
        title: "Generando mockups...",
        description: "Este proceso puede tomar unos minutos",
      });
      
      // Simulación temporal
      setTimeout(() => {
        setGeneratedMockups([
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
          "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400",
          "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400",
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
          "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400",
          "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        ]);
        setIsGenerating(false);
        toast({
          title: "¡Mockups generados exitosamente!",
          description: "10 variaciones profesionales listas para descargar",
        });
      }, 3000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error al generar mockups",
        description: "Por favor intenta nuevamente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MockIT
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transforma la foto de tu producto en 10 mockups profesionales con IA
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span>Sube tu imagen</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>IA genera mockups</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Descarga resultados</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!uploadedImage ? (
            <ImageUpload onImageUpload={handleImageUpload} />
          ) : (
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Tu producto</h2>
                <div className="flex items-center gap-4">
                  <img 
                    src={uploadedImage} 
                    alt="Producto subido" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-purple-400"
                  />
                  <div className="flex-1">
                    <p className="text-gray-300 mb-4">
                      ¡Perfecto! Ahora genera 10 mockups profesionales de tu producto.
                    </p>
                    <button
                      onClick={handleGenerateMockups}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      {isGenerating ? "Generando..." : "Generar Mockups"}
                    </button>
                  </div>
                </div>
              </div>

              {generatedMockups.length > 0 && (
                <MockupGallery mockups={generatedMockups} isLoading={isGenerating} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
