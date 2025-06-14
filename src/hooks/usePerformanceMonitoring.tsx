
import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  networkRequests: number;
  errorCount: number;
}

interface UsePerformanceMonitoringProps {
  enabled?: boolean;
  reportingInterval?: number;
}

export const usePerformanceMonitoring = ({ 
  enabled = true, 
  reportingInterval = 30000 
}: UsePerformanceMonitoringProps = {}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    networkRequests: 0,
    errorCount: 0
  });
  
  const startTimeRef = useRef<number>(Date.now());
  const { toast } = useToast();

  const captureMetrics = useCallback(() => {
    if (!enabled) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const resourceEntries = performance.getEntriesByType('resource');

    // @ts-ignore - memory API is experimental
    const memoryInfo = (performance as any).memory;

    const metrics: PerformanceMetrics = {
      loadTime: navigation?.loadEventEnd - navigation?.navigationStart || 0,
      renderTime: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      memoryUsage: memoryInfo?.usedJSHeapSize,
      networkRequests: resourceEntries.length,
      errorCount: metricsRef.current.errorCount
    };

    metricsRef.current = metrics;

    // Alert si las métricas están mal
    if (metrics.loadTime > 3000) {
      console.warn('Slow page load detected:', metrics.loadTime + 'ms');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      console.warn('High memory usage detected:', metrics.memoryUsage / 1024 / 1024 + 'MB');
    }

    return metrics;
  }, [enabled]);

  const reportError = useCallback((error: Error, context: string) => {
    metricsRef.current.errorCount++;
    
    console.error('Performance Monitor - Error reported:', {
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    if (enabled) {
      toast({
        title: "Error de rendimiento detectado",
        description: `Error en ${context}: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [enabled, toast]);

  const getPerformanceReport = useCallback(() => {
    const currentMetrics = captureMetrics();
    const sessionDuration = Date.now() - startTimeRef.current;

    return {
      ...currentMetrics,
      sessionDuration,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : undefined
    };
  }, [captureMetrics]);

  useEffect(() => {
    if (!enabled) return;

    // Capturar errores globales
    const handleError = (event: ErrorEvent) => {
      reportError(new Error(event.message), 'Global Error Handler');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(new Error(event.reason), 'Unhandled Promise Rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Reporting interval
    const interval = setInterval(() => {
      const report = getPerformanceReport();
      console.log('Performance Report:', report);
    }, reportingInterval);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearInterval(interval);
    };
  }, [enabled, reportingInterval, reportError, getPerformanceReport]);

  return {
    captureMetrics,
    reportError,
    getPerformanceReport,
    getCurrentMetrics: () => metricsRef.current
  };
};
