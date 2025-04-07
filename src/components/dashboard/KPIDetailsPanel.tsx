import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Target, Info, Bot, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { KPI } from '../../types';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { LunchParticipationDetails } from './kpi-details/LunchParticipationDetails';
import { FoodWasteDetails } from './kpi-details/FoodWasteDetails';
import { EnrollmentDetails } from './kpi-details/EnrollmentDetails';
import { MEQDetails } from './kpi-details/MEQDetails';
import { RevenueDetails } from './kpi-details/RevenueDetails';
import { MealTypeDetails } from './kpi-details/MealTypeDetails';
import { getSchoolDailyMetrics } from '../../lib/api';
import { SchoolMetrics } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface KPIDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI;
  value: number;
  trend: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  selectedSchool: string;
  schoolBenchmark?: number;
  expectedBenchmark: number;
  metrics?: any;
}

export const KPIDetailsPanel: React.FC<KPIDetailsPanelProps> = ({
  isOpen,
  onClose,
  kpi,
  value,
  trend,
  dateRange,
  selectedSchool,
  schoolBenchmark,
  expectedBenchmark,
  metrics: providedMetrics,
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();
  const [metrics, setMetrics] = useState<SchoolMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const formatValue = (val: number) => {
    if (!kpi) return val.toLocaleString();

    if (kpi.unit === '%') return `${Math.round(val)}%`;
    if (kpi.unit === '$') return `$${val.toFixed(2)}`;

    // For specific KPIs that need whole numbers
    if (
      ['Meals', 'MPLH', 'Staff Training'].includes(
        kpi.name
      )
    ) {
      return Math.round(val).toLocaleString();
    }

    // For specific KPIs that need 2 decimal places
    if (
      ['Cost per Meal', 'Revenue Per Meal', 'Inventory Turnover'].includes(
        kpi.name
      )
    ) {
      return val.toFixed(2);
    }

    // Default formatting for other numeric values
    return val.toLocaleString();
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.district_id || !kpi || !isOpen) return;

      try {
        setLoading(true);
        setError(null);

        const data = await getSchoolDailyMetrics(user.district_id, dateRange);

        // Filter metrics for the selected date range
        const dateFilteredMetrics = data.filter((metric) => {
          const metricDate = new Date(metric.date);
          return metricDate >= dateRange.start && metricDate <= dateRange.end;
        });

        if (selectedSchool === 'district') {
          setMetrics(dateFilteredMetrics);
        } else {
          const schoolMetrics = dateFilteredMetrics.filter(
            (m) => m.school_id === selectedSchool
          );
          setMetrics(schoolMetrics);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError(
          error instanceof Error ? error : new Error('Failed to fetch metrics')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user, kpi, dateRange, selectedSchool, isOpen]);

  const getWasteMetrics = () => {
    if (!metrics?.length) return null;

    // Calculate totals
    const totals = metrics.reduce(
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

  const getMealBreakdown = () => {
    if (
      !metrics?.length ||
      !['Lunch', 'Breakfast', 'Snack', 'Supper'].includes(kpi?.name || '')
    ) {
      return null;
    }

    const isLunch = kpi?.name === 'Lunch';
    const isBreakfast = kpi?.name === 'Breakfast';
    const isSnack = kpi?.name === 'Snack';
    const isSupper = kpi?.name === 'Supper';

    // Count days with meals for the selected meal type
    const servingDays = metrics.filter((metric) => {
      if (isLunch) return metric.lunch_count > 0;
      if (isBreakfast) return metric.breakfast_count > 0;
      if (isSnack) return metric.snack_count > 0;
      if (isSupper) return metric.supper_count > 0;
      return false;
    }).length;

    if (selectedSchool !== 'district') {
      // For single school, sum up all metrics for the period
      const schoolMetrics = metrics[0]; // Get first record for enrollment data
      if (!schoolMetrics) return null;

      const mealCounts = metrics.reduce(
        (acc, metric) => ({
          totalMeals:
            acc.totalMeals +
            (isLunch
              ? metric.lunch_count
              : isBreakfast
              ? metric.breakfast_count
              : isSnack
              ? metric.snack_count
              : isSupper || 0),
          freeMeals:
            acc.freeMeals +
            (isLunch
              ? metric.free_meal_lunch
              : isBreakfast
              ? metric.free_meal_breakfast
              : isSnack
              ? metric.free_meal_snack
              : isSupper || 0),
          reducedMeals:
            acc.reducedMeals +
            (isLunch
              ? metric.reduced_meal_lunch
              : isBreakfast
              ? metric.reduced_meal_breakfast
              : isSnack
              ? metric.reduced_meal_snack
              : isSupper || 0),
          paidMeals:
            acc.paidMeals +
            (isLunch
              ? metric.paid_meal_lunch
              : isBreakfast
              ? metric.paid_meal_breakfast
              : isSnack
              ? metric.paid_meal_snack
              : isSupper || 0),
        }),
        {
          totalMeals: 0,
          freeMeals: 0,
          reducedMeals: 0,
          paidMeals: 0,
        }
      );

      return {
        ...mealCounts,
        totalEnrollment: schoolMetrics.total_enrollment,
        freeCount: schoolMetrics.free_count,
        reducedCount: schoolMetrics.reduced_count,
        operatingDays: servingDays || 1,
      };
    }

    // For district view, sum up all schools' metrics for the period
    return metrics.reduce(
      (acc, m) => ({
        totalMeals:
          acc.totalMeals +
          (isLunch
            ? m.lunch_count
            : isBreakfast
            ? m.breakfast_count
            : isSupper
            ? m.supper_count
            : m.snack_count || 0),
        freeMeals:
          acc.freeMeals +
          (isLunch
            ? m.free_meal_lunch
            : isBreakfast
            ? m.free_meal_breakfast
            : isSupper
            ? m.free_meal_supper
            : m.free_meal_snack || 0),
        reducedMeals:
          acc.reducedMeals +
          (isLunch
            ? m.reduced_meal_lunch
            : isBreakfast
            ? m.reduced_meal_breakfast
            : isSupper
            ? m.reduced_meal_supper
            : m.reduced_meal_snack || 0),
        paidMeals:
          acc.paidMeals +
          (isLunch
            ? m.paid_meal_lunch
            : isBreakfast
            ? m.paid_meal_breakfast
            : isSupper
            ? m.paid_meal_supper
            : m.paid_meal_snack || 0),
        totalEnrollment: acc.totalEnrollment + m.total_enrollment,
        freeCount: acc.freeCount + m.free_count,
        reducedCount: acc.reducedCount + m.reduced_count,
        operatingDays: servingDays || 1,
      }),
      {
        totalMeals: 0,
        freeMeals: 0,
        reducedMeals: 0,
        paidMeals: 0,
        totalEnrollment: 0,
        freeCount: 0,
        reducedCount: 0,
        operatingDays: servingDays || 1,
      }
    );
  };

  const getEnrollmentBreakdown = () => {
    if (!metrics?.length || kpi?.name !== 'Eco Dis') return null;

    if (selectedSchool !== 'district') {
      // For single school view, use latest metrics
      const schoolMetrics = metrics[metrics.length - 1];
      if (!schoolMetrics) return null;

      return {
        totalEnrollment: schoolMetrics.total_enrollment || 0,
        freeCount: schoolMetrics.free_count || 0,
        reducedCount: schoolMetrics.reduced_count || 0,
        paidCount:
          (schoolMetrics.total_enrollment || 0) -
          ((schoolMetrics.free_count || 0) +
            (schoolMetrics.reduced_count || 0)),
      };
    }

    // For district view, prepare school breakdown
    const latestMetricsBySchool = metrics.reduce((acc, metric) => {
      const existingMetric = acc.get(metric.school_id);
      if (
        !existingMetric ||
        new Date(metric.date) > new Date(existingMetric.date)
      ) {
        acc.set(metric.school_id, metric);
      }
      return acc;
    }, new Map<string, SchoolMetrics>());

    const schoolBreakdown = Array.from(latestMetricsBySchool.values()).map(
      (m) => ({
        schoolName: m.school_name || 'Unknown School',
        totalEnrollment: m.total_enrollment || 0,
        freeCount: m.free_count || 0,
        reducedCount: m.reduced_count || 0,
        paidCount:
          (m.total_enrollment || 0) -
          ((m.free_count || 0) + (m.reduced_count || 0)),
      })
    );

    // Calculate district totals
    const totals = schoolBreakdown.reduce(
      (acc, m) => ({
        totalEnrollment: acc.totalEnrollment + m.totalEnrollment,
        freeCount: acc.freeCount + m.freeCount,
        reducedCount: acc.reducedCount + m.reducedCount,
        paidCount: acc.paidCount + m.paidCount,
      }),
      {
        totalEnrollment: 0,
        freeCount: 0,
        reducedCount: 0,
        paidCount: 0,
      }
    );

    return {
      ...totals,
      schoolBreakdown,
    };
  };

  const renderKPISpecificDetails = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner
            size="lg"
            className={darkMode ? 'text-gray-400' : 'text-gray-500'}
          />
        </div>
      );
    }

    if (error) {
      return (
        <div
          className={`${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          } rounded-lg p-4`}
        >
          <div className="flex items-center justify-center">
            <span
              className={`text-sm ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`}
            >
              {error.message}
            </span>
          </div>
        </div>
      );
    }

    if (!metrics.length) {
      return (
        <div
          className={`${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          } rounded-lg p-4`}
        >
          <div className="flex items-center justify-center">
            <span
              className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No data available for the selected period
            </span>
          </div>
        </div>
      );
    }

    if (kpi.name === 'Waste') {
      const wasteMetrics = getWasteMetrics();
      if (!wasteMetrics) return null;
      return <FoodWasteDetails metrics={wasteMetrics} dateRange={dateRange} />;
    }

    if (kpi.name === 'Eco Dis') {
      const breakdown = getEnrollmentBreakdown();
      if (!breakdown) return null;
      return (
        <EnrollmentDetails
          {...breakdown}
          isDistrictView={selectedSchool === 'district'}
        />
      );
    }

    if (['Lunch', 'Breakfast', 'Snack', 'Supper'].includes(kpi.name)) {
      const breakdown = getMealBreakdown();
      if (!breakdown) return null;
      return (
        <LunchParticipationDetails
          {...breakdown}
          dateRange={dateRange}
          operatingDays={breakdown.operatingDays}
          attendanceFactor={0.93}
        />
      );
    }

    if (kpi.name === 'Revenue') {
      if (!metrics.length) return null;
      return <RevenueDetails metrics={metrics} dateRange={dateRange} />;
    }

    if (kpi.name === 'MEQs') {
      if (!metrics.length) return null;
      return <MEQDetails metrics={metrics} dateRange={dateRange} />;
    }

    if (kpi.name === 'Meals') {
      if (!metrics.length) return null;
      return <MealTypeDetails metrics={metrics} dateRange={dateRange} />;
    }

    return null;
  };

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={kpi.name}
      icon={
        <Target
          className={`h-6 w-6 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          } mr-2`}
        />
      }
      subtitle={`Analysis for ${format(
        dateRange.start,
        'MMM d, yyyy'
      )} - ${format(dateRange.end, 'MMM d, yyyy')}`}
      width="2/3"
    >
      <div className="px-4 py-6 sm:px-6 space-y-6">
        {/* Current Value -- Hide this for now
        <div
          className={`${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          } rounded-lg p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              {kpi.name}
            </h3>
          </div>
          <div className="flex items-baseline">
            <span
              className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {formatValue(value)}
            </span>
          </div>
        </div>
        */}

        {/* Period Information */}
        {['Lunch', 'Breakfast', 'Snack', 'Supper'].includes(kpi.name) && (
          <div
            className={`${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            } rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Calendar
                    className={`w-4 h-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {getMealBreakdown()?.operatingDays || 0} serving day
                    {(getMealBreakdown()?.operatingDays || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users
                    className={`w-4 h-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    93% attendance factor
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {console.log('KPI', kpi)}
        {/* KPI-specific details */}
        {renderKPISpecificDetails()}

        {/* Description */}
        <div>
          <h3
            className={`text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            About This Metric
          </h3>
          <div
            className={`${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            } rounded-lg p-4`}
          >
            <div className="flex items-start space-x-3">
              <Info
                className={`w-5 h-5 mt-0.5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <p
                className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {kpi.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideOutPanel>
  );
};
