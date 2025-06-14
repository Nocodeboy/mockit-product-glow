
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ImageCacheOptions {
  preload?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

interface ImageInfo {
  url: string;
  loaded: boolean;
  error: boolean;
  blob?: Blob;
}

const imageCache = new Map<string, ImageInfo>();

const preloadImage = async (url: string): Promise<ImageInfo> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create blob for better caching
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const imageInfo: ImageInfo = {
            url,
            loaded: true,
            error: false,
            blob
          };
          imageCache.set(url, imageInfo);
          resolve(imageInfo);
        })
        .catch(() => {
          const imageInfo: ImageInfo = {
            url,
            loaded: true,
            error: false
          };
          imageCache.set(url, imageInfo);
          resolve(imageInfo);
        });
    };
    
    img.onerror = () => {
      const imageInfo: ImageInfo = {
        url,
        loaded: false,
        error: true
      };
      imageCache.set(url, imageInfo);
      resolve(imageInfo);
    };
    
    img.src = url;
  });
};

export const useImageCache = (urls: string[], options: ImageCacheOptions = {}) => {
  const {
    preload = false,
    cacheTime = 1000 * 60 * 30, // 30 minutes
    staleTime = 1000 * 60 * 15   // 15 minutes
  } = options;

  const { data: imageInfos, isLoading } = useQuery({
    queryKey: ['images', urls],
    queryFn: async () => {
      const promises = urls.map(async (url) => {
        // Check cache first
        const cached = imageCache.get(url);
        if (cached) {
          return cached;
        }

        if (preload) {
          return preloadImage(url);
        }

        // Just return URL for lazy loading
        return {
          url,
          loaded: false,
          error: false
        } as ImageInfo;
      });

      return Promise.all(promises);
    },
    staleTime,
    gcTime: cacheTime,
    enabled: urls.length > 0
  });

  const preloadUrls = useCallback((urlsToPreload: string[]) => {
    urlsToPreload.forEach(url => {
      if (!imageCache.has(url)) {
        preloadImage(url);
      }
    });
  }, []);

  const getCachedImageUrl = useCallback((url: string): string => {
    const cached = imageCache.get(url);
    if (cached?.blob) {
      return URL.createObjectURL(cached.blob);
    }
    return url;
  }, []);

  return {
    imageInfos: imageInfos || [],
    isLoading,
    preloadUrls,
    getCachedImageUrl
  };
};
