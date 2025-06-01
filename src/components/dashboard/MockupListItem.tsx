
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Trash2 } from 'lucide-react';

interface MockupListItemProps {
  mockup: any;
  onToggleFavorite: (id: string, currentFavorite: boolean) => void;
  onDeleteMockup: (id: string) => void;
  onDownloadAll: (mockup: any) => void;
}

const MockupListItem: React.FC<MockupListItemProps> = ({
  mockup,
  onToggleFavorite,
  onDeleteMockup,
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
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="flex-shrink-0">
            <img
              src={mockup.mockup_urls[0]}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-md cursor-pointer"
              onClick={() => window.open(mockup.mockup_urls[0], '_blank')}
            />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{mockup.style || 'Sin estilo'}</Badge>
              {mockup.is_favorite && (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">
              {mockup.mockup_urls.length} imágenes • {formatDate(mockup.created_at)}
            </p>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onDownloadAll(mockup)}
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar
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
        </div>
      </CardContent>
    </Card>
  );
};

export default MockupListItem;
