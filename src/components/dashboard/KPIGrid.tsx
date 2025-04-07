import React from 'react';
import { useStore } from '../../store/useStore';
import { KPICard } from './KPICard';
import { useDashboardData } from '../../hooks/useDashboardData';

const KPIGrid: React.FC = () => {
  const kpis = useStore(state => state.kpis);
  const { getAggregatedKPIValue, getKPITrend, getExpectedBenchmark } = useDashboardData();

  // Order KPIs based on display_order
  const orderedKPIs = React.useMemo(() => {
    return kpis
      ?.filter(kpi => !kpi.is_hidden)
      .sort((a, b) => {
        if (a.display_order === b.display_order) {
          return a.name.localeCompare(b.name);
        }
        return a.display_order - b.display_order;
      });
  }, [kpis]);

  if (!orderedKPIs?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {orderedKPIs.map(kpi => {
        const value = getAggregatedKPIValue(kpi.id);
        const expectedBenchmark = getExpectedBenchmark(kpi);
        
        return (
          <KPICard
            key={kpi.id}
            kpi={kpi}
            value={value || 0}
            trend={getKPITrend(kpi.id)}
            expectedBenchmark={expectedBenchmark}
          />
        );
      })}
    </div>
  );
};

export default KPIGrid;