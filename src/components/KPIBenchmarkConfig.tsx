import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Target, School, ChevronDown, ChevronRight, ChevronUp, Settings } from 'lucide-react';
import { SlideOutPanel } from './common/SlideOutPanel';
import { toast } from './common/Toast';

interface KPIBenchmarkConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KPIColumn {
  id: string;
  name: string;
  unit: string;
  benchmark: number;
}

// Sample data
const sampleSchools = [
  { id: '1', name: 'Cybersoft High' },
  { id: '2', name: 'Cybersoft Middle' },
  { id: '3', name: 'Cybersoft Elementary' },
  { id: '4', name: 'Primero High' },
  { id: '5', name: 'Primero Elementary' }
];

const sampleKPIs: KPIColumn[] = [
  { id: '1', name: 'Program Access', unit: '%', benchmark: 60 },
  { id: '2', name: 'Meals Served', unit: '#', benchmark: 500 },
  { id: '3', name: 'Revenue', unit: '$', benchmark: 400 },
  { id: '4', name: 'Food Waste', unit: '$', benchmark: 250 },
  { id: '5', name: 'Breakfast', unit: '%', benchmark: 35 },
  { id: '6', name: 'Lunch', unit: '%', benchmark: 75 },
  { id: '7', name: 'Snack', unit: '%', benchmark: 25 },
  { id: '8', name: 'Supper', unit: '%', benchmark: 25 }
];

const getKPIFormat = (kpi: KPIColumn) => {
  if (kpi.unit === '%') return 'percentage';
  if (kpi.unit === '$') return 'decimal';
  if (kpi.name === 'Meals') return 'integer';
  return 'decimal';
};

const sampleBenchmarks = {
  '1': { // Cybersoft High
    '1': 40, // Eco Dis
    '2': 1000, // Meals
    '3': 900, // Revenue
    '4': 200, // Food Waste
    '5': 25, // Breakfast
    '6': 71, // Lunch
    '7': 20, // Snack
    '8': 15  // Supper
  },
  '2': { // Cybersoft Middle
    '1': 60,
    '2': 500,
    '3': 600,
    '4': 150,
    '5': 30,
    '6': 60,
    '7': 25,
    '8': 20
  },
  '3': { // Cybersoft Elementary
    '1': 40,
    '2': 500,
    '3': 400,
    '4': 100,
    '5': 35,
    '6': 65,
    '7': 30,
    '8': 25
  },
  '4': { // Primero High
    '1': 30,
    '2': 1000,
    '3': 900,
    '4': 300,
    '5': 25,
    '6': 71,
    '7': 15,
    '8': 10
  },
  '5': { // Primero Elementary
    '1': 40,
    '2': 500,
    '3': 400,
    '4': 125,
    '5': 35,
    '6': 65,
    '7': 25,
    '8': 20
  }
};

const KPIBenchmarkConfig: React.FC<KPIBenchmarkConfigProps> = ({ isOpen, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const [benchmarks, setBenchmarks] = useState(sampleBenchmarks);
  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({});
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(sampleKPIs.map(kpi => kpi.id));

  const handleBenchmarkChange = (schoolId: string, kpiId: string, value: number) => {
    // Update local state
    if (value < 0) {
      toast.error('Benchmark cannot be negative');
      return;
    }
    
    if (sampleKPIs.find(k => k.id === kpiId)?.unit === '%' && value > 100) {
      toast.error('Percentage cannot exceed 100%');
      return;
    }
    
    // Update benchmarks state
    setBenchmarks(prev => ({
      ...prev,
      [schoolId]: {
        ...prev[schoolId],
        [kpiId]: value
      }
    }));
    
    // Show success toast
    toast.success('Benchmark updated successfully');
  };
  const getKPIFormat = (kpi: typeof sampleKPIs[0]) => {
    if (kpi.unit === '%') return 'percentage';
    if (kpi.unit === '$') return 'decimal';
    if (kpi.name === 'Meals') return 'integer';
    return 'decimal';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value}%`;
    if (unit === '$') return `$${value}`;
    return value.toString();
  };

  const handleSchoolExpand = (schoolId: string) => {
    setExpandedSchools(prev => ({
      ...prev,
      [schoolId]: !prev[schoolId]
    }));
  };

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Benchmark Configuration"
      icon={<Target className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle="Configure school-specific benchmark targets"
      width="full"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Configure KPI Benchmarks
              </h3>
            </div>
          </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium sticky left-0 z-10 ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider sticky left-0 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } uppercase tracking-wider ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        School
                      </th>
                      {selectedKPIs.map(kpiId => {
                        const kpi = sampleKPIs.find(k => k.id === kpiId);
                        if (!kpi) return null;
                        return (
                        <th key={kpi.id} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-500'
                        } uppercase tracking-wider`}>
                          {kpi.name}
                        </th>
                      )})}
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                    darkMode ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {sampleSchools.map((school) => (
                      <React.Fragment key={school.id}>
                        <tr className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className={`px-6 py-4 whitespace-nowrap sticky left-0 z-10 ${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                          <button
                            onClick={() => handleSchoolExpand(school.id)}
                            className="flex items-center w-full"
                          >
                            {expandedSchools[school.id] ? (
                              <ChevronDown className={`w-4 h-4 mr-2 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                            ) : (
                              <ChevronRight className={`w-4 h-4 mr-2 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                            )}
                            <School className={`w-5 h-5 mr-2 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <div className={`text-sm font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {school.name}
                            </div>
                          </button>
                        </td>
                        {selectedKPIs.map(kpiId => {
                          const kpi = sampleKPIs.find(k => k.id === kpiId);
                          if (!kpi) return null;
                          return (
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
                        )})}
                        </tr>
                        {expandedSchools[school.id] && (
                          <tr className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                            <td colSpan={selectedKPIs.length + 1} className="px-6 py-4">
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Total Enrollment: {school.name === 'Cybersoft High' ? '1,500' : 
                                                     school.name === 'Cybersoft Middle' ? '1,000' : 
                                                     school.name === 'Cybersoft Elementary' ? '750' :
                                                     school.name === 'Primero High' ? '1,200' : '600'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Free/Reduced: {school.name === 'Cybersoft High' ? '55%' :
                                                 school.name === 'Cybersoft Middle' ? '60%' :
                                                 school.name === 'Cybersoft Elementary' ? '65%' :
                                                 school.name === 'Primero High' ? '55%' : '65%'}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </SlideOutPanel>
  );
};

export default KPIBenchmarkConfig;