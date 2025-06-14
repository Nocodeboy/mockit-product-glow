import { lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy loaded components
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyAuth = lazy(() => import('@/pages/Auth'));
export const LazyUserGenerations = lazy(() => 
  import('@/components/dashboard/UserGenerations').then(module => ({ 
    default: module.UserGenerations 
  }))
);
export const LazyMockupGallery = lazy(() => 
  import('@/components/MockupGallery').then(module => ({ 
    default: module.MockupGallery 
  }))
);

// Loading fallbacks
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-48 bg-slate-700" />
        <Skeleton className="h-10 w-32 bg-slate-700" />
      </div>
      <Card className="mb-8 bg-slate-800/90">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-64 bg-slate-700" />
            <Skeleton className="h-4 w-96 bg-slate-700" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-800/90">
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full bg-slate-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <Skeleton className="w-full h-48 rounded-lg bg-slate-700" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-slate-700" />
            <Skeleton className="h-4 w-1/2 bg-slate-700" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Wrapper components with Suspense
export const SuspenseDashboard = () => (
  <Suspense fallback={<DashboardSkeleton />}>
    <LazyDashboard />
  </Suspense>
);

export const SuspenseAuth = () => (
  <Suspense fallback={<DashboardSkeleton />}>
    <LazyAuth />
  </Suspense>
);

export const SuspenseUserGenerations = () => (
  <Suspense fallback={<GallerySkeleton />}>
    <LazyUserGenerations />
  </Suspense>
);

export const SuspenseMockupGallery = ({ mockups, isLoading }: { mockups: string[], isLoading: boolean }) => (
  <Suspense fallback={<GallerySkeleton />}>
    <LazyMockupGallery mockups={mockups} isLoading={isLoading} />
  </Suspense>
);
