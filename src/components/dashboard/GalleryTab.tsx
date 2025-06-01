
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MockupCard from './MockupCard';
import MockupListItem from './MockupListItem';

interface GalleryTabProps {
  filteredMockups: any[];
  mockupsData: any[];
  viewMode: 'grid' | 'list';
  sortBy: 'newest' | 'oldest' | 'favorites';
  filterBy: 'all' | 'favorites';
  downloadingItems: Set<string>;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sort: 'newest' | 'oldest' | 'favorites') => void;
  setFilterBy: (filter: 'all' | 'favorites') => void;
  onToggleFavorite: (id: string, currentFavorite: boolean) => void;
  onDeleteMockup: (id: string) => void;
  onDownloadImage: (url: string, index: number, mockupId: string) => void;
  onDownloadAll: (mockup: any) => void;
}

const GalleryTab: React.FC<GalleryTabProps> = ({
  filteredMockups,
  mockupsData,
  viewMode,
  sortBy,
  filterBy,
  downloadingItems,
  setViewMode,
  setSortBy,
  setFilterBy,
  onToggleFavorite,
  onDeleteMockup,
  onDownloadImage,
  onDownloadAll
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Mi Galería</h3>
          <p className="text-gray-600">
            {filteredMockups.length} de {mockupsData.length} generaciones
            {filterBy === 'favorites' && ' favoritas'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filtros */}
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'favorites')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todas</option>
            <option value="favorites">Favoritas</option>
          </select>
          
          {/* Ordenamiento */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'favorites')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="favorites">Favoritas primero</option>
          </select>
          
          {/* Vista */}
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredMockups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterBy === 'favorites' ? 'No tienes mockups favoritos' : 'No tienes mockups aún'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterBy === 'favorites' 
                ? 'Marca algunos mockups como favoritos para verlos aquí'
                : 'Crea tu primer mockup para verlo aquí'
              }
            </p>
            <Button onClick={() => navigate('/')}>
              {filterBy === 'favorites' ? 'Ver todos los mockups' : 'Crear Mockup'}
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMockups.map((mockup) => (
            <MockupCard
              key={mockup.id}
              mockup={mockup}
              downloadingItems={downloadingItems}
              onToggleFavorite={onToggleFavorite}
              onDeleteMockup={onDeleteMockup}
              onDownloadImage={onDownloadImage}
              onDownloadAll={onDownloadAll}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMockups.map((mockup) => (
            <MockupListItem
              key={mockup.id}
              mockup={mockup}
              onToggleFavorite={onToggleFavorite}
              onDeleteMockup={onDeleteMockup}
              onDownloadAll={onDownloadAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryTab;
