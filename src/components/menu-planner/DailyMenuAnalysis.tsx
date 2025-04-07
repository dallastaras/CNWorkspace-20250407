import React from 'react';
import { useStore } from '../../store/useStore';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { 
  Calendar,
  Heart,
  BarChart2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  Sandwich,
  SearchCheck
} from 'lucide-react';
import { format } from 'date-fns';

interface EntreeItem {
  name: string;
  planned: number;
  produced: number;
  served: number;
  leftover: number;
}

interface DailyMenuAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  menu: {
    mainDish: string;
    sideDishes: string[];
    entrees: EntreeItem[];
    score: {
      compliance: number;
      performance: number;
      cost: number;
      overall: number;
    };
    expected: {
      compliance: number;
      performance: number;
      cost: number;
      overall: number;
    };
    warnings?: string[];
    strengths?: string[];
  };
}

export const DailyMenuAnalysis: React.FC<DailyMenuAnalysisProps> = ({
  isOpen,
  onClose,
  date,
  menu
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const getScoreColor = (score: number) => {
    if (score >= 90) return {
      text: darkMode ? 'text-green-400' : 'text-green-600',
      bg: darkMode ? 'bg-green-400/10' : 'bg-green-100'
    };
    if (score >= 80) return {
      text: darkMode ? 'text-blue-400' : 'text-blue-600',
      bg: darkMode ? 'bg-blue-400/10' : 'bg-blue-100'
    };
    if (score >= 70) return {
      text: darkMode ? 'text-amber-400' : 'text-amber-600',
      bg: darkMode ? 'bg-amber-400/10' : 'bg-amber-100'
    };
    return {
      text: darkMode ? 'text-red-400' : 'text-red-600',
      bg: darkMode ? 'bg-red-400/10' : 'bg-red-100'
    };
  };

  const renderScoreComparison = (
    label: string,
    actual: number,
    expected: number,
    icon: React.ReactNode
  ) => {
    const difference = actual - expected;
    const colors = getScoreColor(actual);

    return (
      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {icon}
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {difference >= 0 ? (
              <TrendingUp className={darkMode ? 'text-green-400' : 'text-green-600'} />
            ) : (
              <TrendingDown className={darkMode ? 'text-red-400' : 'text-red-600'} />
            )}
            <span className={`text-sm font-medium ${
              difference >= 0
                ? darkMode ? 'text-green-400' : 'text-green-600'
                : darkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              {difference >= 0 ? '+' : ''}{difference.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Expected
            </div>
            <div className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {expected}%
            </div>
          </div>
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Actual
            </div>
            <div className={`text-lg font-medium ${colors.text}`}>
              {actual}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={format(date, 'EEEE')}
      subtitle={format(date, 'MMMM d, yyyy')}
      icon={<Calendar className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      width="half"
    >
      <div className="px-4 py-6 sm:px-6 space-y-6">
        {/* Entrée Production Table */}
        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center space-x-2 mb-3">
            <Sandwich className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Menu Item Production
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                  <th className={`px-4 py-2 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Menu Item
                  </th>
                  <th className={`px-4 py-2 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Planned
                  </th>
                  <th className={`px-4 py-2 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Produced
                  </th>
                  <th className={`px-4 py-2 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Served
                  </th>
                  <th className={`px-4 py-2 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Leftover
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {[
                  { name: 'Chicken Sandwich', planned: 250, produced: 275, served: 268, leftover: 7 },
                  { name: 'Cheeseburger', planned: 200, produced: 210, served: 205, leftover: 5 },
                  { name: 'Spicy Chicken Sandwich', planned: 150, produced: 165, served: 162, leftover: 3 },
                  { name: 'Garden Burger', planned: 75, produced: 80, served: 72, leftover: 8 },
                  { name: 'Buffalo Chicken Wrap', planned: 125, produced: 130, served: 128, leftover: 2 }
                ].map((item, index) => (
                  <tr key={index}>
                    <td className={`px-4 py-2 text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {item.name}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {item.planned}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {item.produced}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {item.served}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right font-medium ${
                      item.leftover > 5
                        ? darkMode ? 'text-red-400' : 'text-red-600'
                        : darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {item.leftover}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score Comparisons */}
        <div className="space-y-4">
          {renderScoreComparison(
            'Composition',
            menu.score.compliance,
            menu.expected.compliance,
            <SearchCheck className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          )}
          {renderScoreComparison(
            'Performance',
            menu.score.performance,
            menu.expected.performance,
            <BarChart2 className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          )}
          {renderScoreComparison(
            'Cost Efficiency',
            menu.score.cost,
            menu.expected.cost,
            <DollarSign className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          )}
        </div>

        {/* Strengths & Warnings */}
        <div className="grid grid-cols-2 gap-6">
          {menu.strengths && menu.strengths.length > 0 && (
            <div>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Strengths
              </h3>
              <div className="space-y-2">
                {menu.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2"
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {menu.warnings && menu.warnings.length > 0 && (
            <div>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Attention Needed
              </h3>
              <div className="space-y-2">
                {menu.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2"
                  >
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      darkMode ? 'text-amber-400' : 'text-amber-600'
                    }`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {warning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideOutPanel>
  );
};