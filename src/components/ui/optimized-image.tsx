
import React, { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  placeholder,
  onLoad,
  onError,
  priority = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
    onError?.();
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoading(true);
      setError(false);
    }
  }, [onError, fallbackSrc, currentSrc]);

  const defaultPlaceholder = (
    <Skeleton className={`${className} flex items-center justify-center`}>
      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
    </Skeleton>
  );

  if (error && (!fallbackSrc || currentSrc === fallbackSrc)) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted border border-border/50 rounded`}>
        <div className="text-center text-muted-foreground p-4">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Error al cargar imagen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (placeholder || defaultPlaceholder)}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0 absolute inset-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};
