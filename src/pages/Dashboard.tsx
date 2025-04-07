import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  DashboardHeader,
  KPICard,
  PerformanceTrends,
  SchoolPerformanceSection,
  SchoolScoreCard,
} from '../components/dashboard';
import { SchoolieInsightsPanel } from '../components/dashboard/SchoolieInsightsPanel';
import { KPIDetailsPanel } from '../components/dashboard/KPIDetailsPanel';
import { KPIConfigPanel } from '../components/dashboard/KPIConfigPanel';
import KPIBenchmarkConfig from '../components/KPIBenchmarkConfig';
import { useDashboardData } from '../hooks/useDashboardData';
import { useSchoolMetrics } from '../hooks/useSchoolMetrics';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { NonServingDayMessage } from '../components/common/NonServingDayMessage';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { getSchoolBenchmarks, updateKPIBatch } from '../lib/api';
import { KPI } from '../types';
import {
  MealsServedCard,
  ParticipationRateCard,
  FoodWasteCard,
  RevenueCard,
  SnackParticipationCard,
  SupperParticipationCard,
  BaseKPICard,
} from '../components/dashboard/kpi-cards';

const Dashboard = () => {
  const [selectedSchool, setSelectedSchool] = useState<string>('district');
  const [isBenchmarkConfigOpen, setIsBenchmarkConfigOpen] = useState(false);
  const [isSchoolieOpen, setIsSchoolieOpen] = useState(false);
  const [isKPIConfigOpen, setIsKPIConfigOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [schoolBenchmarks, setSchoolBenchmarks] = useState<
    Record<string, number>
  >({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();

  const {
    schools,
    kpis,
    kpiValues,
    loading: dashboardLoading,
    error: dashboardError,
    dateRange,
    isNonServingPeriod,
    nonServingReason,
    getAggregatedKPIValue,
    getKPITrend,
    getExpectedBenchmark,
    refreshData,
  } = useDashboardData([selectedSchool]);

  const {
    metrics: schoolMetrics,
    loading: metricsLoading,
    error: metricsError,
  } = useSchoolMetrics({
    districtId: user?.district_id || '',
    selectedSchool,
    dateRange,
  });

  useEffect(() => {
    const fetchSchoolBenchmarks = async () => {
      if (selectedSchool === 'district') {
        setSchoolBenchmarks({});
        return;
      }

      try {
        const benchmarks = await getSchoolBenchmarks(selectedSchool);
        const benchmarkMap = benchmarks.reduce(
          (acc, b) => ({
            ...acc,
            [b.kpi_id]: b.benchmark,
          }),
          {}
        );
        setSchoolBenchmarks(benchmarkMap);
      } catch (error) {
        console.error('Error fetching school benchmarks:', error);
      }
    };

    fetchSchoolBenchmarks();
  }, [selectedSchool]);

  useEffect(() => {
    const handleBenchmarkUpdate = async () => {
      setIsRefreshing(true);
      try {
        await refreshData();
        if (selectedSchool !== 'district') {
          const benchmarks = await getSchoolBenchmarks(selectedSchool);
          const benchmarkMap = benchmarks.reduce(
            (acc, b) => ({
              ...acc,
              [b.kpi_id]: b.benchmark,
            }),
            {}
          );
          setSchoolBenchmarks(benchmarkMap);
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      }
    };

    window.addEventListener('benchmarks-updated', handleBenchmarkUpdate);
    return () => {
      window.removeEventListener('benchmarks-updated', handleBenchmarkUpdate);
    };
  }, [refreshData, selectedSchool]);

  const handleKPIVisibilityChange = async (
    kpiId: string,
    isHidden: boolean
  ) => {
    if (!kpis) return;

    try {
      setIsRefreshing(true);

      // Create updated KPIs array with new visibility
      const updatedKPIs = kpis.map((kpi) =>
        kpi.id === kpiId ? { ...kpi, is_hidden: isHidden } : kpi
      );

      // Persist changes to the database
      await updateKPIBatch(updatedKPIs);

      // Refresh data to get updated KPIs
      await refreshData();
    } catch (error) {
      console.error('Error updating KPI visibility:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleKPIOrderChange = async (updatedKPIs: KPI[]) => {
    if (!kpis) return;

    try {
      setIsRefreshing(true);

      // Update display order for each KPI
      const reorderedKPIs = updatedKPIs.map((kpi, index) => ({
        ...kpi,
        display_order: index,
      }));

      // Persist changes to the database
      await updateKPIBatch(reorderedKPIs);

      // Refresh data to get updated KPIs
      await refreshData();
    } catch (error) {
      console.error('Error updating KPI order:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate waste metrics for the selected school/period
  const getWasteMetrics = () => {
    if (!schoolMetrics?.length) return null;

    // Filter metrics for the selected date range and schools
    const relevantMetrics =
      selectedSchool === 'district'
        ? schoolMetrics
        : schoolMetrics.filter((m) => m.school_id === selectedSchool);

    const dateFilteredMetrics = relevantMetrics.filter((metric) => {
      const metricDate = new Date(metric.date);
      return metricDate >= dateRange.start && metricDate <= dateRange.end;
    });

    // Calculate totals
    const totals = dateFilteredMetrics.reduce(
      (acc, metric) => {
        // Calculate total meals planned/produced
        const totalMeals =
          (metric.lunch_count || 0) + (metric.breakfast_count || 0);

        // Assume we produce 10% more than needed
        const produced = Math.round(totalMeals * 1.1);

        // Calculate waste (difference between produced and served)
        const waste = produced - totalMeals;

        // Calculate waste distribution
        const rts = Math.round(waste * 0.3); // 30% returned to stock
        const carryOver = Math.round(waste * 0.2); // 20% carried over
        const spoilage = Math.round(waste * 0.15); // 15% spoilage
        const discarded = waste - rts - carryOver - spoilage; // Remaining is discarded

        return {
          planned: acc.planned + totalMeals,
          produced: acc.produced + produced,
          served: acc.served + totalMeals,
          waste: acc.waste + discarded,
          rts: acc.rts + rts,
          carryOver: acc.carryOver + carryOver,
          leftOver: acc.leftOver + (waste - discarded),
          spoilage: {
            temperature: acc.spoilage.temperature + Math.round(spoilage * 0.4),
            quality: acc.spoilage.quality + Math.round(spoilage * 0.3),
            expired: acc.spoilage.expired + Math.round(spoilage * 0.3),
          },
        };
      },
      {
        planned: 0,
        produced: 0,
        served: 0,
        waste: 0,
        rts: 0,
        carryOver: 0,
        leftOver: 0,
        spoilage: {
          temperature: 0,
          quality: 0,
          expired: 0,
        },
      }
    );

    return totals;
  };

  // Show loading state only during initial load
  if (dashboardLoading && !kpis?.length) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <LoadingSpinner
          size="lg"
          className={darkMode ? 'text-gray-400' : 'text-gray-500'}
        />
      </div>
    );
  }

  if (dashboardError || metricsError) {
    return (
      <div className="h-[calc(100vh-8rem)]">
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Dashboard"
          message="There was a problem loading the dashboard data. Please try again later."
        />
      </div>
    );
  }

  const selectedSchoolMetrics =
    selectedSchool !== 'district'
      ? schoolMetrics?.find((m) => m.school_id === selectedSchool)
      : null;

  // Order KPIs based on display_order
  const orderedKPIs = kpis?.sort((a, b) => {
    if (a.display_order === b.display_order) {
      return a.name.localeCompare(b.name);
    }
    return a.display_order - b.display_order;
  });

  return (
    <div className="space-y-6">
      <LoadingOverlay isVisible={isRefreshing} />

      <DashboardHeader
        selectedSchool={selectedSchool}
        schools={schools}
        onSchoolChange={setSelectedSchool}
        onOpenBenchmarks={() => setIsBenchmarkConfigOpen(true)}
        onOpenSchoolie={() => setIsSchoolieOpen(true)}
        onOpenKPIConfig={() => setIsKPIConfigOpen(true)}
      />

      {isNonServingPeriod && nonServingReason ? (
        <NonServingDayMessage
          date={dateRange.start}
          reason={nonServingReason}
        />
      ) : (
        <>
          {selectedSchool !== 'district' && selectedSchoolMetrics && (
            <SchoolScoreCard metrics={selectedSchoolMetrics} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderedKPIs
              ?.filter((kpi) => !kpi.is_hidden)
              .map((kpi) => {
                const value = getAggregatedKPIValue(kpi.id);
                const expectedBenchmark = getExpectedBenchmark(
                  kpi,
                  schoolBenchmarks[kpi.id]
                );
                const props = {
                  kpi,
                  value: value || 0,
                  trend: getKPITrend(kpi.id),
                  schoolBenchmark: schoolBenchmarks[kpi.id],
                  expectedBenchmark,
                  onClick: () => setSelectedKPI(kpi),
                };

                switch (kpi.name) {
                  case 'Program Access': {
                    const metrics =
                      selectedSchool !== 'district'
                        ? selectedSchoolMetrics
                        : schoolMetrics?.reduce(
                            (acc, m) => ({
                              freeReducedCount:
                                (acc.freeReducedCount || 0) +
                                m.free_reduced_count,
                            }),
                            { freeReducedCount: 0 }
                          );

                    return <BaseKPICard key={kpi.id} {...props} />;
                  }
                  case 'Meals Served':
                    return <MealsServedCard key={kpi.id} {...props} />;
                  case 'Revenue':
                    return <RevenueCard key={kpi.id} {...props} />;
                  case 'Lunch':
                  case 'Breakfast':
                  case 'Snack':
                    return <ParticipationRateCard key={kpi.id} {...props} />;
                  case 'Supper':
                    return <SupperParticipationCard key={kpi.id} {...props} />;
                  case 'Food Waste':
                    return <FoodWasteCard key={kpi.id} {...props} />;
                  default:
                    return <BaseKPICard key={kpi.id} {...props} />;
                }
              })}
          </div>

          {selectedSchool === 'district' && !isNonServingPeriod && (
            <SchoolPerformanceSection
              loading={metricsLoading}
              metrics={schoolMetrics || []}
              dateRange={dateRange}
            />
          )}

          {kpis?.length > 0 && kpiValues?.length > 0 && (
            <PerformanceTrends
              kpis={kpis}
              kpiValues={kpiValues}
              selectedSchool={selectedSchool}
              dateRange={dateRange}
            />
          )}
        </>
      )}

      <KPIBenchmarkConfig
        isOpen={isBenchmarkConfigOpen}
        onClose={() => setIsBenchmarkConfigOpen(false)}
      />

      <SchoolieInsightsPanel
        isOpen={isSchoolieOpen}
        onClose={() => setIsSchoolieOpen(false)}
        kpis={kpis || []}
        kpiValues={kpiValues || []}
        selectedSchool={selectedSchool}
        schoolMetrics={selectedSchoolMetrics}
        dateRange={dateRange}
      />

      {selectedKPI && (
        <KPIDetailsPanel
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
          kpi={selectedKPI}
          value={getAggregatedKPIValue(selectedKPI.id) || 0}
          trend={getKPITrend(selectedKPI.id)}
          dateRange={dateRange}
          selectedSchool={selectedSchool}
          schoolBenchmark={schoolBenchmarks[selectedKPI.id]}
          expectedBenchmark={getExpectedBenchmark(
            selectedKPI,
            schoolBenchmarks[selectedKPI.id]
          )}
          metrics={
            selectedKPI.name === 'Food Waste' ? getWasteMetrics() : undefined
          }
        />
      )}

      <KPIConfigPanel
        isOpen={isKPIConfigOpen}
        onClose={() => setIsKPIConfigOpen(false)}
        kpis={kpis || []}
        onKPIVisibilityChange={handleKPIVisibilityChange}
        onKPIOrderChange={handleKPIOrderChange}
      />
    </div>
  );
};

export default Dashboard;
