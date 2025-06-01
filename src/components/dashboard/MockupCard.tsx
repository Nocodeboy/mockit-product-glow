
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Trash2, RefreshCw } from 'lucide-react';

interface MockupCardProps {
  mockup: any;
  downloadingItems: Set<string>;
  onToggleFavorite: (id: string, currentFavorite: boolean) => void;
  onDeleteMockup: (id: string) => void;
  onDownloadImage: (url: string, index: number, mockupId: string) => void;
  onDownloadAll: (mockup: any) => void;
}

const MockupCard: React.FC<MockupCardProps> = ({
  mockup,
  downloadingItems,
  onToggleFavorite,
  onDeleteMockup,
  onDownloadImage,
  onDownloadAll
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{mockup.style || 'Sin estilo'}</Badge>
            {mockup.is_favorite && (
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            )}
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(mockup.created_at)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {/* Grid de imágenes */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {mockup.mockup_urls.slice(0, 4).map((url: string, index: number) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={url}
                alt={`Mockup ${index + 1}`}
                className="w-full h-full object-cover rounded-md cursor-pointer group-hover:opacity-75 transition-opacity"
                onClick={() => window.open(url, '_blank')}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadImage(url, index, mockup.id);
                  }}
                  disabled={downloadingItems.has(`${mockup.id}-${index}`)}
                >
                  {downloadingItems.has(`${mockup.id}-${index}`) ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {mockup.mockup_urls.length > 4 && (
          <p className="text-sm text-gray-500 text-center mb-4">
            +{mockup.mockup_urls.length - 4} imágenes más
          </p>
        )}
        
        {/* Acciones */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onDownloadAll(mockup)}
          >
            <Download className="h-4 w-4 mr-1" />
            Descargar Todo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleFavorite(mockup.id, mockup.is_favorite)}
          >
            <Heart className={`h-4 w-4 ${mockup.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteMockup(mockup.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockupCard;
