import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  BarChart2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  PieChart, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Building,
  School
} from 'lucide-react';
import { format, subMonths, startOfYear, endOfYear } from 'date-fns';

// Define types for P&L data
interface PLItem {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  budgeted: number;
  variance: number;
  trend: 'up' | 'down' | 'neutral';
}

interface PLSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  budgetedRevenue: number;
  budgetedExpenses: number;
  budgetedNetIncome: number;
}

interface SchoolPLData {
  id: string;
  name: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  budgetedRevenue: number;
  budgetedExpenses: number;
  budgetedNetIncome: number;
}

const Oversight: React.FC = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState<'district' | 'schools'>('district');
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [showRevenueDetails, setShowRevenueDetails] = useState(true);
  const [showExpenseDetails, setShowExpenseDetails] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  // Generate placeholder data
  const generatePlaceholderData = () => {
    // Generate revenue items
    const revenueItems: PLItem[] = [
      {
        id: '1',
        category: 'Revenue',
        subcategory: 'Federal Reimbursement',
        amount: 425000,
        budgeted: 400000,
        variance: 25000,
        trend: 'up'
      },
      {
        id: '2',
        category: 'Revenue',
        subcategory: 'State Reimbursement',
        amount: 125000,
        budgeted: 130000,
        variance: -5000,
        trend: 'down'
      },
      {
        id: '3',
        category: 'Revenue',
        subcategory: 'A La Carte Sales',
        amount: 85000,
        budgeted: 75000,
        variance: 10000,
        trend: 'up'
      },
      {
        id: '4',
        category: 'Revenue',
        subcategory: 'Catering',
        amount: 15000,
        budgeted: 20000,
        variance: -5000,
        trend: 'down'
      },
      {
        id: '5',
        category: 'Revenue',
        subcategory: 'USDA Foods',
        amount: 45000,
        budgeted: 45000,
        variance: 0,
        trend: 'neutral'
      }
    ];

    // Generate expense items
    const expenseItems: PLItem[] = [
      {
        id: '6',
        category: 'Expenses',
        subcategory: 'Food Costs',
        amount: 285000,
        budgeted: 275000,
        variance: 10000,
        trend: 'up'
      },
      {
        id: '7',
        category: 'Expenses',
        subcategory: 'Labor',
        amount: 245000,
        budgeted: 250000,
        variance: -5000,
        trend: 'down'
      },
      {
        id: '8',
        category: 'Expenses',
        subcategory: 'Supplies',
        amount: 35000,
        budgeted: 40000,
        variance: -5000,
        trend: 'down'
      },
      {
        id: '9',
        category: 'Expenses',
        subcategory: 'Equipment',
        amount: 25000,
        budgeted: 20000,
        variance: 5000,
        trend: 'up'
      },
      {
        id: '10',
        category: 'Expenses',
        subcategory: 'Overhead',
        amount: 55000,
        budgeted: 60000,
        variance: -5000,
        trend: 'down'
      }
    ];

    // Calculate summary
    const totalRevenue = revenueItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    const budgetedRevenue = revenueItems.reduce((sum, item) => sum + item.budgeted, 0);
    const budgetedExpenses = expenseItems.reduce((sum, item) => sum + item.budgeted, 0);

    const summary: PLSummary = {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      budgetedRevenue,
      budgetedExpenses,
      budgetedNetIncome: budgetedRevenue - budgetedExpenses
    };

    // Generate school data
    const schoolData: SchoolPLData[] = [
      {
        id: '1',
        name: 'Cybersoft High',
        revenue: 225000,
        expenses: 195000,
        netIncome: 30000,
        budgetedRevenue: 210000,
        budgetedExpenses: 190000,
        budgetedNetIncome: 20000
      },
      {
        id: '2',
        name: 'Cybersoft Middle',
        revenue: 175000,
        expenses: 160000,
        netIncome: 15000,
        budgetedRevenue: 170000,
        budgetedExpenses: 165000,
        budgetedNetIncome: 5000
      },
      {
        id: '3',
        name: 'Cybersoft Elementary',
        revenue: 150000,
        expenses: 140000,
        netIncome: 10000,
        budgetedRevenue: 145000,
        budgetedExpenses: 135000,
        budgetedNetIncome: 10000
      },
      {
        id: '4',
        name: 'Primero High',
        revenue: 190000,
        expenses: 185000,
        netIncome: 5000,
        budgetedRevenue: 195000,
        budgetedExpenses: 180000,
        budgetedNetIncome: 15000
      },
      {
        id: '5',
        name: 'Primero Elementary',
        revenue: 120000,
        expenses: 115000,
        netIncome: 5000,
        budgetedRevenue: 125000,
        budgetedExpenses: 120000,
        budgetedNetIncome: 5000
      }
    ];

    return { revenueItems, expenseItems, summary, schoolData };
  };

  const { revenueItems, expenseItems, summary, schoolData } = generatePlaceholderData();

  const getTimeframeLabel = () => {
    const now = new Date();
    switch (timeframe) {
      case 'month':
        return format(now, 'MMMM yyyy');
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3) + 1;
        return `Q${quarter} ${now.getFullYear()}`;
      case 'year':
        return `Fiscal Year ${now.getFullYear()}`;
      default:
        return format(now, 'MMMM yyyy');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) {
      return darkMode ? 'text-green-400' : 'text-green-600';
    } else if (variance < 0) {
      return darkMode ? 'text-red-400' : 'text-red-600';
    }
    return darkMode ? 'text-gray-400' : 'text-gray-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderDistrictView = () => (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Revenue
            </h2>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-100'}`}>
              <DollarSign className={darkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Actual
              </span>
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(summary.totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Budgeted
              </span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatCurrency(summary.budgetedRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Variance
              </span>
              <span className={`text-sm font-medium flex items-center ${getVarianceColor(summary.totalRevenue - summary.budgetedRevenue)}`}>
                {summary.totalRevenue - summary.budgetedRevenue > 0 ? '+' : ''}
                {formatCurrency(summary.totalRevenue - summary.budgetedRevenue)}
                {summary.totalRevenue - summary.budgetedRevenue > 0 ? 
                  <TrendingUp className="w-4 h-4 ml-1" /> : 
                  summary.totalRevenue - summary.budgetedRevenue < 0 ? 
                  <TrendingDown className="w-4 h-4 ml-1" /> : null}
              </span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Expenses
            </h2>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-100'}`}>
              <DollarSign className={darkMode ? 'text-red-400' : 'text-red-600'} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Actual
              </span>
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(summary.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Budgeted
              </span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatCurrency(summary.budgetedExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Variance
              </span>
              <span className={`text-sm font-medium flex items-center ${getVarianceColor(summary.budgetedExpenses - summary.totalExpenses)}`}>
                {summary.budgetedExpenses - summary.totalExpenses > 0 ? '+' : ''}
                {formatCurrency(summary.budgetedExpenses - summary.totalExpenses)}
                {summary.budgetedExpenses - summary.totalExpenses > 0 ? 
                  <TrendingUp className="w-4 h-4 ml-1" /> : 
                  summary.budgetedExpenses - summary.totalExpenses < 0 ? 
                  <TrendingDown className="w-4 h-4 ml-1" /> : null}
              </span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Net Income
            </h2>
            <div className={`p-2 rounded-lg ${summary.netIncome >= 0 ? 
              (darkMode ? 'bg-blue-900/20' : 'bg-blue-100') : 
              (darkMode ? 'bg-red-900/20' : 'bg-red-100')
            }`}>
              <BarChart2 className={summary.netIncome >= 0 ? 
                (darkMode ? 'text-blue-400' : 'text-blue-600') : 
                (darkMode ? 'text-red-400' : 'text-red-600')
              } />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Actual
              </span>
              <span className={`text-2xl font-bold ${summary.netIncome >= 0 ? 
                (darkMode ? 'text-blue-400' : 'text-blue-600') : 
                (darkMode ? 'text-red-400' : 'text-red-600')
              }`}>
                {formatCurrency(summary.netIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Budgeted
              </span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatCurrency(summary.budgetedNetIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Variance
              </span>
              <span className={`text-sm font-medium flex items-center ${getVarianceColor(summary.netIncome - summary.budgetedNetIncome)}`}>
                {summary.netIncome - summary.budgetedNetIncome > 0 ? '+' : ''}
                {formatCurrency(summary.netIncome - summary.budgetedNetIncome)}
                {summary.netIncome - summary.budgetedNetIncome > 0 ? 
                  <TrendingUp className="w-4 h-4 ml-1" /> : 
                  summary.netIncome - summary.budgetedNetIncome < 0 ? 
                  <TrendingDown className="w-4 h-4 ml-1" /> : null}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Details */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <button 
            className="flex items-center justify-between w-full"
            onClick={() => setShowRevenueDetails(!showRevenueDetails)}
          >
            <div className="flex items-center">
              <DollarSign className={`w-5 h-5 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue Details
              </h2>
            </div>
            {showRevenueDetails ? 
              <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /> : 
              <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            }
          </button>
        </div>
        
        {showRevenueDetails && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Revenue Source
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Actual
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Budgeted
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Variance
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {revenueItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.subcategory}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatCurrency(item.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatCurrency(item.budgeted)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-medium ${getVarianceColor(item.variance)}`}>
                        {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`flex items-center justify-end ${
                        item.trend === 'up' 
                          ? (darkMode ? 'text-green-400' : 'text-green-600')
                          : item.trend === 'down'
                          ? (darkMode ? 'text-red-400' : 'text-red-600')
                          : (darkMode ? 'text-gray-400' : 'text-gray-500')
                      }`}>
                        {getTrendIcon(item.trend)}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Total Revenue
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(summary.totalRevenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(summary.budgetedRevenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${getVarianceColor(summary.totalRevenue - summary.budgetedRevenue)}`}>
                      {summary.totalRevenue - summary.budgetedRevenue > 0 ? '+' : ''}
                      {formatCurrency(summary.totalRevenue - summary.budgetedRevenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`flex items-center justify-end ${
                      summary.totalRevenue - summary.budgetedRevenue > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-600')
                        : summary.totalRevenue - summary.budgetedRevenue < 0
                        ? (darkMode ? 'text-red-400' : 'text-red-600')
                        : (darkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {summary.totalRevenue - summary.budgetedRevenue > 0 
                        ? <TrendingUp className="w-4 h-4" /> 
                        : summary.totalRevenue - summary.budgetedRevenue < 0 
                        ? <TrendingDown className="w-4 h-4" /> 
                        : null}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense Details */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <button 
            className="flex items-center justify-between w-full"
            onClick={() => setShowExpenseDetails(!showExpenseDetails)}
          >
            <div className="flex items-center">
              <DollarSign className={`w-5 h-5 mr-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Expense Details
              </h2>
            </div>
            {showExpenseDetails ? 
              <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /> : 
              <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            }
          </button>
        </div>
        
        {showExpenseDetails && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Expense Category
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Actual
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Budgeted
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Variance
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {expenseItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.subcategory}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatCurrency(item.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatCurrency(item.budgeted)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-medium ${getVarianceColor(-item.variance)}`}>
                        {-item.variance > 0 ? '+' : ''}{formatCurrency(-item.variance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`flex items-center justify-end ${
                        item.trend === 'down' 
                          ? (darkMode ? 'text-green-400' : 'text-green-600')
                          : item.trend === 'up'
                          ? (darkMode ? 'text-red-400' : 'text-red-600')
                          : (darkMode ? 'text-gray-400' : 'text-gray-500')
                      }`}>
                        {item.trend === 'down' 
                          ? <TrendingDown className="w-4 h-4" /> 
                          : item.trend === 'up' 
                          ? <TrendingUp className="w-4 h-4" /> 
                          : null}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Total Expenses
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(summary.totalExpenses)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(summary.budgetedExpenses)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${getVarianceColor(summary.budgetedExpenses - summary.totalExpenses)}`}>
                      {summary.budgetedExpenses - summary.totalExpenses > 0 ? '+' : ''}
                      {formatCurrency(summary.budgetedExpenses - summary.totalExpenses)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`flex items-center justify-end ${
                      summary.budgetedExpenses - summary.totalExpenses > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-600')
                        : summary.budgetedExpenses - summary.totalExpenses < 0
                        ? (darkMode ? 'text-red-400' : 'text-red-600')
                        : (darkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {summary.budgetedExpenses - summary.totalExpenses > 0 
                        ? <TrendingDown className="w-4 h-4" /> 
                        : summary.budgetedExpenses - summary.totalExpenses < 0 
                        ? <TrendingUp className="w-4 h-4" /> 
                        : null}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* P&L Visualization */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <h2 className={`text-lg font-medium mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          P&L Visualization
        </h2>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Interactive P&L chart would be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchoolsView = () => (
    <div className="space-y-6">
      {/* School Performance Table */}
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
                  Revenue
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Expenses
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Net Income
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Budget Variance
                </th>
                <th scope="col" className={`px-6 py-3 text-center text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
              darkMode ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {schoolData.map((school) => (
                <tr key={school.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <School className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {school.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {formatCurrency(school.revenue)}
                    </div>
                    <div className={`text-xs ${
                      school.revenue - school.budgetedRevenue > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-600')
                        : school.revenue - school.budgetedRevenue < 0
                        ? (darkMode ? 'text-red-400' : 'text-red-600')
                        : (darkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {school.revenue - school.budgetedRevenue > 0 ? '+' : ''}
                      {formatCurrency(school.revenue - school.budgetedRevenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {formatCurrency(school.expenses)}
                    </div>
                    <div className={`text-xs ${
                      school.budgetedExpenses - school.expenses > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-600')
                        : school.budgetedExpenses - school.expenses < 0
                        ? (darkMode ? 'text-red-400' : 'text-red-600')
                        : (darkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {school.budgetedExpenses - school.expenses > 0 ? '+' : ''}
                      {formatCurrency(school.budgetedExpenses - school.expenses)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${
                      school.netIncome > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-600')
                        : school.netIncome < 0
                        ? (darkMode ? 'text-red-400' : 'text-red-600')
                        : (darkMode ? 'text-gray-300' : 'text-gray-900')
                    }`}>
                      {formatCurrency(school.netIncome)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${
                      school.netIncome - school.budgetedNetIncome > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-600')
                        : school.netIncome - school.budgetedNetIncome < 0
                        ? (darkMode ? 'text-red-400' : 'text-red-600')
                        : (darkMode ? 'text-gray-300' : 'text-gray-900')
                    }`}>
                      {school.netIncome - school.budgetedNetIncome > 0 ? '+' : ''}
                      {formatCurrency(school.netIncome - school.budgetedNetIncome)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedSchool(school.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* School P&L Visualization */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <h2 className={`text-lg font-medium mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          School P&L Comparison
        </h2>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Interactive school comparison chart would be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FileText className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Financial Oversight
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Profit & Loss Analysis
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-5 h-5 mr-1" />
              <span>{getTimeframeLabel()}</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          <button
            className={`flex items-center px-4 py-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('district')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === 'district'
                ? `${darkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
              }
            `}
          >
            <Building className="w-4 h-4" />
            <span>District P&L</span>
          </button>
          <button
            onClick={() => setActiveTab('schools')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === 'schools'
                ? `${darkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
              }
            `}
          >
            <School className="w-4 h-4" />
            <span>School Breakdown</span>
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'district' ? renderDistrictView() : renderSchoolsView()}
    </div>
  );
};

export default Oversight;