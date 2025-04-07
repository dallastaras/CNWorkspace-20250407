import React from 'react';
import { useStore } from '../../store/useStore';
import { createLazyComponent } from '../../lib/componentUtils';

// Lazy load components
const KPIGrid = createLazyComponent(() => import('./KPIGrid'));
const PerformanceTrends = createLazyComponent(() => import('./PerformanceTrends'));
const SchoolPerformance = createLazyComponent(() => import('./SchoolPerformance'));
const NonServingDayMessage = createLazyComponent(() => import('./NonServingDayMessage'));

interface DashboardContentProps {
  isNonServingPeriod: boolean;
  nonServingReason?: 'weekend' | 'holiday' | null;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  isNonServingPeriod,
  nonServingReason,
  dateRange
}) => {
  const selectedSchool = useStore(state => state.selectedSchool);
  const schoolMetrics = useStore(state => state.schoolMetrics);

  if (isNonServingPeriod && nonServingReason) {
    return <NonServingDayMessage date={dateRange.start} reason={nonServingReason} />;
  }

  return (
    <>
      <KPIGrid />
      
      {selectedSchool === 'district' && !isNonServingPeriod && (
        <SchoolPerformance
          metrics={schoolMetrics || []}
          dateRange={dateRange}
        />
      )}

      <PerformanceTrends />
    </>
  );
};