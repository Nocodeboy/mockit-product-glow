
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  const checkIfInstalled = useCallback(() => {
    // Detectar si la app está instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isWebApp = (window.navigator as any).standalone === true;
    return isStandalone || isWebApp;
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      toast({
        title: "No se puede instalar",
        description: "La aplicación no se puede instalar en este momento",
        variant: "destructive",
      });
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "¡Aplicación instalada!",
          description: "MockIT se ha instalado correctamente en tu dispositivo",
        });
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        toast({
          title: "Instalación cancelada",
          description: "La instalación fue cancelada por el usuario",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error durante la instalación:', error);
      toast({
        title: "Error de instalación",
        description: "Ocurrió un error durante la instalación",
        variant: "destructive",
      });
      return false;
    }
  }, [deferredPrompt, toast]);

  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        
        // Verificar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                toast({
                  title: "Nueva versión disponible",
                  description: "Reinicia la aplicación para obtener la última versión",
                });
              }
            });
          }
        });

        return registration;
      } catch (error) {
        console.error('Error registrando Service Worker:', error);
        return null;
      }
    }
    return null;
  }, [toast]);

  useEffect(() => {
    setIsInstalled(checkIfInstalled());

    // Listener para el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listeners para detectar cambios de conectividad
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Conexión restaurada",
        description: "La aplicación está funcionando online",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Sin conexión",
        description: "La aplicación funcionará offline con funcionalidad limitada",
        variant: "destructive",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Registrar Service Worker
    registerServiceWorker();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkIfInstalled, registerServiceWorker, toast]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    deferredPrompt
  };
};
