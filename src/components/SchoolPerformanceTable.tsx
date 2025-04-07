import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SchoolMetrics {
  id: string;
  school_id: string;
  school_name: string;
  date: string;
  program_access_rate: number;
  breakfast_participation_rate: number;
  lunch_participation_rate: number;
  snack_participation_rate: number;
  meal_equivalents: number;
  produced_meals: number;
  served_meals: number;
  eod_tasks_completed: boolean;
}

interface Props {
  metrics: SchoolMetrics[];
  onSchoolClick: (schoolId: string) => void;
}

const SchoolPerformanceTable: React.FC<Props> = ({ metrics, onSchoolClick }) => {
  const darkMode = useStore((state) => state.darkMode);

  const calculateWasteValue = (metric: SchoolMetrics) => {
    if (!metric.produced_meals || !metric.served_meals) return 0;
    const wastedPortions = metric.produced_meals - metric.served_meals;
    return wastedPortions > 0 ? wastedPortions * 2.50 : 0; // $2.50 per portion
  };

  const getWasteColor = (wasteValue: number) => {
    if (wasteValue <= 100) {
      return darkMode ? 'text-green-400' : 'text-green-600';
    } else if (wasteValue <= 250) {
      return darkMode ? 'text-amber-400' : 'text-amber-600';
    }
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getMealsColor = (meq: number) => {
    if (meq >= 1000) {
      return darkMode ? 'text-green-400' : 'text-green-600';
    } else if (meq >= 800) {
      return darkMode ? 'text-amber-400' : 'text-amber-600';
    }
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getParticipationColor = (rate: number, type: 'breakfast' | 'lunch' | 'snack') => {
    const benchmarks = {
      breakfast: { low: 25, high: 35 },
      lunch: { low: 65, high: 75 },
      snack: { low: 15, high: 25 }
    };

    if (rate >= benchmarks[type].high) {
      return darkMode ? 'text-green-400' : 'text-green-600';
    } else if (rate >= benchmarks[type].low) {
      return darkMode ? 'text-amber-400' : 'text-amber-600';
    }
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              School
            </th>
            <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Eco Dis
            </th>
            <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              MEQ
            </th>
            <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Breakfast
            </th>
            <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Lunch
            </th>
            <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Snack
            </th>
            <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Waste
            </th>
          </tr>
        </thead>
        <tbody className={`${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
          {metrics.map((school) => {
            const wasteValue = calculateWasteValue(school);

            return (
              <tr 
                key={school.id} 
                className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                onClick={() => onSchoolClick(school.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {school.school_name || 'Unknown School'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm ${
                    (school.program_access_rate || 0) >= 60
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {(school.program_access_rate || 0).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm ${getMealsColor(school.meal_equivalents || 0)}`}>
                    {(school.meal_equivalents || 0).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm ${getParticipationColor(school.breakfast_participation_rate || 0, 'breakfast')}`}>
                    {(school.breakfast_participation_rate || 0).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm ${getParticipationColor(school.lunch_participation_rate || 0, 'lunch')}`}>
                    {(school.lunch_participation_rate || 0).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm ${getParticipationColor(school.snack_participation_rate || 0, 'snack')}`}>
                    {(school.snack_participation_rate || 0).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm ${getWasteColor(wasteValue)}`}>
                    ${wasteValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolPerformanceTable;