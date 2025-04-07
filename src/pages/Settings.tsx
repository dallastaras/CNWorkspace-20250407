import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Bell, Shield, Database, Settings as SettingsIcon, Target, School } from 'lucide-react';
import { toast } from '../components/common/Toast';

const Settings = () => {
  const { user } = useStore();
  const darkMode = useStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState<'general' | 'kpi' | 'notifications' | 'access'>('general');
  const [benchmarks, setBenchmarks] = useState({
    '1': { // Cybersoft High
      '1': 40, // Eco Dis
      '2': 1000, // Meals
      '3': 900, // Revenue
      '4': 25, // Breakfast %
      '5': 71 // Lunch %
    },
    '2': { // Cybersoft Middle
      '1': 60,
      '2': 500,
      '3': 600,
      '4': 30,
      '5': 60
    },
    '3': { // Cybersoft Elementary
      '1': 40,
      '2': 500,
      '3': 400,
      '4': 35,
      '5': 65
    },
    '4': { // Primero High
      '1': 30,
      '2': 1000,
      '3': 900,
      '4': 25,
      '5': 71
    },
    '5': { // Primero Elementary
      '1': 40,
      '2': 500,
      '3': 400,
      '4': 35,
      '5': 65
    }
  });

  // Sample data
  const sampleSchools = [
    { id: '1', name: 'Cybersoft High' },
    { id: '2', name: 'Cybersoft Middle' },
    { id: '3', name: 'Cybersoft Elementary' },
    { id: '4', name: 'Primero High' },
    { id: '5', name: 'Primero Elementary' }
  ];

  const sampleKPIs = [
    { id: '1', name: 'Eco Dis', unit: '%', benchmark: 60 },
    { id: '2', name: 'Meals', unit: '#', benchmark: 500 },
    { id: '3', name: 'Revenue', unit: '$', benchmark: 400 },
    { id: '4', name: 'Breakfast %', unit: '%', benchmark: 35 },
    { id: '5', name: 'Lunch %', unit: '%', benchmark: 65 }
  ];

  const handleBenchmarkChange = (schoolId: string, kpiId: string, value: number) => {
    if (value < 0) {
      toast.error('Benchmark cannot be negative');
      return;
    }
    
    if (sampleKPIs.find(k => k.id === kpiId)?.unit === '%' && value > 100) {
      toast.error('Percentage cannot exceed 100%');
      return;
    }
    
    setBenchmarks(prev => ({
      ...prev,
      [schoolId]: {
        ...prev[schoolId],
        [kpiId]: value
      }
    }));
    
    toast.success('Benchmark updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <SettingsIcon className="w-6 h-6 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Tabs */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'kpi', label: 'KPI Benchmarks', icon: Target },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'access', label: 'Access Control', icon: Shield }
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

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="Cybersoft ISD"
              />
            </div>
          </div>
        </div>
      )}

      {/* KPI Benchmarks */}
      {activeTab === 'kpi' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider sticky left-0 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    School
                  </th>
                  {sampleKPIs.map((kpi) => (
                    <th key={kpi.id} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      {kpi.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {sampleSchools.map((school) => (
                  <tr key={school.id}>
                    <td className={`px-6 py-4 whitespace-nowrap sticky left-0 ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <div className="flex items-center">
                        <School className={`w-5 h-5 mr-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <div className={`text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {school.name}
                        </div>
                      </div>
                    </td>
                    {sampleKPIs.map((kpi) => (
                      <td key={kpi.id} className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min={0}
                          max={kpi.unit === '%' ? 100 : undefined}
                          step={kpi.unit === '%' ? 1 : 0.01}
                          value={benchmarks[school.id]?.[kpi.id] || kpi.benchmark}
                          onChange={(e) => handleBenchmarkChange(
                            school.id,
                            kpi.id,
                            Number(e.target.value)
                          )}
                          className={`w-24 px-3 py-1 text-sm rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300 border-gray-600' 
                              : 'bg-white text-gray-900 border-gray-300'
                          } border focus:ring-2 focus:ring-indigo-500`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  KPI Alert Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive alerts when KPIs fall below benchmark
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Access Control */}
      {activeTab === 'access' && user?.role === 'director' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Access Control</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Manager Access
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Configure what data school managers can access
                </p>
                <div className="space-y-2">
                  {['View District-wide KPIs', 'Export Reports', 'Modify Goals'].map(
                    (permission) => (
                      <div key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">{permission}</label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Settings;