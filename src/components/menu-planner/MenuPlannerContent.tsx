import React from 'react';
import { useStore } from '../../store/useStore';
import { createLazyComponent } from '../../lib/componentUtils';

// Lazy load components
const MenuAnalytics = createLazyComponent(() => import('./MenuAnalytics'));
const MenuInsights = createLazyComponent(() => import('./MenuInsights'));
const MenuMetrics = createLazyComponent(() => import('./MenuMetrics'));
const MenuRecommendations = createLazyComponent(() => import('./MenuRecommendations'));

interface MenuPlannerContentProps {
  showSchoolieInsights: boolean;
  menuAnalysis: any; // Replace with proper type
}

export const MenuPlannerContent: React.FC<MenuPlannerContentProps> = ({
  showSchoolieInsights,
  menuAnalysis
}) => {
  const darkMode = useStore(state => state.darkMode);

  return (
    <div className="space-y-6">
      {showSchoolieInsights && (
        <MenuInsights analysis={menuAnalysis} />
      )}

      <MenuMetrics analysis={menuAnalysis} />
      <MenuAnalytics analysis={menuAnalysis} />
      <MenuRecommendations analysis={menuAnalysis} />
    </div>
  );
};