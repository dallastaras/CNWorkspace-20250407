import React from 'react';
import { useStore } from '../../../store/useStore';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '../../../types';

interface BaseKPICardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
  isLowerBetter?: boolean;
  formatValue?: (val: number) => string;
  onClick?: () => void;
}

export const BaseKPICard: React.FC<BaseKPICardProps> = ({
  kpi,
  value,
  trend,
  schoolBenchmark,
  expectedBenchmark,
  isLowerBetter = false,
  formatValue: customFormatValue,
  onClick
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const selectedTimeframe = useStore((state) => state.selectedTimeframe);

  const defaultFormatValue = (val: number) => {
    if (kpi.unit === '%') return `${Math.round(val)}%`;
    if (kpi.unit === '$') return `$${val.toFixed(2)}`;
    return val.toLocaleString();
  };

  const formatValue = customFormatValue || defaultFormatValue;

  // Determine if the value is above or below benchmark
  const isAboveBenchmark = value >= expectedBenchmark;
  const isPerformingWell = isLowerBetter ? !isAboveBenchmark : isAboveBenchmark;

  // Get performance indicator styles
  const getPerformanceStyles = () => {
    if (isPerformingWell) {
      return {
        icon: TrendingUp,
        color: darkMode ? 'text-green-400' : 'text-green-600',
        bgColor: darkMode ? 'bg-green-400/10' : 'bg-green-50',
        borderColor: darkMode ? 'border-green-400' : 'border-green-500'
      };
    }
    return {
      icon: TrendingDown,
      color: darkMode ? 'text-red-400' : 'text-red-600',
      bgColor: darkMode ? 'bg-red-400/10' : 'bg-red-50',
      borderColor: darkMode ? 'border-red-400' : 'border-red-500'
    };
  };

  const performanceStyles = getPerformanceStyles();
  const IndicatorIcon = performanceStyles.icon;

  return (
    <div 
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border-t-2 ${
        performanceStyles.borderColor
      } cursor-pointer transition-colors ${
        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {kpi.name}
          </h3>
          <div className={`flex items-center space-x-2 ${performanceStyles.color}`}>
            <div className={`p-1 rounded-full ${performanceStyles.bgColor}`}>
              <IndicatorIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatValue(value)}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Expected
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatValue(expectedBenchmark)}
              </span>
            </div>
            {/*<div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Goal</span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatValue(kpi.goal)}
              </span>
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
};