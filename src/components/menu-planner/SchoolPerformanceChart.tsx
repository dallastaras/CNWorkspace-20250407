import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  School, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SchoolPerformanceChartProps {
  timeframe?: 'week' | 'month' | 'year';
}

const SchoolPerformanceChart: React.FC<SchoolPerformanceChartProps> = ({ 
  timeframe = 'month' 
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [filterType, setFilterType] = useState<'waste' | 'accuracy' | 'overall'>('overall');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTopPerformers, setShowTopPerformers] = useState(true);

  // Sample data - replace with real data from API
  const schoolPerformance = [
    { 
      name: 'Cybersoft High', 
      planned: 1275, 
      produced: 1320, 
      served: 1268, 
      waste: 52,
      wastePercentage: 3.9,
      accuracy: 96.1,
      overall: 94
    },
    { 
      name: 'Cybersoft Middle', 
      planned: 850, 
      produced: 875, 
      served: 845, 
      waste: 30,
      wastePercentage: 3.4,
      accuracy: 96.6,
      overall: 95
    },
    { 
      name: 'Cybersoft Elementary', 
      planned: 675, 
      produced: 690, 
      served: 672, 
      waste: 18,
      wastePercentage: 2.6,
      accuracy: 97.4,
      overall: 96
    },
    { 
      name: 'Primero High', 
      planned: 1200, 
      produced: 1350, 
      served: 1180, 
      waste: 170,
      wastePercentage: 12.6,
      accuracy: 87.4,
      overall: 78
    },
    { 
      name: 'Primero Elementary', 
      planned: 600, 
      produced: 630, 
      served: 595, 
      waste: 35,
      wastePercentage: 5.6,
      accuracy: 94.4,
      overall: 92
    }
  ];
  
  // Sort and filter the data based on user selections
  const sortedSchoolPerformance = [...schoolPerformance].sort((a, b) => {
    if (filterType === 'waste') {
      return showTopPerformers 
        ? a.wastePercentage - b.wastePercentage  // For waste, lower is better for top performers
        : b.wastePercentage - a.wastePercentage;
    } else if (filterType === 'accuracy') {
      return showTopPerformers
        ? b.accuracy - a.accuracy
        : a.accuracy - b.accuracy;
    } else {
      return showTopPerformers
        ? b.overall - a.overall
        : a.overall - b.overall;
    }
  });
  
  // Limit to 5 schools for display
  const displayData = sortedSchoolPerformance.slice(0, 5);

  const getFilterLabel = () => {
    switch (filterType) {
      case 'waste':
        return 'Food Waste';
      case 'accuracy':
        return 'Production Accuracy';
      case 'overall':
        return 'Overall Performance';
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

  const getBarColor = (value: number, type: 'waste' | 'accuracy' | 'overall') => {
    if (type === 'waste') {
      if (value <= 5) return '#22c55e'; // green-500
      if (value <= 10) return '#eab308'; // yellow-500
      return '#ef4444'; // red-500
    } else {
      if (value >= 95) return '#22c55e'; // green-500
      if (value >= 85) return '#3b82f6'; // blue-500
      if (value >= 75) return '#eab308'; // yellow-500
      return '#ef4444'; // red-500
    }
  };

  const formatValue = (value: number) => {
    if (filterType === 'waste' || filterType === 'accuracy') {
      return `${value.toFixed(1)}%`;
    }
    return value.toString();
  };

  const getDataKey = () => {
    switch (filterType) {
      case 'waste':
        return 'wastePercentage';
      case 'accuracy':
        return 'accuracy';
      case 'overall':
        return 'overall';
    }
  };

  const getTargetValue = () => {
    switch (filterType) {
      case 'waste':
        return 5; // 5% waste target
      case 'accuracy':
        return 95; // 95% accuracy target
      case 'overall':
        return 90; // 90 overall score target
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <p className="text-sm font-medium">{data.name}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Planned: </span>
              <span className="font-medium">{data.planned} meals</span>
            </p>
            <p className="text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Produced: </span>
              <span className="font-medium">{data.produced} meals</span>
            </p>
            <p className="text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Served: </span>
              <span className="font-medium">{data.served} meals</span>
            </p>
            <p className="text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Waste: </span>
              <span className={`font-medium ${
                data.wastePercentage <= 5 
                  ? darkMode ? 'text-green-400' : 'text-green-600'
                  : data.wastePercentage <= 10
                  ? darkMode ? 'text-amber-400' : 'text-amber-600'
                  : darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {data.waste} meals ({data.wastePercentage.toFixed(1)}%)
              </span>
            </p>
            <p className="text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Accuracy: </span>
              <span className={`font-medium ${
                data.accuracy >= 95
                  ? darkMode ? 'text-green-400' : 'text-green-600'
                  : data.accuracy >= 85
                  ? darkMode ? 'text-blue-400' : 'text-blue-600'
                  : darkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>
                {data.accuracy.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <School className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            School Performance Trends
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
                    setFilterType('accuracy');
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    filterType === 'accuracy'
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Production Accuracy
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
              </div>
            )}
          </div>

          {/* hide timeframe for now
          <div className={`px-3 py-1.5 rounded-lg text-xs ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {getTimeframeLabel()}
          </div>
          */ }
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
              domain={filterType === 'waste' ? [0, 15] : [0, 100]}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke={darkMode ? '#9ca3af' : '#6b7280'} 
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              x={getTargetValue()} 
              stroke={darkMode ? '#22c55e' : '#16a34a'} 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Target', 
                position: 'insideBottomRight',
                fill: darkMode ? '#22c55e' : '#16a34a',
                fontSize: 12
              }} 
            />
            <Bar 
              name={getFilterLabel()} 
              dataKey={getDataKey()} 
              radius={[0, 4, 4, 0]}
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(
                    filterType === 'waste' ? entry.wastePercentage : 
                    filterType === 'accuracy' ? entry.accuracy : 
                    entry.overall,
                    filterType
                  )} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            <div>
              <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                Top Performers
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cybersoft Elementary has the lowest waste at 2.6% and highest production accuracy at 97.4%.
              </p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
          <div className="flex items-start space-x-3">
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <div>
              <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                Needs Improvement
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Primero High has high waste (12.6%) and overproduction. Consider reviewing production planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolPerformanceChart;