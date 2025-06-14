
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { usePerformanceBudget } from '@/hooks/usePerformanceBudget';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { usePWA } from '@/hooks/usePWA';
import { 
  Shield, 
  Zap, 
  Smartphone, 
  Activity, 
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

export const MonitoringDashboard = () => {
  const { getPerformanceReport, reportError } = usePerformanceMonitoring();
  const { getBudgetReport, clearViolations } = usePerformanceBudget();
  const { auditResult, isAuditing, runSecurityAudit } = useSecurityAudit();
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();

  const performanceReport = getPerformanceReport();
  const budgetReport = getBudgetReport();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    return ms > 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Monitoring Dashboard</h2>
          <p className="text-gray-400">Sistema completo de monitoreo y seguridad</p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="default" className="bg-green-500">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/90">
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
            <Activity className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-slate-700">
            <Zap className="h-4 w-4 mr-2" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="pwa" className="data-[state=active]:bg-slate-700">
            <Smartphone className="h-4 w-4 mr-2" />
            PWA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Load Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatTime(performanceReport.loadTime)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceReport.memoryUsage ? formatBytes(performanceReport.memoryUsage) : 'N/A'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Network Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceReport.networkRequests}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceReport.errorCount}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Session Duration:</span>
                  <span className="text-white ml-2">{formatTime(performanceReport.sessionDuration)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Viewport:</span>
                  <span className="text-white ml-2">
                    {performanceReport.viewport.width}x{performanceReport.viewport.height}
                  </span>
                </div>
                {performanceReport.connection && (
                  <>
                    <div>
                      <span className="text-gray-400">Connection:</span>
                      <span className="text-white ml-2">{performanceReport.connection.effectiveType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Downlink:</span>
                      <span className="text-white ml-2">{performanceReport.connection.downlink} Mbps</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Performance Budget Status
                <Badge variant={budgetReport.status === 'good' ? 'default' : 
                             budgetReport.status === 'warning' ? 'secondary' : 'destructive'}>
                  {budgetReport.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                {budgetReport.totalViolations} total violations found
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{budgetReport.totalViolations - budgetReport.errorCount - budgetReport.warningCount}</div>
                  <div className="text-sm text-gray-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{budgetReport.warningCount}</div>
                  <div className="text-sm text-gray-400">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{budgetReport.errorCount}</div>
                  <div className="text-sm text-gray-400">Errors</div>
                </div>
              </div>

              {budgetReport.recentViolations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Recent Violations:</h4>
                  {budgetReport.recentViolations.map((violation, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                      <div>
                        <span className="text-white">{violation.metric}</span>
                        <span className="text-gray-400 ml-2">
                          {typeof violation.actual === 'number' ? formatBytes(violation.actual) : violation.actual} / 
                          {typeof violation.budget === 'number' ? formatBytes(violation.budget) : violation.budget}
                        </span>
                      </div>
                      <Badge variant={violation.severity === 'error' ? 'destructive' : 'secondary'}>
                        {violation.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={clearViolations} variant="outline" className="w-full">
                Clear Violations History
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Security Audit Results
                <Button onClick={runSecurityAudit} disabled={isAuditing} size="sm">
                  {isAuditing ? 'Auditing...' : 'Run Audit'}
                </Button>
              </CardTitle>
              {auditResult && (
                <CardDescription>
                  Security Score: {auditResult.score}/100
                </CardDescription>
              )}
            </CardHeader>
            {auditResult && (
              <CardContent className="space-y-4">
                <Progress value={auditResult.score} className="w-full" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{auditResult.passedChecks}</div>
                    <div className="text-sm text-gray-400">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{auditResult.failedChecks.length}</div>
                    <div className="text-sm text-gray-400">Failed</div>
                  </div>
                </div>

                {auditResult.failedChecks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Failed Checks:</h4>
                    {auditResult.failedChecks.map((check) => (
                      <div key={check.id} className="flex items-start gap-3 p-3 bg-slate-700 rounded">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-white">{check.name}</div>
                          <div className="text-sm text-gray-400">{check.description}</div>
                          {check.details && (
                            <div className="text-xs text-gray-500 mt-1">{check.details}</div>
                          )}
                        </div>
                        <Badge variant={
                          check.severity === 'critical' ? 'destructive' :
                          check.severity === 'high' ? 'destructive' :
                          check.severity === 'medium' ? 'secondary' : 'outline'
                        }>
                          {check.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {auditResult.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Recommendations:</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {auditResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="pwa" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">PWA Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Installable</span>
                  {isInstallable ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Installed</span>
                  {isInstalled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Online Status</span>
                  {isOnline ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">PWA Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isInstallable && !isInstalled && (
                  <Button onClick={installApp} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Install App
                  </Button>
                )}
                
                {isInstalled && (
                  <div className="text-center p-4 bg-green-500/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-400 font-medium">App Installed Successfully</p>
                    <p className="text-sm text-gray-400">MockIT is ready to use offline</p>
                  </div>
                )}

                {!isInstallable && !isInstalled && (
                  <div className="text-center p-4 bg-gray-500/20 rounded-lg">
                    <p className="text-gray-400">App not installable on this device</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">PWA Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-slate-700 rounded">
                  <div className="font-medium text-white">Offline Support</div>
                  <div className="text-gray-400">Cache Strategy</div>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded">
                  <div className="font-medium text-white">Push Notifications</div>
                  <div className="text-gray-400">Ready</div>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded">
                  <div className="font-medium text-white">Home Screen</div>
                  <div className="text-gray-400">Installable</div>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded">
                  <div className="font-medium text-white">Background Sync</div>
                  <div className="text-gray-400">Enabled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
