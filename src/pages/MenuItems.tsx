import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Utensils,
  Search,
  Filter,
  LayoutGrid,
  TableIcon,
  TrendingUp,
  TrendingDown,
  Star,
  DollarSign,
  Heart,
  BarChart2,
  ChevronDown,
  Check,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Users,
  ChevronLeft
} from 'lucide-react';
import { TimeframeSelector } from '../components/dashboard/TimeframeSelector';
import { SchoolSelector } from '../components/dashboard/SchoolSelector';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  metrics: {
    participation: {
      value: number;
      trend: 'up' | 'down';
      change: number;
    };
    cost: {
      value: number;
      trend: 'up' | 'down';
      change: number;
    };
    satisfaction: {
      value: number;
      trend: 'up' | 'down';
      change: number;
    };
    waste: {
      value: number;
      trend: 'up' | 'down';
      change: number;
    };
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  performance: {
    score: number;
    strengths: string[];
    warnings: string[];
  };
}

const MenuItems = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Entree', 'Vegetable', 'Fruit', 'Grain', 'Milk']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string>('district');
  const [schools] = useState([
    { id: 'district', name: 'All Schools' },
    { id: '1', name: 'Cybersoft High' },
    { id: '2', name: 'Cybersoft Middle' },
    { id: '3', name: 'Cybersoft Elementary' },
    { id: '4', name: 'Primero High' },
    { id: '5', name: 'Primero Elementary' }
  ]);

  // Sample data - replace with real data from API
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Turkey Tacos & Nachos Bar',
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
        satisfaction: {
          value: 92,
          trend: 'up',
          change: 6
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
      }
    },
    {
      id: '2',
      name: 'Chicken Sandwich',
      category: 'Entree',
      metrics: {
        participation: {
          value: 78,
          trend: 'up',
          change: 4
        },
        cost: {
          value: 1.95,
          trend: 'up',
          change: 3
        },
        satisfaction: {
          value: 85,
          trend: 'up',
          change: 3
        },
        waste: {
          value: 4.8,
          trend: 'up',
          change: 1.2
        }
      },
      nutrition: {
        calories: 380,
        protein: 22,
        carbs: 45,
        fat: 14,
        fiber: 4,
        sodium: 620
      },
      performance: {
        score: 86,
        strengths: [
          'Popular choice',
          'Good protein content'
        ],
        warnings: [
          'Cost trending upward',
          'Monitor waste'
        ]
      }
    },
    {
      id: '3',
      name: 'Garden Salad',
      category: 'Entree',
      metrics: {
        participation: {
          value: 45,
          trend: 'down',
          change: 5
        },
        cost: {
          value: 0.85,
          trend: 'up',
          change: 8
        },
        satisfaction: {
          value: 72,
          trend: 'down',
          change: 4
        },
        waste: {
          value: 12.5,
          trend: 'up',
          change: 3.5
        }
      },
      nutrition: {
        calories: 120,
        protein: 4,
        carbs: 18,
        fat: 6,
        fiber: 5,
        sodium: 180
      },
      performance: {
        score: 68,
        strengths: [
          'Excellent nutrition profile'
        ],
        warnings: [
          'High waste percentage',
          'Declining participation',
          'Cost increase due to produce prices'
        ]
      }
    },
    {
      id: '4',
      name: 'BBQ Chicken Pizza',
      category: 'Entree',
      metrics: {
        participation: {
          value: 88,
          trend: 'up',
          change: 6
        },
        cost: {
          value: 1.85,
          trend: 'down',
          change: 4
        },
        satisfaction: {
          value: 94,
          trend: 'up',
          change: 5
        },
        waste: {
          value: 3.2,
          trend: 'down',
          change: 1.8
        }
      },
      nutrition: {
        calories: 350,
        protein: 24,
        carbs: 38,
        fat: 14,
        fiber: 3,
        sodium: 620
      },
      performance: {
        score: 92,
        strengths: [
          'Student favorite',
          'Consistent quality',
          'Good protein content'
        ],
        warnings: []
      }
    },
    {
      id: '5',
      name: 'Asian Stir Fry Bowl',
      category: 'Entree',
      metrics: {
        participation: {
          value: 72,
          trend: 'up',
          change: 8
        },
        cost: {
          value: 2.15,
          trend: 'up',
          change: 3
        },
        satisfaction: {
          value: 86,
          trend: 'up',
          change: 4
        },
        waste: {
          value: 4.5,
          trend: 'down',
          change: 2
        }
      },
      nutrition: {
        calories: 380,
        protein: 22,
        carbs: 48,
        fat: 12,
        fiber: 6,
        sodium: 550
      },
      performance: {
        score: 84,
        strengths: [
          'Growing popularity',
          'Good nutritional balance'
        ],
        warnings: [
          'Monitor portion sizes'
        ]
      }
    },
    {
      id: '6',
      name: 'Southwest Burrito Bowl',
      category: 'Entree',
      metrics: {
        participation: {
          value: 82,
          trend: 'up',
          change: 5
        },
        cost: {
          value: 2.05,
          trend: 'down',
          change: 2
        },
        satisfaction: {
          value: 90,
          trend: 'up',
          change: 3
        },
        waste: {
          value: 3.8,
          trend: 'down',
          change: 1.5
        }
      },
      nutrition: {
        calories: 420,
        protein: 26,
        carbs: 52,
        fat: 15,
        fiber: 8,
        sodium: 580
      },
      performance: {
        score: 88,
        strengths: [
          'Customizable options',
          'High satisfaction',
          'Good protein content'
        ],
        warnings: []
      }
    },
    {
      id: '7',
      name: 'Italian Sub Sandwich',
      category: 'Entree',
      metrics: {
        participation: {
          value: 76,
          trend: 'up',
          change: 4
        },
        cost: {
          value: 1.95,
          trend: 'down',
          change: 2
        },
        satisfaction: {
          value: 88,
          trend: 'up',
          change: 3
        },
        waste: {
          value: 4.2,
          trend: 'up',
          change: 1
        }
      },
      nutrition: {
        calories: 450,
        protein: 28,
        carbs: 48,
        fat: 18,
        fiber: 4,
        sodium: 890
      },
      performance: {
        score: 85,
        strengths: [
          'Popular choice',
          'Good protein content'
        ],
        warnings: [
          'High sodium content',
          'Monitor waste trend'
        ]
      }
    },
    {
      id: '8',
      name: 'Greek Yogurt Parfait',
      category: 'Breakfast',
      metrics: {
        participation: {
          value: 68,
          trend: 'up',
          change: 7
        },
        cost: {
          value: 1.45,
          trend: 'down',
          change: 3
        },
        satisfaction: {
          value: 84,
          trend: 'up',
          change: 5
        },
        waste: {
          value: 3.5,
          trend: 'down',
          change: 2
        }
      },
      nutrition: {
        calories: 280,
        protein: 14,
        carbs: 42,
        fat: 8,
        fiber: 3,
        sodium: 120
      },
      performance: {
        score: 86,
        strengths: [
          'Healthy option',
          'Growing popularity',
          'Low waste'
        ],
        warnings: []
      }
    },
    {
      id: '9',
      name: 'Breakfast Burrito',
      category: 'Breakfast',
      metrics: {
        participation: {
          value: 74,
          trend: 'up',
          change: 6
        },
        cost: {
          value: 1.75,
          trend: 'up',
          change: 2
        },
        satisfaction: {
          value: 89,
          trend: 'up',
          change: 4
        },
        waste: {
          value: 4.0,
          trend: 'down',
          change: 1
        }
      },
      nutrition: {
        calories: 380,
        protein: 18,
        carbs: 44,
        fat: 16,
        fiber: 4,
        sodium: 680
      },
      performance: {
        score: 87,
        strengths: [
          'High satisfaction',
          'Good protein content'
        ],
        warnings: [
          'Monitor food costs'
        ]
      }
    },
    {
      id: '10',
      name: 'Veggie Stir Fry',
      category: 'Entree',
      metrics: {
        participation: {
          value: 58,
          trend: 'up',
          change: 9
        },
        cost: {
          value: 1.65,
          trend: 'down',
          change: 4
        },
        satisfaction: {
          value: 82,
          trend: 'up',
          change: 6
        },
        waste: {
          value: 5.2,
          trend: 'down',
          change: 2
        }
      },
      nutrition: {
        calories: 320,
        protein: 12,
        carbs: 48,
        fat: 10,
        fiber: 8,
        sodium: 450
      },
      performance: {
        score: 80,
        strengths: [
          'Healthy option',
          'Good for vegetarians'
        ],
        warnings: [
          'Lower participation',
          'Monitor waste levels'
        ]
      }
    },
    {
      id: '11',
      name: 'Buffalo Chicken Wrap',
      category: 'Entree',
      metrics: {
        participation: {
          value: 78,
          trend: 'up',
          change: 5
        },
        cost: {
          value: 1.85,
          trend: 'down',
          change: 2
        },
        satisfaction: {
          value: 88,
          trend: 'up',
          change: 4
        },
        waste: {
          value: 3.8,
          trend: 'down',
          change: 1.5
        }
      },
      nutrition: {
        calories: 420,
        protein: 28,
        carbs: 46,
        fat: 16,
        fiber: 4,
        sodium: 780
      },
      performance: {
        score: 86,
        strengths: [
          'Popular choice',
          'Good protein content',
          'Low waste'
        ],
        warnings: [
          'Monitor sodium content'
        ]
      }
    },
    {
      id: '12',
      name: 'Mediterranean Bowl',
      category: 'Entree',
      metrics: {
        participation: {
          value: 64,
          trend: 'up',
          change: 8
        },
        cost: {
          value: 2.10,
          trend: 'up',
          change: 3
        },
        satisfaction: {
          value: 86,
          trend: 'up',
          change: 5
        },
        waste: {
          value: 4.5,
          trend: 'down',
          change: 2
        }
      },
      nutrition: {
        calories: 380,
        protein: 16,
        carbs: 52,
        fat: 14,
        fiber: 8,
        sodium: 520
      },
      performance: {
        score: 82,
        strengths: [
          'Healthy option',
          'Growing popularity'
        ],
        warnings: [
          'Higher food cost',
          'Monitor participation'
        ]
      }
    }
  ];

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

  // Get all unique categories from menu items
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories(categories);
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/menu-planner')} 
        className={`flex items-center text-sm ${
          darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back to Menu Analysis</span>
      </button>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Utensils className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Menu Items
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Analyze and optimize your menu items
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TimeframeSelector />
          <SchoolSelector
            selectedSchool={selectedSchool}
            schools={schools}
            onSchoolChange={handleSchoolChange}
          />
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title={showAIInsights ? 'Hide AI Insights' : 'Show AI Insights'}
          >
            <Bot className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showAIInsights && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
                <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <div className="flex-1">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                Based on recent performance data, Turkey Tacos continue to be your top performer with a 94% overall score. 
                The Garden Salad needs attention due to increasing waste and declining participation. 
                Consider adjusting portion sizes or presentation to improve acceptance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
              } border focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} relative`}
            >
              <Filter className="w-4 h-4 mr-2" />
              <span>Categories ({selectedCategories.length})</span>
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-50 ${
                darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
              }`}>
                <div className="p-2">
                  <div className="flex justify-between items-center px-2 py-1 mb-1">
                    <button
                      onClick={selectAllCategories}
                      className={`text-xs ${
                        darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllCategories}
                      className={`text-xs ${
                        darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                  {categories.map(category => (
                    <div 
                      key={category}
                      className={`flex items-center px-2 py-1.5 rounded cursor-pointer ${
                        darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      <div className={`w-5 h-5 flex items-center justify-center rounded mr-2 ${
                        selectedCategories.includes(category)
                          ? 'bg-indigo-600 text-white'
                          : darkMode ? 'border border-gray-500' : 'border border-gray-300'
                      }`}>
                        {selectedCategories.includes(category) && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/*}
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
          */}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/menu-planner/items/${item.id}`)}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getScoreColor(item.performance.score).bg
                  }`}>
                    <span className={`text-lg font-bold ${getScoreColor(item.performance.score).text}`}>
                      {item.performance.score}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="space-y-6">
                    {/* Metrics */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Performance Metrics
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Participation
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getTrendColor(item.metrics.participation.trend)}`}>
                              {item.metrics.participation.value}%
                            </span>
                            {item.metrics.participation.trend === 'up' ? (
                              <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                            ) : (
                              <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <DollarSign className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Cost
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getTrendColor(item.metrics.cost.trend, true)}`}>
                              ${item.metrics.cost.value.toFixed(2)}
                            </span>
                            {item.metrics.cost.trend === 'up' ? (
                              <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
                            ) : (
                              <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Star className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Satisfaction
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getTrendColor(item.metrics.satisfaction.trend)}`}>
                              {item.metrics.satisfaction.value}%
                            </span>
                            {item.metrics.satisfaction.trend === 'up' ? (
                              <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                            ) : (
                              <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <BarChart2 className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Waste
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getTrendColor(item.metrics.waste.trend, true)}`}>
                              {item.metrics.waste.value}%
                            </span>
                            {item.metrics.waste.trend === 'up' ? (
                              <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
                            ) : (
                              <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Nutrition */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Nutrition Facts
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Calories
                          </span>
                          
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.nutrition.calories}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Protein
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.nutrition.protein}g
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Carbs
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.nutrition.carbs}g
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Fat
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.nutrition.fat}g
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Fiber
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.nutrition.fiber}g
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Sodium
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.nutrition.sodium}mg
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths and Warnings */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {item.performance.strengths.map((strength, index) => (
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
                      {item.performance.warnings.map((warning, index) => (
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
              </div>
              <div className="absolute inset-0 cursor-pointer" />
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Item
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Participation
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Leftover
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Waste $
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Waste %
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => navigate(`/menu-planner/items/${item.id}`)}
                    className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getTrendColor(item.metrics.participation.trend)}`}>
                          {item.metrics.participation.value}%
                        </span>
                        {item.metrics.participation.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getTrendColor(item.metrics.participation.trend, true)}`}>
                          {(100 - item.metrics.participation.value).toFixed(1)}%
                        </span>
                        {item.metrics.participation.trend === 'up' ? (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
                        ) : (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getTrendColor(item.metrics.waste.trend, true)}`}>
                          ${(item.metrics.waste.value * 2.50).toFixed(2)}
                        </span>
                        {item.metrics.waste.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${getTrendColor(item.metrics.waste.trend, true)}`}>
                          {item.metrics.waste.value.toFixed(1)}%
                        </span>
                        {item.metrics.waste.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up', true)}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down', true)}`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getScoreColor(item.performance.score).bg
                      } ${getScoreColor(item.performance.score).text}`}>
                        {item.performance.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;