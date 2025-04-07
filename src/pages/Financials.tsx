import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  ChevronDown,
  FileText,
  Settings,
  Link,
  Trash2,
  Save,
  X,
  TrendingUp,
  TrendingDown,
  Check
} from 'lucide-react';
import { toast } from '../components/common/Toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface GLAccount {
  id: string;
  account_number: string;
  description: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
}

interface GLMapping {
  id: string;
  data_point: string;
  data_type: 'revenue' | 'expense';
  gl_account_id: string;
  gl_account?: GLAccount;
}

interface GLMappingFormData {
  data_point: string;
  data_type: 'revenue' | 'expense';
  gl_account_id: string;
}

const Financials = () => {
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'expenses' | 'budget' | 'integrations'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<GLAccount[]>([]);
  const [mappings, setMappings] = useState<GLMapping[]>([]);
  const [showMappingForm, setShowMappingForm] = useState(false);
  const [mappingFormData, setMappingFormData] = useState<GLMappingFormData>({
    data_point: '',
    data_type: 'revenue',
    gl_account_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch GL accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('gl_accounts')
          .select('*')
          .order('account_number');

        if (accountsError) throw accountsError;

        // Fetch GL mappings with account details
        const { data: mappingsData, error: mappingsError } = await supabase
          .from('gl_mappings')
          .select(`
            *,
            gl_account:gl_accounts(*)
          `)
          .order('data_point');

        if (mappingsError) throw mappingsError;

        setAccounts(accountsData);
        setMappings(mappingsData);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddMapping = async () => {
    try {
      if (!mappingFormData.data_point || !mappingFormData.gl_account_id) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { data, error } = await supabase
        .from('gl_mappings')
        .insert({
          data_point: mappingFormData.data_point,
          data_type: mappingFormData.data_type,
          gl_account_id: mappingFormData.gl_account_id,
          district_id: user?.district_id
        })
        .select(`
          *,
          gl_account:gl_accounts(*)
        `)
        .single();

      if (error) throw error;

      setMappings(prev => [...prev, data]);
      setShowMappingForm(false);
      setMappingFormData({
        data_point: '',
        data_type: 'revenue',
        gl_account_id: ''
      });

      toast.success('GL mapping added successfully');
    } catch (err) {
      console.error('Error adding GL mapping:', err);
      toast.error('Failed to add GL mapping');
    }
  };

  const handleDeleteMapping = async (mappingId: string) => {
    try {
      const { error } = await supabase
        .from('gl_mappings')
        .delete()
        .eq('id', mappingId);

      if (error) throw error;

      setMappings(prev => prev.filter(m => m.id !== mappingId));
      toast.success('GL mapping deleted successfully');
    } catch (err) {
      console.error('Error deleting GL mapping:', err);
      toast.error('Failed to delete GL mapping');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <LoadingSpinner 
          size="lg" 
          className={darkMode ? 'text-gray-400' : 'text-gray-500'} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <DollarSign className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Financials
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage your nutrition program finances
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: DollarSign },
            { id: 'revenue', label: 'Revenue', icon: TrendingUp },
            { id: 'expenses', label: 'Expenses', icon: TrendingDown },
            { id: 'budget', label: 'Budget', icon: FileText },
            { id: 'integrations', label: 'Integrations', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                ${activeTab === id
                  ? `${darkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                  : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Financial Summary
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Revenue
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $125,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Expenses
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $98,500
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Net Income
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $26,500
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Key Metrics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Cost per Meal
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  $2.45
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Labor Cost %
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  42%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Food Cost %
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  38%
                </span>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Budget Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Budget Used
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  65%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Days Remaining
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  125
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Projected Variance
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  +$15,000
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab Content */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Revenue Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Federal Reimbursement
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $75,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    State Reimbursement
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $25,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    A La Carte Sales
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $15,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Other Revenue
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $10,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab Content */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Expense Categories
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Food Costs
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $45,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Labor Costs
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $35,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Equipment
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $12,500
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '12.5%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Overhead
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    $6,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '6%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab Content */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              GL Mappings
            </h2>
            <button
              onClick={() => setShowMappingForm(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Mapping
            </button>
          </div>

          {/* Mapping Form */}
          {showMappingForm && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  New GL Mapping
                </h3>
                <button
                  onClick={() => setShowMappingForm(false)}
                  className={`p-2 rounded-lg ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-1`}>
                    Data Point
                  </label>
                  <input
                    type="text"
                    value={mappingFormData.data_point}
                    onChange={(e) => setMappingFormData(prev => ({
                      ...prev,
                      data_point: e.target.value
                    }))}
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-indigo-500`}
                    placeholder="e.g., federal_reimbursement"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-1`}>
                    Data Type
                  </label>
                  <select
                    value={mappingFormData.data_type}
                    onChange={(e) => setMappingFormData(prev => ({
                      ...prev,
                      data_type: e.target.value as 'revenue' | 'expense'
                    }))}
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-1`}>
                    GL Account
                  </label>
                  <select
                    value={mappingFormData.gl_account_id}
                    onChange={(e) => setMappingFormData(prev => ({
                      ...prev,
                      gl_account_id: e.target.value
                    }))}
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select GL Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.account_number} - {account.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowMappingForm(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMapping}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4 mr-2 inline-block" />
                    Save Mapping
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mappings List */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Data Point
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Type
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      GL Account
                    </th>
                    <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                  darkMode ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {mappings.map((mapping) => (
                    <tr key={mapping.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {mapping.data_point}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          mapping.data_type === 'revenue'
                            ? darkMode ? 'bg-green-400/10 text-green-400' : 'bg-green-100 text-green-800'
                            : darkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {mapping.data_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {mapping.gl_account?.account_number} - {mapping.gl_account?.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteMapping(mapping.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                            darkMode
                              ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                              : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                          }`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financials;