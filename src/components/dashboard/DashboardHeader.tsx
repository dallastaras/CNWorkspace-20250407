import React from 'react';
import { useStore } from '../../store/useStore';
import { Target,  Bot, BarChart2, Settings } from 'lucide-react';
import { TimeframeSelector } from './TimeframeSelector';
import { SchoolSelector } from './SchoolSelector';

interface DashboardHeaderProps {
  selectedSchool: string;
  schools: Array<{ id: string; name: string }>;
  onSchoolChange: (schoolId: string) => void;
  onOpenBenchmarks: () => void;
  onOpenSchoolie: () => void;
  onOpenKPIConfig: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedSchool,
  schools,
  onSchoolChange,
  onOpenBenchmarks,
  onOpenSchoolie,
  onOpenKPIConfig
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BarChart2 className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Insights
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <TimeframeSelector />
          <SchoolSelector
            selectedSchool={selectedSchool}
            schools={schools}
            onSchoolChange={onSchoolChange}
          />
        
        <button
          onClick={onOpenKPIConfig}
          className={`p-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Configure KPIs"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenSchoolie}
          className={`p-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Ask Schoolie"
        >
          <Bot className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenBenchmarks}
          className={`p-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Configure Benchmarks"
        >
          <Target className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};