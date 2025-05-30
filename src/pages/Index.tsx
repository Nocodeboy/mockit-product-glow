
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { MockupGallery } from '@/components/MockupGallery';
import ResultsGallery from '@/components/ResultsGallery';
import Testimonials from '@/components/Testimonials';
import PricingSection from '@/components/PricingSection';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sparkles, Camera, Zap, RotateCcw, User, LogIn, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedMockups, setGeneratedMockups] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setGeneratedMockups([]);
  };

  const handleResetImage = () => {
    setUploadedImage(null);
    setGeneratedMockups([]);
  };

  const handleGenerateMockups = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión requerido",
        description: "Necesitas una cuenta para generar mockups",
        variant: "destructive",
      });
      setShowAuthModal(true);
      return;
    }

    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "No hay imagen para procesar",
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
        
        // Save to user's gallery
        try {
          const { error: saveError } = await supabase
            .from('user_mockups')
            .insert({
              user_id: user.id,
              original_image_url: uploadedImage,
              mockup_urls: validMockups,
              style: 'professional'
            });

          if (saveError) {
            console.error('Error saving to gallery:', saveError);
          }
        } catch (saveError) {
          console.error('Error saving mockups to gallery:', saveError);
        }

        toast({
          title: "¡Mockups generados exitosamente!",
          description: `${validMockups.length} variaciones profesionales listas para descargar`,
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

  const handleAuthAction = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUploadedImage(null);
      setGeneratedMockups([]);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-white">MockIT</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-purple-300 hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Mi Cuenta
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-red-300 hover:bg-white/10 backdrop-blur-sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-purple-300 hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => handleAuthAction('login')}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25"
                  onClick={() => handleAuthAction('signup')}
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 shadow-xl">
              <Sparkles className="h-10 w-10 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              MockIT
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transforma la foto de tu producto en <span className="text-purple-400 font-semibold">10 mockups profesionales</span> con IA
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Camera className="h-4 w-4 text-purple-400" />
              <span>Sube tu imagen</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Zap className="h-4 w-4 text-pink-400" />
              <span>IA genera mockups</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Descarga resultados</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-20">
          {!uploadedImage ? (
            <ImageUpload onImageUpload={handleImageUpload} />
          ) : (
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl shadow-purple-500/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Tu producto</h2>
                  <button
                    onClick={handleResetImage}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:border-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-sm">Cambiar imagen</span>
                  </button>
                </div>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <img 
                        src={uploadedImage} 
                        alt="Producto subido" 
                        className="w-40 h-40 object-cover rounded-2xl border-2 border-purple-400/50 shadow-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error("Error loading uploaded image");
                          toast({
                            title: "Error al cargar imagen",
                            description: "La imagen no se pudo cargar correctamente",
                            variant: "destructive",
                          });
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      ¡Perfecto! Ahora genera 10 mockups profesionales de tu producto con nuestra IA avanzada.
                    </p>
                    <button
                      onClick={handleGenerateMockups}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40"
                    >
                      {isGenerating ? (
                        <span className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Generando mockups mágicos...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Generar Mockups
                        </span>
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

      {/* New Sections with improved styling */}
      <div className="relative z-10">
        <ResultsGallery />
        <Testimonials />
        <PricingSection />
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-xl font-bold text-white">MockIT</span>
            </div>
            <p className="text-gray-400 mb-6">
              Transformando productos en mockups profesionales con IA
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-purple-400 transition-colors">Términos</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Soporte</a>
              <a href="#" className="hover:text-purple-400 transition-colors">API</a>
            </div>
            <p className="text-gray-600 text-xs mt-6">
              © 2024 MockIT. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </div>
  );
};

export default Index;
