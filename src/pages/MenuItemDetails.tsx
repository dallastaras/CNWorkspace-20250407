import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ChevronLeft, 
  Users,
  DollarSign,
  Star,
  BarChart2,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Clock
} from 'lucide-react';
import { TimeframeSelector } from '../components/dashboard/TimeframeSelector';
import { SchoolSelector } from '../components/dashboard/SchoolSelector';

interface DayPerformance {
  day: string;
  participation: number;
  waste: number;
  satisfaction: number;
  cost: number;
  avgProduced: number;
  avgServed: number;
}

const MenuItemDetails = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [showCounts, setShowCounts] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string>('district');
  const [showSchoolieInsights, setShowSchoolieInsights] = useState(false);
  const [schools] = useState([
    { id: 'district', name: 'All Schools' },
    { id: '1', name: 'Cybersoft High' },
    { id: '2', name: 'Cybersoft Middle' },
    { id: '3', name: 'Cybersoft Elementary' },
    { id: '4', name: 'Primero High' },
    { id: '5', name: 'Primero Elementary' }
  ]);

  // Sample data - replace with real data from API
  const item = {
    id: '1',
    name: 'Turkey Tacos',
    category: 'Entree',
    metrics: {
      participation: {
        value: 85,
        trend: 'up',
        change: 8
      },
      cost: {
        value: 1.75,
        trend: 'down',
        change: 5
      },
      waste: {
        value: 3.5,
        trend: 'down',
        change: 2
      }
    },
    nutrition: {
      calories: 350,
      protein: 18,
      carbs: 42,
      fat: 12,
      fiber: 6,
      sodium: 580
    },
    performance: {
      score: 94,
      strengths: [
        'High student acceptance',
        'Good cost efficiency',
        'Low waste',
        'Excellent nutritional balance'
      ],
      warnings: []
    },
    dayPerformance: {
      monday: { participation: 88, waste: 3.2, cost: 1.72, avgProduced: 285, avgServed: 275 },
      tuesday: { participation: 82, waste: 3.8, cost: 1.78, avgProduced: 270, avgServed: 258 },
      wednesday: { participation: 86, waste: 3.4, cost: 1.74, avgProduced: 280, avgServed: 268 },
      thursday: { participation: 84, waste: 3.6, cost: 1.76, avgProduced: 275, avgServed: 262 },
      friday: { participation: 80, waste: 4.0, cost: 1.80, avgProduced: 265, avgServed: 250 }
    }
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId);
  };

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

  const getTrendColor = (trend: 'up' | 'down', isInverse: boolean = false) => {
    const isPositive = isInverse ? trend === 'down' : trend === 'up';
    return isPositive
      ? darkMode ? 'text-green-400' : 'text-green-600'
      : darkMode ? 'text-red-400' : 'text-red-600';
  };

  const renderMetricCard = (
    label: string,
    value: number | string,
    trend: 'up' | 'down',
    change: number,
    icon: React.ReactNode,
    isInverse: boolean = false,
    unit: string = '%'
  ) => (
    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {trend === 'up' ? (
            <TrendingUp className={`w-4 h-4 ${getTrendColor('up', isInverse)}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 ${getTrendColor('down', isInverse)}`} />
          )}
          <span className={`text-sm font-medium ${getTrendColor(trend, isInverse)}`}>
            {trend === 'up' ? '+' : '-'}{change}{unit}
          </span>
        </div>
      </div>
      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {typeof value === 'number' ? `${value}${unit}` : value}
      </div>
    </div>
  );

  const renderDayPerformance = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const metrics = ['participation', 'satisfaction', 'leftover', 'waste', 'cost'] as const;
    
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Day of Week Analysis

          {/*
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Show:
            </span>
            <button
              onClick={() => setShowCounts(false)}
              className={`px-3 py-1 text-sm rounded-lg ${
                !showCounts
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Percentages
            </button>
            <button
              onClick={() => setShowCounts(true)} 
              className={`px-3 py-1 text-sm rounded-lg ${
                showCounts
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Counts
            </button>
          </div>
          */}
          
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                <th className={`px-4 py-2 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Day
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Avg Produced
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Avg Served
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Participation
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Leftover
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Waste %
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Waste $
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {days.map(day => {
                const dayData = item.dayPerformance[day.toLowerCase() as keyof typeof item.dayPerformance];
                return (
                  <tr key={day}>
                    <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {day}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {dayData.avgProduced || 275}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {dayData.avgServed || 265}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${getScoreColor(dayData.participation).text}`}>
                      {showCounts ? dayData.avgServed : ((dayData.avgServed / dayData.avgProduced) * 100).toFixed(1) + '%'}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      getScoreColor(100 - ((dayData.avgProduced - dayData.avgServed) / dayData.avgProduced * 100) * 2).text
                    }`}>
                      {showCounts ? (dayData.avgProduced - dayData.avgServed) : (100 - ((dayData.avgServed / dayData.avgProduced) * 100)).toFixed(1) + '%'}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      getScoreColor(100 - dayData.waste * 10).text
                    }`}>
                      {dayData.waste + '%'}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right ${
                      getScoreColor(100 - dayData.waste * 10).text
                    }`}>
                      ${(dayData.waste * dayData.avgProduced / 100 * 2.50).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/menu-planner/items')} 
        className={`flex items-center text-sm ${
          darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back to Menu Items</span>
      </button>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex-1">
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.name}
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.category}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TimeframeSelector />
          <SchoolSelector
            selectedSchool={selectedSchool}
            schools={schools}
            onSchoolChange={handleSchoolChange}
          />
          <button
            onClick={() => setShowSchoolieInsights(!showSchoolieInsights)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title={showSchoolieInsights ? 'Hide Schoolie' : 'Show Schoolie'}
          >
            <Bot className="w-5 h-5" />
          </button>
          <div className={`px-3 py-1 rounded-full ${getScoreColor(item.performance.score).bg}`}>
            <span className={`text-lg font-bold ${getScoreColor(item.performance.score).text}`}>
              Score: {item.performance.score}
            </span>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {showSchoolieInsights && (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
              <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <div className="flex-1">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {item.name} is one of your top performing menu items with consistently high participation and satisfaction rates.
              {selectedSchool === 'district' 
                ? 'It performs best on Mondays with 88% participation and lowest waste at 3.2%.'
                : `It performs particularly well at ${schools.find(s => s.id === selectedSchool)?.name || 'this school'} with above-average participation.`
              }
              {selectedSchool === '4' 
                ? 'At Primero High, this item has higher waste than other schools. Consider reviewing portion sizes or preparation methods.'
                : 'Cost efficiency is excellent, trending down 5% while maintaining quality.'
              }
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Users className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Participation
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {item.metrics.participation.trend === 'up' ? (
                <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
              ) : (
                <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
              )}
              <span className={`text-sm font-medium ${getTrendColor(item.metrics.participation.trend)}`}>
                {item.metrics.participation.trend === 'up' ? '+' : '-'}{item.metrics.participation.change}%
              </span>
            </div>
          </div>
          <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.metrics.participation.value}%
          </div>
          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {Math.round(item.metrics.participation.value * 2.5)} portions served from {Math.round(item.metrics.participation.value * 2.5 / 0.95)} portions produced
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <DollarSign className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Waste
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {item.metrics.waste.trend === 'up' ? (
                <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
              ) : (
                <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
              )}
              <span className={`text-sm font-medium ${getTrendColor(item.metrics.waste.trend, true)}`}>
                {item.metrics.waste.trend === 'up' ? '+' : '-'}{item.metrics.waste.change}%
              </span>
            </div>
          </div>
          <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${(item.metrics.waste.value * 2.50).toFixed(2)} ({item.metrics.waste.value}%)
          </div>
          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {Math.round(item.metrics.waste.value * 2.5)} wasted portions
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <DollarSign className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Cost
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {item.metrics.cost.trend === 'up' ? (
                <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
              ) : (
                <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
              )}
              <span className={`text-sm font-medium ${getTrendColor(item.metrics.cost.trend, true)}`}>
                {item.metrics.cost.trend === 'up' ? '+' : '-'}{item.metrics.cost.change}%
              </span>
            </div>
          </div>
          <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${item.metrics.cost.value.toFixed(2)}
          </div>
          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            2 Tacos per serving
          </div>
        </div>
      </div>

      {/* Day of Week Analysis */}
      {renderDayPerformance()}

      {/* School Analysis */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          School Analysis

          {/*
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Show:
            </span>
            <button
              onClick={() => setShowCounts(false)}
              className={`px-3 py-1 text-sm rounded-lg ${
                !showCounts
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Percentages
            </button>
            <button
              onClick={() => setShowCounts(true)} 
              className={`px-3 py-1 text-sm rounded-lg ${
                showCounts
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Counts
            </button>
          </div>
          */}
          
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                <th className={`px-4 py-2 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  School
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Avg Produced
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Avg Served
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Participation
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Leftover
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Waste %
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Waste $
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {[
                { 
                  name: 'Cybersoft High',
                  avgProduced: 275,
                  avgServed: 268,
                  participation: 85,
                  leftover: 7,
                  waste: 3.5,
                  cost: 1.72
                },
                { 
                  name: 'Cybersoft Middle',
                  avgProduced: 210,
                  avgServed: 205,
                  participation: 82,
                  leftover: 5,
                  waste: 3.8,
                  cost: 1.78
                },
                { 
                  name: 'Cybersoft Elementary',
                  avgProduced: 165,
                  avgServed: 162,
                  participation: 86,
                  leftover: 3,
                  waste: 3.4,
                  cost: 1.74
                },
                { 
                  name: 'Primero High',
                  avgProduced: 80,
                  avgServed: 72,
                  participation: 65,
                  leftover: 8,
                  waste: 12.5,
                  cost: 1.95
                },
                { 
                  name: 'Primero Elementary',
                  avgProduced: 130,
                  avgServed: 128,
                  participation: 84,
                  leftover: 2,
                  waste: 3.2,
                  cost: 1.76
                }
              ].map((school) => (
                <tr key={school.name}>
                  <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {school.name}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {school.avgProduced}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {school.avgServed}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${getScoreColor(school.participation).text}`}>
                    {showCounts ? school.avgServed : school.participation + '%'}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${
                    getScoreColor(100 - ((school.avgProduced - school.avgServed) / school.avgProduced * 100) * 2).text
                  }`}>
                    {showCounts ? (school.avgProduced - school.avgServed) : (100 - ((school.avgServed / school.avgProduced) * 100)).toFixed(1) + '%'}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${getScoreColor(100 - school.waste * 10).text}`}>
                    {school.waste + '%'}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${getScoreColor(100 - school.waste * 10).text}`}>
                    ${(school.waste * school.avgProduced / 100 * 2.50).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Data shown for {selectedSchool === 'district' ? 'all schools' : schools.find(s => s.id === selectedSchool)?.name || 'selected school'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetails;