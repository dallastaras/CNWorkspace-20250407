import React from 'react';
import { useStore } from '../../store/useStore';
import { Bot, TrendingUp, TrendingDown, Lightbulb, Zap, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { KPI, KPIValue, SchoolMetrics } from '../../types';
import { SlideOutPanel } from '../common/SlideOutPanel';

interface SchoolieInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: KPI[];
  kpiValues: KPIValue[];
  selectedSchool: string;
  schoolMetrics?: SchoolMetrics;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const SchoolieInsightsPanel: React.FC<SchoolieInsightsPanelProps> = ({
  isOpen,
  onClose,
  kpis,
  kpiValues,
  selectedSchool,
  schoolMetrics,
  dateRange,
}) => {
  const { user, darkMode, selectedTimeframe } = useStore();

  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case 'prior-day':
        return 'yesterday';
      case 'day':
        return 'today';
      case 'week':
        return 'this week';
      case 'month':
        return 'this month';
      case 'year':
        return 'this academic year';
      default:
        return 'this period';
    }
  };

  const getKPITrend = (kpiId: string) => {
    const filteredValues = kpiValues
      .filter(v => v.kpi_id === kpiId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (filteredValues.length < 2) return 0;
    return filteredValues[filteredValues.length - 1].value - filteredValues[filteredValues.length - 2].value;
  };

  const getKPIStatus = (kpi: KPI) => {
    const filteredValues = kpiValues.filter(v => v.kpi_id === kpi.id);
    if (!filteredValues.length) return 'no-data';
    
    const latestValue = filteredValues[filteredValues.length - 1].value;
    if (latestValue >= kpi.goal) return 'exceeding';
    if (latestValue >= kpi.benchmark) return 'meeting';
    return 'below';
  };

  const getKPIValue = (kpi: KPI) => {
    const filteredValues = kpiValues.filter(v => v.kpi_id === kpi.id);
    if (!filteredValues.length) return null;
    return filteredValues[filteredValues.length - 1].value;
  };

  const formatKPIValue = (value: number, unit: string) => {
    if (unit === '%') return `${Math.round(value)}%`;
    if (unit === '$') return `$${value.toFixed(2)}`;
    return value.toLocaleString();
  };

  const getKPIImpactFactor = (kpi: KPI) => {
    const value = getKPIValue(kpi);
    if (!value) return null;

    const percentageDiff = ((value - kpi.benchmark) / kpi.benchmark) * 100;
    
    switch (kpi.name) {
      case 'Participation Rate':
        return `This affects approximately ${Math.abs(Math.round(percentageDiff * 10))} students per day`;
      case 'Cost per Meal':
        return `This represents about ${formatKPIValue(Math.abs(percentageDiff * 0.01 * value), '$')} per meal in potential savings`;
      case 'Food Waste':
        return `This equates to roughly ${Math.abs(Math.round(percentageDiff * 5))} servings per day`;
      case 'Revenue Per Meal':
        return `This impacts daily revenue by approximately ${formatKPIValue(Math.abs(percentageDiff * 0.01 * value * 100), '$')}`;
      default:
        return null;
    }
  };

  const analyzeKPIs = () => {
    const analysis = {
      successes: [] as {
        kpi: KPI;
        value: number;
        trend: number;
        achievement: string;
      }[],
      improvements: [] as {
        kpi: KPI;
        value: number;
        gap: number;
        impact: string | null;
        factor: string;
      }[]
    };

    kpis.forEach(kpi => {
      const value = getKPIValue(kpi);
      if (!value) return;

      const trend = getKPITrend(kpi.id);
      const status = getKPIStatus(kpi);

      if (status === 'exceeding' || status === 'meeting') {
        analysis.successes.push({
          kpi,
          value,
          trend,
          achievement: status === 'exceeding' ? 'exceeding goal' : 'meeting benchmark'
        });
      } else {
        // Calculate the gap to benchmark
        const gap = ((kpi.benchmark - value) / kpi.benchmark) * 100;
        
        // Determine contributing factor
        let factor = '';
        if (kpi.name === 'Participation Rate') {
          factor = 'menu variety and student preferences';
        } else if (kpi.name === 'Cost per Meal') {
          factor = 'procurement and production efficiency';
        } else if (kpi.name === 'Food Waste') {
          factor = 'portion control and production planning';
        } else if (kpi.name === 'Revenue Per Meal') {
          factor = 'pricing strategy and à la carte sales';
        } else {
          factor = 'operational processes';
        }

        analysis.improvements.push({
          kpi,
          value,
          gap,
          impact: getKPIImpactFactor(kpi),
          factor
        });
      }
    });

    return analysis;
  };

  const analysis = analyzeKPIs();

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Schoolie Insights"
      icon={<Bot className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle={`Analysis for ${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`}
    >
      <div className="px-4 py-6 sm:px-6 space-y-6">
        {/* Welcome */}
        <div className={`flex items-start space-x-3 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <Bot className={`w-5 h-5 mt-0.5 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <p>Hi {user?.first_name || 'there'}! Here's my analysis of your performance for {getTimeframeLabel()}.</p>
        </div>

        {/* What Went Well */}
        {analysis.successes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className={`w-5 h-5 ${
                darkMode ? 'text-green-400' : 'text-green-500'
              }`} />
              <h3 className={`font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                What Went Well
              </h3>
            </div>
            <div className={`${
              darkMode ? 'bg-gray-700/50' : 'bg-green-50'
            } rounded-lg p-4 space-y-3`}>
              {analysis.successes.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <TrendingUp className={`w-5 h-5 mt-0.5 ${
                    darkMode ? 'text-green-400' : 'text-green-500'
                  }`} />
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">{item.kpi.name}</span> is {item.achievement} at {
                      formatKPIValue(item.value, item.kpi.unit)
                    } {item.trend > 0 && 'and trending upward'}.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas for Improvement */}
        {analysis.improvements.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className={`w-5 h-5 ${
                darkMode ? 'text-amber-400' : 'text-amber-500'
              }`} />
              <h3 className={`font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Areas for Improvement
              </h3>
            </div>
            <div className="space-y-4">
              {analysis.improvements.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    darkMode ? 'bg-gray-700/50' : 'bg-amber-50'
                  } rounded-lg p-4 space-y-2`}
                >
                  <div className="flex items-start space-x-3">
                    <Target className={`w-5 h-5 mt-0.5 ${
                      darkMode ? 'text-amber-400' : 'text-amber-500'
                    }`} />
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-medium">{item.kpi.name}</span> is currently at {
                        formatKPIValue(item.value, item.kpi.unit)
                      }, which is {Math.round(item.gap)}% below benchmark.
                    </div>
                  </div>
                  <div className={`ml-8 text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <p>
                      <span className="font-medium">Contributing Factor:</span> {item.factor}
                    </p>
                    {item.impact && (
                      <p className="mt-1">
                        <span className="font-medium">Impact:</span> {item.impact}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className={`w-5 h-5 ${
              darkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`} />
            <h3 className={`font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Recommended Actions
            </h3>
          </div>
          <div className="space-y-2">
            {analysis.improvements.map((item, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Review {item.kpi.name.toLowerCase()} improvement strategies
              </button>
            ))}
            <button
              className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Schedule team review meeting
            </button>
          </div>
        </div>
      </div>
    </SlideOutPanel>
  );
};