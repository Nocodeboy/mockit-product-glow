
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Download, Heart, Trash2, X, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserMockup {
  id: string;
  original_image_url: string;
  mockup_urls: string[];
  style: string;
  is_favorite: boolean;
  created_at: string;
}

interface OptimizedGalleryProps {
  mockups: UserMockup[];
  onToggleFavorite: (mockupId: string, currentFavorite: boolean) => void;
  onDelete: (mockupId: string) => void;
  onDownload: (url: string, index: number) => void;
}

export const OptimizedGallery: React.FC<OptimizedGalleryProps> = ({
  mockups,
  onToggleFavorite,
  onDelete,
  onDownload
}) => {
  const { toast } = useToast();
  const [selectedMockup, setSelectedMockup] = useState<UserMockup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openGallery = (mockup: UserMockup) => {
    setSelectedMockup(mockup);
    setIsDialogOpen(true);
  };

  const closeGallery = () => {
    setIsDialogOpen(false);
    setSelectedMockup(null);
  };

  const downloadAll = async (mockup: UserMockup) => {
    toast({
      title: "Iniciando descarga masiva",
      description: `Descargando ${mockup.mockup_urls.length} mockups...`,
    });

    // Download original
    onDownload(mockup.original_image_url, -1);
    
    // Download all mockups with delay
    mockup.mockup_urls.forEach((url, index) => {
      setTimeout(() => {
        onDownload(url, index);
      }, (index + 1) * 800);
    });
  };

  if (mockups.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
        <h3 className="text-2xl font-semibold text-foreground mb-3">
          No hay generaciones para mostrar
        </h3>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {mockups.length === 0 ? 
            "Sube tu primera imagen para comenzar a crear mockups profesionales con AI" :
            "No tienes generaciones marcadas como favoritas aún"
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockups.map((mockup) => (
          <Card 
            key={mockup.id} 
            className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
          >
            <CardContent className="p-0">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={mockup.original_image_url}
                  alt="Imagen original"
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => openGallery(mockup)}
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    onClick={() => openGallery(mockup)}
                    className="bg-white/90 text-black hover:bg-white"
                  >
                    Ver {mockup.mockup_urls.length} transformaciones
                  </Button>
                </div>

                {/* Favorite indicator */}
                {mockup.is_favorite && (
                  <div className="absolute top-3 right-3">
                    <Heart className="h-5 w-5 text-red-500 fill-current" />
                  </div>
                )}

                {/* Transformations count */}
                <div className="absolute bottom-3 left-3 bg-black/80 text-white text-sm px-2 py-1 rounded-full">
                  {mockup.mockup_urls.length} variaciones
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {mockup.style || 'Profesional'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(mockup.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleFavorite(mockup.id, mockup.is_favorite)}
                      className={`h-8 w-8 p-0 ${
                        mockup.is_favorite 
                          ? 'text-red-500 hover:text-red-400' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${mockup.is_favorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(mockup.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => downloadAll(mockup)}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Todo
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Galería de Transformaciones
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeGallery}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedMockup && (
            <div className="p-6 pt-0">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg">{selectedMockup.style || 'Profesional'}</p>
                  <p className="text-muted-foreground">
                    {new Date(selectedMockup.created_at).toLocaleDateString('es-ES', {
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
                    variant="outline"
                    onClick={() => onToggleFavorite(selectedMockup.id, selectedMockup.is_favorite)}
                    className={selectedMockup.is_favorite ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${selectedMockup.is_favorite ? 'fill-current' : ''}`} />
                    {selectedMockup.is_favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  </Button>
                  
                  <Button onClick={() => downloadAll(selectedMockup)}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Todo
                  </Button>
                </div>
              </div>

              <Carousel className="w-full">
                <CarouselContent>
                  {/* Original Image */}
                  <CarouselItem>
                    <div className="relative">
                      <div className="w-full h-[500px] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={selectedMockup.original_image_url}
                          alt="Imagen original"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full">
                        Original
                      </div>
                      <Button
                        className="absolute bottom-4 right-4 bg-white/90 text-black hover:bg-white"
                        size="sm"
                        onClick={() => onDownload(selectedMockup.original_image_url, -1)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CarouselItem>
                  
                  {/* Transformed Images */}
                  {selectedMockup.mockup_urls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative">
                        <div className="w-full h-[500px] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={url}
                            alt={`Transformación ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full">
                          Variación {index + 1}
                        </div>
                        <Button
                          className="absolute bottom-4 right-4 bg-white/90 text-black hover:bg-white"
                          size="sm"
                          onClick={() => onDownload(url, index)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
