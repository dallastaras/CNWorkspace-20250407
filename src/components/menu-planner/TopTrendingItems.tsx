import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart2, 
  Utensils, 
  Filter, 
  ChevronDown,
  Star
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface TopTrendingItemsProps {
  timeframe?: 'week' | 'month' | 'year';
}

const TopTrendingItems: React.FC<TopTrendingItemsProps> = ({ 
  timeframe = 'month' 
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [filterType, setFilterType] = useState<'overall' | 'participation' | 'satisfaction' | 'revenue' | 'waste'>('overall');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTopPerformers, setShowTopPerformers] = useState(true);

  // Sample data - replace with real data from API
  const trendingItems = [
    { name: 'Turkey Tacos', participation: 85, satisfaction: 92, revenue: 1250, waste: 3.5, trend: 8, overall: 92 },
    { name: 'BBQ Chicken Pizza', participation: 88, satisfaction: 94, revenue: 1180, waste: 3.2, trend: 6, overall: 94 },
    { name: 'Southwest Burrito Bowl', participation: 82, satisfaction: 90, revenue: 1120, waste: 3.8, trend: 5, overall: 90 },
    { name: 'Buffalo Chicken Wrap', participation: 78, satisfaction: 88, revenue: 980, waste: 3.8, trend: 5, overall: 88 },
    { name: 'Italian Sub Sandwich', participation: 76, satisfaction: 88, revenue: 950, waste: 4.2, trend: 4, overall: 86 },
    { name: 'Chicken Sandwich', participation: 78, satisfaction: 85, revenue: 920, waste: 4.8, trend: 4, overall: 85 },
    { name: 'Asian Stir Fry Bowl', participation: 72, satisfaction: 86, revenue: 880, waste: 4.5, trend: 8, overall: 84 },
    { name: 'Breakfast Burrito', participation: 74, satisfaction: 89, revenue: 850, waste: 4.0, trend: 6, overall: 86 },
    { name: 'Greek Yogurt Parfait', participation: 68, satisfaction: 84, revenue: 780, waste: 3.5, trend: 7, overall: 83 },
    { name: 'Mediterranean Bowl', participation: 64, satisfaction: 86, revenue: 760, waste: 4.5, trend: 8, overall: 80 }
  ].sort((a, b) => b[filterType] - a[filterType]);
  
  // Split into top and bottom performers
  const topPerformers = [...trendingItems].sort((a, b) => b[filterType] - a[filterType]).slice(0, 5);
  // For waste, lower is better, so we need to sort differently
  const bottomPerformers = [...trendingItems].sort((a, b) => {
    if (filterType === 'waste') {
      return b[filterType] - a[filterType];
    }
    return a[filterType] - b[filterType];
  }).slice(0, 5);
  
  // Choose which data to display based on the toggle
  const displayData = showTopPerformers ? topPerformers : bottomPerformers;

  const getFilterLabel = () => {
    switch (filterType) {
      case 'overall':
        return 'Overall Performance';
      case 'participation':
        return 'Participation Rate';
      case 'satisfaction':
        return 'Satisfaction Score';
      case 'revenue':
        return 'Revenue';
      case 'waste':
        return 'Food Waste';
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
    }
  };

  const getBarColor = (index: number) => {
    const colors = [
      '#4F46E5', // indigo-600
      '#6366F1', // indigo-500
      '#818CF8', // indigo-400
      '#A5B4FC', // indigo-300
      '#C7D2FE', // indigo-200
      '#E0E7FF', // indigo-100
      '#EAECFF', // indigo-50
      '#4F46E5', // repeat colors for items beyond 7
      '#6366F1',
      '#818CF8'
    ];
    return colors[index];
  };

  const formatValue = (value: number) => {
    if (filterType === 'waste') {
      return `${value.toFixed(1)}%`;
    } else if (filterType === 'revenue') {
      return `$${value.toLocaleString()}`;
    }
    return `${value}${filterType === 'participation' || filterType === 'satisfaction' ? '%' : ''}`;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
            Item Performance Trends
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="relative inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setShowTopPerformers(true)}
                className={`relative inline-flex items-center px-3 py-1.5 rounded-l-lg text-sm font-medium ${
                  showTopPerformers 
                    ? `${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`
                    : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                <TrendingUp className={`w-4 h-4 mr-1 ${showTopPerformers ? 'text-white' : ''}`} />
                Top
              </button>
              <button
                onClick={() => setShowTopPerformers(false)}
                className={`relative inline-flex items-center px-3 py-1.5 rounded-r-lg text-sm font-medium ${
                  !showTopPerformers 
                    ? `${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`
                    : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                <TrendingDown className={`w-4 h-4 mr-1 ${!showTopPerformers ? 'text-white' : ''}`} />
                Bottom
              </button>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">{getFilterLabel()}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isFilterOpen && (
              <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg overflow-hidden z-10 ${
                darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setFilterType('overall');
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterType === 'overall'
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Overall Performance
                </button>
                <button
                  onClick={() => {
                    setFilterType('participation');
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterType === 'participation'
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Participation Rate
                </button>
                <button
                  onClick={() => {
                    setFilterType('waste');
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterType === 'waste'
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Food Waste
                </button>
                <button
                  onClick={() => {
                    setFilterType('satisfaction');
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterType === 'satisfaction'
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Satisfaction Score
                </button>
                <button
                  onClick={() => {
                    setFilterType('revenue');
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterType === 'revenue'
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Revenue
                </button>
              </div>
            )}
          </div>
          {/* Hide timeframe for now
          <div className={`px-3 py-1.5 rounded-lg text-xs ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {getTimeframeLabel()}
          </div>
          */}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              type="number" 
              stroke={darkMode ? '#9ca3af' : '#6b7280'} 
              tickFormatter={(value) => {
                if (filterType === 'waste') {
                  return `${value.toFixed(1)}%`;
                } else if (filterType === 'revenue') {
                  return `$${value}`;
                }
                return `${value}${filterType === 'participation' || filterType === 'satisfaction' ? '%' : ''}`;
              }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke={darkMode ? '#9ca3af' : '#6b7280'} 
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip 
              formatter={(value: number) => formatValue(value)}
              contentStyle={{ 
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#f9fafb' : '#111827'
              }}
            />
            <Bar dataKey={filterType} radius={[0, 4, 4, 0]}>
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* List of some items with more info (hide for now)
      <div className="mt-4 grid grid-cols-2 gap-4">
        {displayData.map((item, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Utensils className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {showTopPerformers ? (
                  <>
                    <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      +{item.trend}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      -{Math.abs(item.trend)}%
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className={`w-3 h-3 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.satisfaction}%
                </span>
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ${item.revenue}
              </span>
            </div>
          </div>
        ))}
      </div>
      */}
    </div>
  );
};

export default TopTrendingItems;