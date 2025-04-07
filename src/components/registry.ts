import { createLazyComponent } from '../lib/componentUtils';

// Dashboard Components
export const DashboardComponents = {
  Content: createLazyComponent(() => import('./dashboard/DashboardContent')),
  KPIGrid: createLazyComponent(() => import('./dashboard/KPIGrid')),
  PerformanceTrends: createLazyComponent(() => import('./dashboard/PerformanceTrends')),
  SchoolPerformance: createLazyComponent(() => import('./dashboard/SchoolPerformance')),
};

// Menu Planner Components
export const MenuPlannerComponents = {
  Content: createLazyComponent(() => import('./menu-planner/MenuPlannerContent')),
  Analytics: createLazyComponent(() => import('./menu-planner/MenuAnalytics')),
  Insights: createLazyComponent(() => import('./menu-planner/MenuInsights')),
  Metrics: createLazyComponent(() => import('./menu-planner/MenuMetrics')),
  Recommendations: createLazyComponent(() => import('./menu-planner/MenuRecommendations')),
};

// Common Components
export const CommonComponents = {
  Card: createLazyComponent(() => import('./common/Card')),
  EmptyState: createLazyComponent(() => import('./common/EmptyState')),
  LoadingSpinner: createLazyComponent(() => import('./common/LoadingSpinner')),
  SlideOutPanel: createLazyComponent(() => import('./common/SlideOutPanel')),
};

// Layout Components
export const LayoutComponents = {
  Navigation: createLazyComponent(() => import('./Navigation')),
  UserMenu: createLazyComponent(() => import('./UserMenu')),
  ModuleLauncher: createLazyComponent(() => import('./ModuleLauncher')),
};