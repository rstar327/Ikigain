import { lazy, Suspense } from 'react';
import { Route } from 'wouter';

// Micro-optimization: Split routes into smaller chunks
const criticalRoutes = [
  { path: '/', component: lazy(() => import('@/pages/landing')) },
  { path: '/test', component: lazy(() => import('@/pages/test')) },
  { path: '/type-test', component: lazy(() => import('@/pages/type-test')) },
];

const secondaryRoutes = [
  { path: '/results/:sessionId', component: lazy(() => import('@/pages/results')) },
  { path: '/premium-results/:sessionId', component: lazy(() => import('@/pages/premium-results')) },
  { path: '/dashboard', component: lazy(() => import('@/pages/dashboard-simple')) },
];

const utilityRoutes = [
  { path: '/about', component: lazy(() => import('@/pages/about')) },
  { path: '/what-is-ikigai', component: lazy(() => import('@/pages/what-is-ikigai')) },
  { path: '/shop', component: lazy(() => import('@/pages/shop')) },
  { path: '/blog', component: lazy(() => import('@/pages/blog-simple')) },
];

interface OptimizedRouteProps {
  routes: Array<{ path: string; component: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
}

export function OptimizedRoutes({ routes, fallback = <div className="loading-spinner"></div> }: OptimizedRouteProps) {
  return (
    <>
      {routes.map(({ path, component: Component }) => (
        <Route key={path} path={path}>
          <Suspense fallback={fallback}>
            <Component />
          </Suspense>
        </Route>
      ))}
    </>
  );
}

export { criticalRoutes, secondaryRoutes, utilityRoutes };