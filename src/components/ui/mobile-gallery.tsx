
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from './optimized-image';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileGalleryProps {
  images: string[];
  onDownload?: (url: string, index: number) => void;
  onFavorite?: (index: number) => void;
  favorites?: boolean[];
  className?: string;
}

export const MobileGallery: React.FC<MobileGalleryProps> = ({
  images,
  onDownload,
  onFavorite,
  favorites = [],
  className = ''
}) => {
  const isMobile = useIsMobile();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Swipe gesture handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (selectedIndex !== null) {
      if (isLeftSwipe && selectedIndex < images.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
      if (isRightSwipe && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (selectedIndex < images.length - 1) setSelectedIndex(selectedIndex + 1);
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedIndex(null);
          break;
      }
    };

    if (selectedIndex !== null) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedIndex, images.length]);

  if (!isMobile) {
    // Desktop fallback - simple grid
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
        {images.map((image, index) => (
          <Card key={index} className="group overflow-hidden">
            <CardContent className="p-0 relative aspect-square">
              <div 
                className="w-full h-full cursor-pointer"
                onClick={() => setSelectedIndex(index)}
              >
                <OptimizedImage
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(image, index);
                  }}
                  className="bg-white/20 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4" />
                </Button>
                {onFavorite && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(index);
                    }}
                    className={`bg-white/20 backdrop-blur-sm ${
                      favorites[index] ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${favorites[index] ? 'fill-current' : ''}`} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile Gallery Grid */}
      <div
        ref={scrollRef}
        className={`grid grid-cols-2 gap-3 ${className}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((image, index) => (
          <Card 
            key={index} 
            className="overflow-hidden touch-manipulation"
            onClick={() => setSelectedIndex(index)}
          >
            <CardContent className="p-0 relative aspect-square">
              <OptimizedImage
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
              {favorites[index] && (
                <div className="absolute top-2 right-2">
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Screen Modal for Mobile */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {selectedIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIndex(selectedIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {selectedIndex < images.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIndex(selectedIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <OptimizedImage
                src={images[selectedIndex]}
                alt={`Imagen ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              <Button
                onClick={() => onDownload?.(images[selectedIndex], selectedIndex)}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                <Download className="h-5 w-5 mr-2" />
                Descargar
              </Button>
              
              {onFavorite && (
                <Button
                  onClick={() => onFavorite(selectedIndex)}
                  className={`bg-white/20 backdrop-blur-sm hover:bg-white/30 ${
                    favorites[selectedIndex] ? 'text-red-500' : 'text-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${favorites[selectedIndex] ? 'fill-current' : ''}`} />
                  {favorites[selectedIndex] ? 'Favorito' : 'Favorito'}
                </Button>
              )}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
