import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart2, 
  Utensils, 
  Filter, 
  ChevronDown,
  Star,
  Check
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
  selectedSchool?: string;
}

const TopTrendingItems: React.FC<TopTrendingItemsProps> = ({ 
  timeframe = 'month',
  selectedSchool = 'district'
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [filterType, setFilterType] = useState<'overall' | 'participation' | 'waste'>('overall');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTopPerformers, setShowTopPerformers] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['entree', 'vegetable', 'fruit', 'grain', 'milk']);
  
  // Available categories
  const categories = [
    { id: 'entree', label: 'Entree' },
    { id: 'vegetable', label: 'Vegetable' },
    { id: 'fruit', label: 'Fruit' },
    { id: 'grain', label: 'Grain' },
    { id: 'milk', label: 'Milk' }
  ];
  
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const selectAllCategories = () => {
    setSelectedCategories(categories.map(c => c.id));
  };
  
  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  // Sample data - replace with real data from API
  const trendingItems = [
    { name: 'Turkey Tacos', category: 'entree', participation: 85, satisfaction: 92, revenue: 1250, waste: 3.5, trend: 8, overall: 92 },
    { name: 'BBQ Chicken Pizza', category: 'entree', participation: 88, satisfaction: 94, revenue: 1180, waste: 3.2, trend: 6, overall: 94 },
    { name: 'Southwest Burrito Bowl', category: 'entree', participation: 82, satisfaction: 90, revenue: 1120, waste: 3.8, trend: 5, overall: 90 },
    { name: 'Buffalo Chicken Wrap', category: 'entree', participation: 78, satisfaction: 88, revenue: 980, waste: 3.8, trend: 5, overall: 88 },
    { name: 'Italian Sub Sandwich', category: 'entree', participation: 76, satisfaction: 88, revenue: 950, waste: 4.2, trend: 4, overall: 86 },
    { name: 'Chicken Sandwich', category: 'entree', participation: 78, satisfaction: 85, revenue: 920, waste: 4.8, trend: 4, overall: 85 },
    { name: 'Asian Stir Fry Bowl', category: 'entree', participation: 72, satisfaction: 86, revenue: 880, waste: 4.5, trend: 8, overall: 84 },
    { name: 'Steamed Broccoli', category: 'vegetable', participation: 65, satisfaction: 75, revenue: 320, waste: 8.5, trend: 3, overall: 70 },
    { name: 'Garden Salad', category: 'vegetable', participation: 62, satisfaction: 78, revenue: 350, waste: 7.2, trend: 4, overall: 72 },
    { name: 'Roasted Carrots', category: 'vegetable', participation: 58, satisfaction: 72, revenue: 280, waste: 9.5, trend: 2, overall: 68 },
    { name: 'Apple Slices', category: 'fruit', participation: 82, satisfaction: 88, revenue: 410, waste: 3.0, trend: 5, overall: 85 },
    { name: 'Orange Wedges', category: 'fruit', participation: 78, satisfaction: 85, revenue: 380, waste: 3.5, trend: 4, overall: 82 },
    { name: 'Whole Grain Roll', category: 'grain', participation: 74, satisfaction: 80, revenue: 320, waste: 4.0, trend: 3, overall: 78 },
    { name: 'Brown Rice', category: 'grain', participation: 68, satisfaction: 75, revenue: 290, waste: 5.5, trend: 2, overall: 72 },
    { name: '1% White Milk', category: 'milk', participation: 85, satisfaction: 90, revenue: 420, waste: 2.5, trend: 6, overall: 88 },
    { name: 'Chocolate Milk', category: 'milk', participation: 92, satisfaction: 95, revenue: 460, waste: 1.8, trend: 7, overall: 92 }
  ].sort((a, b) => b[filterType] - a[filterType]);
  
  // Filter by selected school if not district
  const filteredBySchool = selectedSchool === 'district' 
    ? trendingItems 
    : trendingItems.filter((_, index) => index % 5 === parseInt(selectedSchool) % 5); // Simple mock filtering
  
  // Filter by selected categories
  const filteredByCategory = filteredBySchool.filter(item => 
    selectedCategories.includes(item.category)
  );
  
  // Split into top and bottom performers
  const topPerformers = [...filteredByCategory].sort((a, b) => b[filterType] - a[filterType]).slice(0, 5);
  // For waste, lower is better, so we need to sort differently
  const bottomPerformers = [...filteredByCategory].sort((a, b) => {
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
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="text-sm">Categories ({selectedCategories.length})</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCategoryOpen && (
              <div className={`absolute right-0 mt-1 w-56 rounded-lg shadow-lg overflow-hidden z-50 ${
                darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
              }`}>
                <div className="p-2">
                  <div className="flex justify-between items-center px-2 py-1 mb-1">
                    <button
                      onClick={() => selectAllCategories()}
                      className={`text-xs ${
                        darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => clearAllCategories()}
                      className={`text-xs ${
                        darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                  {categories.map(category => (
                    <div 
                      key={category.id}
                      className={`flex items-center px-2 py-1.5 rounded cursor-pointer ${
                        darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className={`w-5 h-5 flex items-center justify-center rounded mr-2 ${
                        selectedCategories.includes(category.id)
                          ? 'bg-indigo-600 text-white'
                          : darkMode ? 'border border-gray-500' : 'border border-gray-300'
                      }`}>
                        {selectedCategories.includes(category.id) && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {category.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
                darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setFilterType('overall');
                    setIsFilterOpen(false);
                  }} 
                  className={`w-full flex items-center px-4 py-2 text-left text-sm ${
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
                  className={`w-full flex items-center px-4 py-2 text-left text-sm ${
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
                  className={`w-full flex items-center px-4 py-2 text-left text-sm ${
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
        </div>
      </div>
      
      {filteredByCategory.length === 0 && (
        <div className={`flex items-center justify-center h-80 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-center">
            No items match the selected categories.<br />
            Please select at least one category to view data.
          </p>
        </div>
      )}

      {filteredByCategory.length > 0 && <div className="h-80">
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
      </div>}
    </div>
  );
};

export default TopTrendingItems;