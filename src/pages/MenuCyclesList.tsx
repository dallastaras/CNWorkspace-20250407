import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  ChevronLeft,
  Calendar,
  Search,
  Filter,
  LayoutGrid,
  Star,
  Users,
  Book,
  Clock,
  ChevronRight,
  ChevronDown,
  Utensils,
  Bot,
  TrendingUp,
  TrendingDown,
  TableIcon
} from 'lucide-react';

interface MenuCycle {
  id: string;
  name: string;
  program: string;
  mealPattern: string;
  audience: string;
  length: string;
  score: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'draft' | 'archived';
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
  };
}

const MenuCyclesList = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false); 

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isStatusOpen && dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStatusOpen]);

  // Sample data - replace with real data from API
  const menuCycles: MenuCycle[] = [
    {
      id: '1',
      name: 'Spring 2025 Cycle A',
      program: 'NSLP (Lunch)',
      mealPattern: '6-8 Meal Pattern',
      audience: 'Middle Schools',
      length: '4 Weeks',
      score: 92,
      startDate: '2025-03-01',
      endDate: '2025-03-28',
      status: 'active',
      metrics: {
        participation: {
          value: 75,
          trend: 'up',
          change: 5
        },
        cost: {
          value: 2.45,
          trend: 'down',
          change: 3
        },
        satisfaction: {
          value: 88,
          trend: 'up',
          change: 4
        }
      }
    },
    {
      id: '2',
      name: 'Spring 2025 Cycle B',
      program: 'NSLP (Lunch)',
      mealPattern: '9-12 Meal Pattern',
      audience: 'High Schools',
      length: '4 Weeks',
      score: 88,
      startDate: '2025-03-01',
      endDate: '2025-03-28',
      status: 'draft',
      metrics: {
        participation: {
          value: 68,
          trend: 'down',
          change: 2
        },
        cost: {
          value: 2.65,
          trend: 'up',
          change: 4
        },
        satisfaction: {
          value: 82,
          trend: 'down',
          change: 3
        }
      }
    },
    {
      id: '3',
      name: 'Spring 2025 Cycle C',
      program: 'NSLP (Lunch)',
      mealPattern: 'K-5 Meal Pattern',
      audience: 'Elementary Schools',
      length: '4 Weeks',
      score: 90,
      startDate: '2025-03-01',
      endDate: '2025-03-28',
      status: 'archived',
      metrics: {
        participation: {
          value: 72,
          trend: 'up',
          change: 3
        },
        cost: {
          value: 2.35,
          trend: 'down',
          change: 5
        },
        satisfaction: {
          value: 85,
          trend: 'up',
          change: 2
        }
      }
    }
  ];

  const filteredCycles = menuCycles.filter(cycle => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      cycle.name.toLowerCase().includes(searchLower) ||
      cycle.program.toLowerCase().includes(searchLower) ||
      cycle.audience.toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus = filterStatus === 'all' || cycle.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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

  const getStatusColor = (status: MenuCycle['status']) => {
    switch (status) {
      case 'active':
        return darkMode ? 'text-green-400 bg-green-400/10' : 'text-green-700 bg-green-100';
      case 'draft':
        return darkMode ? 'text-amber-400 bg-amber-400/10' : 'text-amber-700 bg-amber-100';
      case 'archived':
        return darkMode ? 'text-gray-400 bg-gray-400/10' : 'text-gray-700 bg-gray-100';
    }
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up'
      ? darkMode ? 'text-green-400' : 'text-green-600'
      : darkMode ? 'text-red-400' : 'text-red-600';
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
          <Calendar className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Menu Cycles
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and analyze your menu cycles
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
        </div>
      </div>
      
      {/* Filters and View Toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search menu cycles..."
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
        
        <div className="flex items-center space-x-4">
          <div className="relative" ref={setDropdownRef}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`flex items-center space-x-2 pl-4 pr-10 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} relative`}
            >
              <Filter className="w-4 h-4" />
              <span>{filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
              <ChevronDown className={`absolute right-3 w-4 h-4 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
            </button>
            {isStatusOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
                darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
              }`}>
                {[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'archived', label: 'Archived' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterStatus(option.value as any);
                      setIsStatusOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-left text-sm ${
                      filterStatus === option.value
                        ? darkMode
                          ? 'bg-gray-600 text-white'
                          : 'bg-indigo-50 text-indigo-600'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                    Menu Cycle
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Program
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Audience
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Participation
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Cost
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Score
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {filteredCycles.map((cycle) => (
                  <tr 
                    key={cycle.id}
                    onClick={() => {
                      const selectedCycle = {
                        ...cycle,
                        mealPattern: cycle.mealPattern || 'K-12 Meal Pattern'
                      };
                      navigate(`/menu-planner/cycles/${cycle.id}/schools`, { 
                        state: { 
                          selectedCycle,
                          startDate: new Date(cycle.startDate)
                        }
                      });
                    }}
                    className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {cycle.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {cycle.length}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {cycle.program}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {cycle.audience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${
                          getTrendColor(cycle.metrics.participation.trend)
                        }`}>
                          {cycle.metrics.participation.value}%
                        </span>
                        {cycle.metrics.participation.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-medium ${
                          getTrendColor(cycle.metrics.cost.trend === 'up' ? 'down' : 'up')
                        }`}>
                          ${cycle.metrics.cost.value.toFixed(2)}
                        </span>
                        {cycle.metrics.cost.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('down')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('up')}`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getScoreColor(cycle.score).bg
                      } ${getScoreColor(cycle.score).text}`}>
                        {cycle.score}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        getStatusColor(cycle.status)
                      }`}>
                        {cycle.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-6">
        {filteredCycles.map((cycle) => (
          <div
            key={cycle.id}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden cursor-pointer`}
            onClick={() => {
              const selectedCycle = {
                ...cycle,
                mealPattern: cycle.mealPattern || 'K-12 Meal Pattern'
              };
              navigate(`/menu-planner/cycles/${cycle.id}/schools`, { 
                state: { 
                  selectedCycle,
                  startDate: new Date(cycle.startDate)
                }
              });
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {cycle.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      getStatusColor(cycle.status)
                    }`}>
                      {cycle.status}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cycle.program}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getScoreColor(cycle.score).bg
                }`}>
                  <span className={`text-lg font-bold ${getScoreColor(cycle.score).text}`}>
                    {cycle.score}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 mt-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <Book className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Meal Pattern
                    </span>
                  </div>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {cycle.mealPattern}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Users className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Audience
                    </span>
                  </div>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {cycle.audience}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Length
                    </span>
                  </div>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {cycle.length}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Start Date
                    </span>
                  </div>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {new Date(cycle.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Participation
                      </span>
                      <div className="flex items-center">
                        {cycle.metrics.participation.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                        )}
                        <span className={`ml-1 text-sm font-medium ${
                          getTrendColor(cycle.metrics.participation.trend)
                        }`}>
                          {cycle.metrics.participation.trend === 'up' ? '+' : '-'}
                          {cycle.metrics.participation.change}%
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {cycle.metrics.participation.value}%
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Cost per Meal
                      </span>
                      <div className="flex items-center">
                        {cycle.metrics.cost.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('down')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('up')}`} />
                        )}
                        <span className={`ml-1 text-sm font-medium ${
                          getTrendColor(cycle.metrics.cost.trend === 'up' ? 'down' : 'up')
                        }`}>
                          {cycle.metrics.cost.trend === 'up' ? '+' : '-'}
                          {cycle.metrics.cost.change}%
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      ${cycle.metrics.cost.value.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Satisfaction
                      </span>
                      <div className="flex items-center">
                        {cycle.metrics.satisfaction.trend === 'up' ? (
                          <TrendingUp className={`w-4 h-4 ${getTrendColor('up')}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${getTrendColor('down')}`} />
                        )}
                        <span className={`ml-1 text-sm font-medium ${
                          getTrendColor(cycle.metrics.satisfaction.trend)
                        }`}>
                          {cycle.metrics.satisfaction.trend === 'up' ? '+' : '-'}
                          {cycle.metrics.satisfaction.change}%
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {cycle.metrics.satisfaction.value}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default MenuCyclesList;