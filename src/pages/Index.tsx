
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { MockupGallery } from '@/components/MockupGallery';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Camera, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      toast({
        title: "Iniciando generación...",
        description: "Enviando tu imagen a nuestra IA para crear los mockups",
      });

      const { data, error } = await supabase.functions.invoke('generate-mockups', {
        body: { 
          imageUrl: uploadedImage,
          style: "professional"
        }
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw new Error(error.message);
      }

      if (data && data.mockups && data.mockups.length > 0) {
        setGeneratedMockups(data.mockups);
        toast({
          title: "¡Mockups generados exitosamente!",
          description: `${data.mockups.length} variaciones profesionales listas para descargar`,
        });
      } else {
        throw new Error('No se generaron mockups');
      }
    } catch (error) {
      console.error('Error generating mockups:', error);
      toast({
        title: "Error al generar mockups",
        description: error instanceof Error ? error.message : "Por favor intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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

              <MockupGallery mockups={generatedMockups} isLoading={isGenerating} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
