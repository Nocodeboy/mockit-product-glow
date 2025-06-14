
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { MockupGallery } from '@/components/MockupGallery';
import { InteractiveTutorial } from '@/components/onboarding/InteractiveTutorial';
import { CreditsBanner } from '@/components/CreditsBanner';
import ResultsGallery from '@/components/ResultsGallery';
import Testimonials from '@/components/Testimonials';
import PricingSection from '@/components/PricingSection';
import { UserMenu } from '@/components/UserMenu';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Sparkles, Camera, Zap, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedMockups, setGeneratedMockups] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userCredits, setUserCredits] = useState(5);
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    isFirstVisit,
    currentStep,
    showTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial
  } = useOnboarding();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setGeneratedMockups([]);
  };

  const handleResetImage = () => {
    setUploadedImage(null);
    setGeneratedMockups([]);
  };

  const handleGenerateMockups = async () => {
    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "No hay imagen para procesar",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para generar mockups",
        variant: "destructive",
      });
      return;
    }
    
    if (userCredits <= 0) {
      toast({
        title: "Sin créditos",
        description: "No tienes créditos suficientes para generar mockups",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedMockups([]);
    
    try {
      toast({
        title: "Iniciando generación...",
        description: "Enviando tu imagen a nuestra IA para crear los mockups",
      });

      console.log("Calling generate-mockups function with imageUrl:", uploadedImage);

      const { data, error } = await supabase.functions.invoke('generate-mockups', {
        body: { 
          imageUrl: uploadedImage,
          style: "professional"
        }
      });

      console.log("Response from generate-mockups:", { data, error });

      if (error) {
        console.error('Error from edge function:', error);
        throw new Error(error.message || 'Error desconocido del servidor');
      }

      if (data && data.mockups && Array.isArray(data.mockups) && data.mockups.length > 0) {
        const validMockups = data.mockups.filter((mockup: string) => {
          try {
            new URL(mockup);
            return true;
          } catch {
            console.warn("Invalid mockup URL:", mockup);
            return false;
          }
        });

        if (validMockups.length === 0) {
          throw new Error('No se generaron mockups válidos');
        }

        setGeneratedMockups(validMockups);
        setUserCredits(prev => Math.max(0, prev - 1));

        // Guardar la generación en la base de datos con URLs permanentes
        try {
          const { error: insertError } = await supabase
            .from('user_mockups')
            .insert({
              user_id: user.id,
              original_image_url: data.originalImageUrl || uploadedImage,
              mockup_urls: validMockups,
              style: "professional"
            });

          if (insertError) {
            console.error('Error saving to database:', insertError);
            toast({
              title: "Advertencia",
              description: "Los mockups se generaron pero no se pudieron guardar en tu perfil",
              variant: "destructive",
            });
          } else {
            console.log('Generation saved to database with permanent URLs');
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: "Advertencia",
            description: "Los mockups se generaron pero no se pudieron guardar en tu perfil",
            variant: "destructive",
          });
        }

        toast({
          title: "¡Mockups generados exitosamente!",
          description: `${validMockups.length} variaciones profesionales creadas`,
        });
      } else {
        console.error('Invalid response structure:', data);
        throw new Error('No se generaron mockups. Respuesta inválida del servidor.');
      }
    } catch (error) {
      console.error('Error generating mockups:', error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({
        title: "Error al generar mockups",
        description: errorMessage + ". Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <InteractiveTutorial
          currentStep={currentStep}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
        />
      )}

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MockIT
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              Transforma la foto de tu producto en 10 mockups profesionales con IA
            </p>
            
            {/* Credits Banner */}
            <CreditsBanner credits={userCredits} isFirstVisit={isFirstVisit} />
            
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
                <span>Guardado permanente</span>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <UserMenu />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!uploadedImage ? (
            <ImageUpload onImageUpload={handleImageUpload} />
          ) : (
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">Tu producto</h2>
                  <button
                    onClick={handleResetImage}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-sm">Cambiar imagen</span>
                  </button>
                </div>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={uploadedImage} 
                      alt="Producto subido" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-purple-400"
                      onError={(e) => {
                        console.error("Error loading uploaded image");
                        toast({
                          title: "Error al cargar imagen",
                          description: "La imagen no se pudo cargar correctamente",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 mb-4">
                      ¡Perfecto! Ahora genera 10 mockups profesionales que se guardarán permanentemente.
                    </p>
                    <button
                      onClick={handleGenerateMockups}
                      disabled={isGenerating || userCredits === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                    >
                      {isGenerating ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generando y guardando...
                        </span>
                      ) : userCredits === 0 ? (
                        "Sin créditos disponibles"
                      ) : (
                        "Generar y Guardar Mockups"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <MockupGallery mockups={generatedMockups} isLoading={isGenerating} />
            </div>
          )}
        </div>
      </div>

      {/* Landing Page Sections */}
      <ResultsGallery />
      <Testimonials />
      <PricingSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
