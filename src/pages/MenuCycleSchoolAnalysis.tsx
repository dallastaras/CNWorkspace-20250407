import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  ChevronDown,
  ChevronUp,
  Users,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  School,
  Star,
  Heart,
  DollarSign,
  BarChart2,
  Bot,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SchoolPerformance {
  id: string;
  name: string;
  metrics: {
    participation: {
      value: number;
      trend: 'up' | 'down';
      change: number;
      expected: number;
    };
    cost: {
      value: number;
      trend: 'up' | 'down';
      change: number;
      expected: number;
    };
    satisfaction: {
      value: number;
      trend: 'up' | 'down';
      change: number;
      expected: number;
    };
    compliance: {
      value: number;
      trend: 'up' | 'down';
      change: number;
      expected: number;
    };
  };
  strengths: string[];
  warnings: string[];
}

interface MenuDay {
  date: string;
  score: number;
  items: Array<{
    name: string;
    planned: number;
    produced: number;
    served: number;
    leftover: number;
  }>;
}

interface SchoolMenuData {
  schoolId: string;
  days: MenuDay[];
  isExpanded?: boolean;
}

const MenuCycleSchoolAnalysis = () => {
  const { cycleId } = useParams<{ cycleId: string }>();
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedSchool, setSelectedSchool] = useState<SchoolPerformance | null>(null);
  const [menuCycle] = useState<{
    name: string;
    program: string;
    mealPattern: string;
    audience: string;
    length: string;
    score: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'draft' | 'archived';
  }>(location.state?.selectedCycle || {
    name: 'February 2025 Menu Cycle',
    program: 'NSLP (Lunch)',
    mealPattern: 'K-12 Meal Pattern',
    audience: 'All Schools',
    length: '4 Weeks',
    score: 90,
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    status: 'active'
  });
  const [menuData, setMenuData] = useState<SchoolMenuData[]>([]);
  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({});

  // Sample data - replace with real data from API
  const schools: SchoolPerformance[] = [
    {
      id: '1',
      name: 'Cybersoft High',
      metrics: {
        participation: {
          value: 75,
          trend: 'up',
          change: 5,
          expected: 70
        },
        cost: {
          value: 2.45,
          trend: 'down',
          change: 3,
          expected: 2.50
        },
        satisfaction: {
          value: 88,
          trend: 'up',
          change: 4,
          expected: 85
        },
        compliance: {
          value: 95,
          trend: 'up',
          change: 2,
          expected: 90
        }
      },
      strengths: [
        'High student participation',
        'Excellent cost control',
        'Strong menu composition'
      ],
      warnings: [
        'Monitor portion sizes',
        'Review vegetarian options'
      ]
    },
    {
      id: '2',
      name: 'Cybersoft Middle',
      metrics: {
        participation: {
          value: 68,
          trend: 'down',
          change: 2,
          expected: 72
        },
        cost: {
          value: 2.65,
          trend: 'up',
          change: 4,
          expected: 2.50
        },
        satisfaction: {
          value: 82,
          trend: 'down',
          change: 3,
          expected: 85
        },
        compliance: {
          value: 92,
          trend: 'up',
          change: 1,
          expected: 90
        }
      },
      strengths: [
        'Good nutritional balance',
        'Consistent meal quality'
      ],
      warnings: [
        'Declining participation',
        'Cost trending upward',
        'Student satisfaction needs attention'
      ]
    },
    {
      id: '3',
      name: 'Cybersoft Elementary',
      metrics: {
        participation: {
          value: 82,
          trend: 'up',
          change: 3,
          expected: 75
        },
        cost: {
          value: 2.35,
          trend: 'down',
          change: 5,
          expected: 2.50
        },
        satisfaction: {
          value: 90,
          trend: 'up',
          change: 2,
          expected: 85
        },
        compliance: {
          value: 94,
          trend: 'up',
          change: 3,
          expected: 90
        }
      },
      strengths: [
        'Excellent participation rates',
        'High student satisfaction',
        'Good cost management'
      ],
      warnings: [
        'Monitor food waste',
        'Review portion sizes'
      ]
    }
  ];

  // Sample menu data - replace with real data from API
  const getSchoolMenuData = (schoolId: string): MenuDay[] => {
    return [
      {
        date: '2025-02-10',
        score: 92,
        items: [
          { name: 'Chicken Sandwich', planned: 250, produced: 275, served: 268, leftover: 7 },
          { name: 'Cheeseburger', planned: 200, produced: 210, served: 205, leftover: 5 },
          { name: 'Spicy Chicken Sandwich', planned: 150, produced: 165, served: 162, leftover: 3 }
        ]
      },
      {
        date: '2025-02-11',
        score: 88,
        items: [
          { name: 'Pizza', planned: 300, produced: 315, served: 308, leftover: 7 },
          { name: 'Calzone', planned: 150, produced: 160, served: 155, leftover: 5 },
          { name: 'Garden Salad', planned: 100, produced: 110, served: 105, leftover: 5 }
        ]
      },
      {
        date: '2025-02-12',
        score: 90,
        items: [
          { name: 'Tacos', planned: 275, produced: 290, served: 285, leftover: 5 },
          { name: 'Burritos', planned: 175, produced: 185, served: 180, leftover: 5 },
          { name: 'Nachos', planned: 125, produced: 135, served: 130, leftover: 5 }
        ]
      }
    ];
  };

  const handleSchoolExpand = (schoolId: string) => {
    setExpandedSchools(prev => {
      const newState = { ...prev, [schoolId]: !prev[schoolId] };
      
      // Load menu data if expanding and not already loaded
      if (newState[schoolId] && !menuData.find(d => d.schoolId === schoolId)) {
        setMenuData(prev => [
          ...prev,
          { schoolId, days: getSchoolMenuData(schoolId) }
        ]);
      }
      
      return newState;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return {
      text: darkMode ? 'text-green-400' : 'text-green-600',
      bg: darkMode ? 'bg-green-400/10' : 'bg-green-100'
    };
    if (score >= 80) return {
      text: darkMode ? 'text-green-400' : 'text-green-600',
      bg: darkMode ? 'bg-green-400/10' : 'bg-green-100'
    };
    if (score >= 70) return {
      text: darkMode ? 'text-green-400' : 'text-green-600',
      bg: darkMode ? 'bg-green-400/10' : 'bg-green-100'
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

  const renderMetricComparison = (
    label: string,
    metric: {
      value: number;
      trend: 'up' | 'down';
      change: number;
      expected: number;
    },
    icon: React.ReactNode,
    isInverse: boolean = false,
    format: (value: number) => string = (value) => `${value}%`
  ) => {
    const difference = metric.value - metric.expected;
    const colors = getScoreColor(metric.value);

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
            {metric.trend === 'up' ? (
              <TrendingUp className={getTrendColor('up', isInverse)} />
            ) : (
              <TrendingDown className={getTrendColor('down', isInverse)} />
            )}
            <span className={`text-sm font-medium ${getTrendColor(metric.trend, isInverse)}`}>
              {metric.trend === 'up' ? '+' : '-'}{metric.change}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Expected
            </div>
            <div className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {format(metric.expected)}
            </div>
          </div>
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Actual
            </div>
            <div className={`text-lg font-medium ${colors.text}`}>
              {format(metric.value)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/menu-planner/cycles')} 
        className={`flex items-center text-sm ${
          darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back to Menu Cycle</span>
      </button>

      <div className="flex justify-between items-center mt-4">
        <div>
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {menuCycle.name}
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            School performance analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Table View"
          >
            <TableIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Schoolie's Analysis */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
              <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <div className="flex-1">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              This menu cycle is performing well across most schools, with particularly strong results at Cybersoft Elementary. 
              Some attention may be needed at Cybersoft Middle where participation has declined slightly. 
              Overall cost efficiency is good, with two schools showing better than expected results.
            </p>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    School
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Participation
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Cost per Meal
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Satisfaction
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Composition
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {schools.map((school) => (
                  <React.Fragment key={school.id}>
                  <tr key={school.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleSchoolExpand(school.id)}
                          className={`p-1 rounded-lg mr-2 ${
                            darkMode 
                              ? 'hover:bg-gray-600' 
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          {expandedSchools[school.id] ? (
                            <ChevronUp className={`w-4 h-4 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                          ) : (
                            <ChevronDown className={`w-4 h-4 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                          )}
                        </button>
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
                          <School className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {school.name}
                          </div>
                          <div className="flex items-center mt-1">
                            {school.warnings.length > 0 && (
                              <div className={`flex items-center text-xs ${
                                darkMode ? 'text-amber-400' : 'text-amber-600'
                              }`}>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {school.warnings.length} warnings
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(school.metrics.participation.value).text}`}>
                          {school.metrics.participation.value}%
                        </span>
                        {school.metrics.participation.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                        )}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        vs {school.metrics.participation.expected}% expected
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(
                          100 - ((school.metrics.cost.value - 2) * 100)
                        ).text}`}>
                          ${school.metrics.cost.value.toFixed(2)}
                        </span>
                        {school.metrics.cost.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
                        )}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        vs ${school.metrics.cost.expected.toFixed(2)} expected
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(school.metrics.satisfaction.value).text}`}>
                          {school.metrics.satisfaction.value}%
                        </span>
                        {school.metrics.satisfaction.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                        )}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        vs {school.metrics.satisfaction.expected}% expected
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(school.metrics.compliance.value).text}`}>
                          {school.metrics.compliance.value}%
                        </span>
                        {school.metrics.compliance.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                        )}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        vs {school.metrics.compliance.expected}% expected
                      </div>
                    </td>
                  </tr>
                  {expandedSchools[school.id] && menuData.find(d => d.schoolId === school.id)?.days.map((day, dayIndex) => (
                    <tr key={`${school.id}-${dayIndex}`} className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getScoreColor(day.score).text
                            } ${getScoreColor(day.score).bg}`}>
                              Score: {day.score}
                            </div>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                                  <th className={`px-4 py-2 text-left text-xs font-medium ${
                                    darkMode ? 'text-gray-300' : 'text-gray-500'
                                  } uppercase tracking-wider`}>
                                    Item
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
                              <tbody>
                                {day.items.map((item, itemIndex) => (
                                  <tr key={itemIndex}>
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
                      </td>
                    </tr>
                  ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-6">
        {schools.map((school) => (
          <div
            key={school.id}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}
          >
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <School className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {school.name}
                </h3>
              </div>
            </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  {renderMetricComparison(
                    'Participation',
                    school.metrics.participation,
                    <Users className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  )}
                  {renderMetricComparison(
                    'Cost per Meal',
                    school.metrics.cost,
                    <DollarSign className={darkMode ? 'text-gray-400' : 'text-gray-500'} />,
                    true,
                    (value) => `$${value.toFixed(2)}`
                  )}
                </div>
                <div className="space-y-6">
                  {renderMetricComparison(
                    'Satisfaction',
                    school.metrics.satisfaction,
                    <Star className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  )}
                  {renderMetricComparison(
                    'Composition',
                    school.metrics.compliance,
                    <Heart className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    Strengths
                  </h4>
                  <div className="space-y-2">
                    {school.strengths.map((strength, index) => (
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

                <div>
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    Attention Needed
                  </h4>
                  <div className="space-y-2">
                    {school.warnings.map((warning, index) => (
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
              </div>
              
              {/* Menu Days */}
              {expandedSchools[school.id] && menuData.find(d => d.schoolId === school.id)?.days.map((day, dayIndex) => (
                <div 
                  key={dayIndex}
                  className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getScoreColor(day.score).text
                    } ${getScoreColor(day.score).bg}`}>
                      Score: {day.score}
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                          <th className={`px-4 py-2 text-left text-xs font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-500'
                          } uppercase tracking-wider`}>
                            Item
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
                      <tbody>
                        {day.items.map((item, itemIndex) => (
                          <tr key={itemIndex}>
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
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default MenuCycleSchoolAnalysis;