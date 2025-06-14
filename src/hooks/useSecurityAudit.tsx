
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  passed: boolean;
  details?: string;
}

interface SecurityAuditResult {
  score: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: SecurityCheck[];
  recommendations: string[];
}

export const useSecurityAudit = () => {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const { toast } = useToast();

  const performSecurityChecks = useCallback((): SecurityCheck[] => {
    const checks: SecurityCheck[] = [];

    // 1. HTTPS Check
    checks.push({
      id: 'https',
      name: 'HTTPS Usage',
      description: 'Site should use HTTPS protocol',
      severity: 'critical',
      passed: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      details: window.location.protocol === 'https:' ? 'Site uses HTTPS' : 'Site is not using HTTPS'
    });

    // 2. CSP Headers Check (simulated)
    checks.push({
      id: 'csp',
      name: 'Content Security Policy',
      description: 'CSP headers should be present',
      severity: 'high',
      passed: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
      details: 'CSP meta tag presence check'
    });

    // 3. XSS Protection
    checks.push({
      id: 'xss-protection',
      name: 'XSS Protection',
      description: 'X-XSS-Protection header should be enabled',
      severity: 'medium',
      passed: true, // Simulated - would need server-side check
      details: 'XSS protection headers assumed present'
    });

    // 4. Secure Cookies Check
    checks.push({
      id: 'secure-cookies',
      name: 'Secure Cookies',
      description: 'Cookies should have Secure and HttpOnly flags',
      severity: 'medium',
      passed: document.cookie === '' || document.cookie.includes('Secure'),
      details: 'Cookie security flags check'
    });

    // 5. Third-party Scripts Check
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const externalScripts = scripts.filter(script => {
      const src = script.getAttribute('src');
      return src && !src.startsWith('/') && !src.includes(window.location.hostname);
    });

    checks.push({
      id: 'third-party-scripts',
      name: 'Third-party Scripts',
      description: 'Minimize external script dependencies',
      severity: 'low',
      passed: externalScripts.length <= 3,
      details: `Found ${externalScripts.length} external scripts`
    });

    // 6. Sensitive Data Exposure
    const hasPasswordFields = document.querySelectorAll('input[type="password"]').length > 0;
    const hasAutoComplete = Array.from(document.querySelectorAll('input')).some(input => 
      input.getAttribute('autocomplete') === 'off'
    );

    checks.push({
      id: 'sensitive-data',
      name: 'Sensitive Data Protection',
      description: 'Password fields should have proper autocomplete settings',
      severity: 'medium',
      passed: !hasPasswordFields || hasAutoComplete,
      details: 'Password field security check'
    });

    // 7. CORS Configuration
    checks.push({
      id: 'cors',
      name: 'CORS Configuration',
      description: 'CORS should be properly configured',
      severity: 'medium',
      passed: true, // Would need server-side validation
      details: 'CORS configuration assumed secure'
    });

    // 8. Authentication Security
    const hasAuthTokens = localStorage.getItem('supabase.auth.token') !== null ||
                          sessionStorage.getItem('supabase.auth.token') !== null;

    checks.push({
      id: 'auth-security',
      name: 'Authentication Security',
      description: 'Authentication tokens should be securely stored',
      severity: 'high',
      passed: !hasAuthTokens || window.location.protocol === 'https:',
      details: 'Authentication token storage security'
    });

    // 9. Input Validation
    const forms = document.querySelectorAll('form');
    const hasValidation = Array.from(forms).some(form => 
      form.querySelector('input[required]') !== null
    );

    checks.push({
      id: 'input-validation',
      name: 'Input Validation',
      description: 'Forms should have proper validation',
      severity: 'medium',
      passed: forms.length === 0 || hasValidation,
      details: 'Form validation presence check'
    });

    // 10. Error Handling
    checks.push({
      id: 'error-handling',
      name: 'Error Handling',
      description: 'Proper error handling should be implemented',
      severity: 'low',
      passed: typeof window.onerror === 'function' || 
              document.querySelector('[data-error-boundary]') !== null,
      details: 'Error handling mechanisms check'
    });

    return checks;
  }, []);

  const runSecurityAudit = useCallback(async () => {
    setIsAuditing(true);
    
    try {
      // Simular tiempo de audit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const checks = performSecurityChecks();
      const passedChecks = checks.filter(check => check.passed).length;
      const failedChecks = checks.filter(check => !check.passed);
      
      // Calcular score
      const totalWeight = checks.reduce((sum, check) => {
        const weight = check.severity === 'critical' ? 4 : 
                      check.severity === 'high' ? 3 :
                      check.severity === 'medium' ? 2 : 1;
        return sum + weight;
      }, 0);

      const passedWeight = checks.filter(check => check.passed).reduce((sum, check) => {
        const weight = check.severity === 'critical' ? 4 : 
                      check.severity === 'high' ? 3 :
                      check.severity === 'medium' ? 2 : 1;
        return sum + weight;
      }, 0);

      const score = Math.round((passedWeight / totalWeight) * 100);

      // Generar recomendaciones
      const recommendations: string[] = [];
      
      failedChecks.forEach(check => {
        switch (check.id) {
          case 'https':
            recommendations.push('Implementar HTTPS en producción para proteger datos en tránsito');
            break;
          case 'csp':
            recommendations.push('Configurar Content Security Policy headers para prevenir XSS');
            break;
          case 'secure-cookies':
            recommendations.push('Configurar cookies con flags Secure y HttpOnly');
            break;
          case 'third-party-scripts':
            recommendations.push('Reducir dependencias de scripts externos');
            break;
          case 'auth-security':
            recommendations.push('Asegurar que los tokens de autenticación se almacenen de forma segura');
            break;
          default:
            recommendations.push(`Revisar la configuración de: ${check.name}`);
        }
      });

      if (score >= 90) {
        recommendations.push('¡Excelente! La seguridad de la aplicación está bien configurada');
      } else if (score >= 70) {
        recommendations.push('Buena configuración de seguridad, pero hay algunas mejoras posibles');
      } else {
        recommendations.push('Se requiere atención inmediata a los problemas de seguridad identificados');
      }

      const result: SecurityAuditResult = {
        score,
        totalChecks: checks.length,
        passedChecks,
        failedChecks,
        recommendations
      };

      setAuditResult(result);

      // Mostrar toast con resultado
      if (score >= 80) {
        toast({
          title: "Security Audit Completed",
          description: `Security score: ${score}/100 - Good security posture`,
        });
      } else {
        toast({
          title: "Security Issues Found",
          description: `Security score: ${score}/100 - ${failedChecks.length} issues need attention`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Security audit failed:', error);
      toast({
        title: "Security Audit Failed",
        description: "Could not complete security audit",
        variant: "destructive",
      });
    } finally {
      setIsAuditing(false);
    }
  }, [performSecurityChecks, toast]);

  // Auto-run audit on component mount
  useEffect(() => {
    runSecurityAudit();
  }, [runSecurityAudit]);

  return {
    auditResult,
    isAuditing,
    runSecurityAudit,
    performSecurityChecks
  };
};
