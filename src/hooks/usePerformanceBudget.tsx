
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceBudget {
  maxLoadTime: number;
  maxBundleSize: number;
  maxMemoryUsage: number;
  maxNetworkRequests: number;
  maxImageSize: number;
}

interface BudgetViolation {
  metric: string;
  actual: number;
  budget: number;
  severity: 'warning' | 'error';
  timestamp: Date;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxLoadTime: 3000, // 3 segundos
  maxBundleSize: 1024 * 1024, // 1MB
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  maxNetworkRequests: 50,
  maxImageSize: 500 * 1024 // 500KB
};

export const usePerformanceBudget = (customBudget?: Partial<PerformanceBudget>) => {
  const [budget] = useState<PerformanceBudget>({ ...DEFAULT_BUDGET, ...customBudget });
  const [violations, setViolations] = useState<BudgetViolation[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  const checkBudget = useCallback(() => {
    const newViolations: BudgetViolation[] = [];

    // Verificar tiempo de carga
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      if (loadTime > budget.maxLoadTime) {
        newViolations.push({
          metric: 'Load Time',
          actual: loadTime,
          budget: budget.maxLoadTime,
          severity: loadTime > budget.maxLoadTime * 1.5 ? 'error' : 'warning',
          timestamp: new Date()
        });
      }
    }

    // Verificar uso de memoria
    // @ts-ignore - memory API is experimental
    const memoryInfo = (performance as any).memory;
    if (memoryInfo && memoryInfo.usedJSHeapSize > budget.maxMemoryUsage) {
      newViolations.push({
        metric: 'Memory Usage',
        actual: memoryInfo.usedJSHeapSize,
        budget: budget.maxMemoryUsage,
        severity: memoryInfo.usedJSHeapSize > budget.maxMemoryUsage * 1.5 ? 'error' : 'warning',
        timestamp: new Date()
      });
    }

    // Verificar número de requests de red
    const resourceEntries = performance.getEntriesByType('resource');
    if (resourceEntries.length > budget.maxNetworkRequests) {
      newViolations.push({
        metric: 'Network Requests',
        actual: resourceEntries.length,
        budget: budget.maxNetworkRequests,
        severity: resourceEntries.length > budget.maxNetworkRequests * 1.5 ? 'error' : 'warning',
        timestamp: new Date()
      });
    }

    // Verificar tamaño de imágenes
    const imageEntries = resourceEntries.filter(entry => 
      entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );
    
    imageEntries.forEach((entry: any) => {
      if (entry.transferSize && entry.transferSize > budget.maxImageSize) {
        newViolations.push({
          metric: `Image Size (${entry.name})`,
          actual: entry.transferSize,
          budget: budget.maxImageSize,
          severity: entry.transferSize > budget.maxImageSize * 2 ? 'error' : 'warning',
          timestamp: new Date()
        });
      }
    });

    return newViolations;
  }, [budget]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    
    const interval = setInterval(() => {
      const newViolations = checkBudget();
      
      if (newViolations.length > 0) {
        setViolations(prev => [...prev, ...newViolations]);
        
        // Mostrar toast para violaciones graves
        const errors = newViolations.filter(v => v.severity === 'error');
        if (errors.length > 0) {
          toast({
            title: "Performance Budget Exceeded",
            description: `${errors.length} critical performance issues detected`,
            variant: "destructive",
          });
        }
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [checkBudget, toast]);

  const getBudgetReport = useCallback(() => {
    const currentViolations = checkBudget();
    const totalViolations = violations.length + currentViolations.length;
    const errorCount = [...violations, ...currentViolations].filter(v => v.severity === 'error').length;
    const warningCount = totalViolations - errorCount;

    return {
      budget,
      totalViolations,
      errorCount,
      warningCount,
      recentViolations: currentViolations,
      allViolations: [...violations, ...currentViolations],
      status: errorCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'good'
    };
  }, [budget, violations, checkBudget]);

  const clearViolations = useCallback(() => {
    setViolations([]);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanup = startMonitoring();
      return cleanup;
    }
  }, [startMonitoring]);

  return {
    budget,
    violations,
    isMonitoring,
    checkBudget,
    getBudgetReport,
    clearViolations,
    startMonitoring
  };
};
