import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import SchoolPerformanceTable from '../SchoolPerformanceTable';
import { School, Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { SlideOutPanel } from '../common/SlideOutPanel';

interface SchoolPerformanceProps {
  loading: boolean;
  metrics: any[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const SchoolPerformanceSection: React.FC<SchoolPerformanceProps> = ({
  loading,
  metrics,
  dateRange
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const selectedTimeframe = useStore((state) => state.selectedTimeframe);
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case 'prior-day':
        return format(dateRange.start, 'MMMM d, yyyy');
      case 'day':
        return 'Today';
      case 'week':
        return `Week of ${format(dateRange.start, 'MMMM d')}`;
      case 'month':
        return format(dateRange.start, 'MMMM yyyy');
      case 'year': {
        const startYear = format(dateRange.start, 'yyyy');
        const endYear = format(dateRange.end, 'yyyy');
        return `Academic Year ${startYear}-${endYear}`;
      }
      default:
        return '';
    }
  };

  const handleSchoolClick = (schoolId: string) => {
    setSelectedSchool(schoolId);
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
        </div>
      </Card>
    );
  }

  if (!metrics?.length) {
    return (
      <Card>
        <EmptyState
          icon={School}
          title="No Performance Data"
          message={`No school performance data is available for ${getTimeframeLabel()}.`}
        />
      </Card>
    );
  }

  const selectedSchoolData = metrics.find(m => m.id === selectedSchool);

  return (
    <Card>
      <CardHeader 
        title="School Performance" 
        action={
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Calendar className="w-4 h-4 mr-2" />
            {getTimeframeLabel()}
          </div>
        }
      />
      <SchoolPerformanceTable metrics={metrics} onSchoolClick={handleSchoolClick} />

      <SlideOutPanel
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        title={selectedSchoolData?.school_name || 'School Details'}
        subtitle={`Performance for ${getTimeframeLabel()}`}
        icon={<School className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
        width="half"
      >
        <div className="px-4 py-6 sm:px-6 space-y-6">
          {selectedSchoolData && (
            <>
              {/* Summary Stats */}
              <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Program Access
                    </div>
                    <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedSchoolData.program_access_rate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Meal Equivalents
                    </div>
                    <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedSchoolData.meal_equivalents.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Participation Rates */}
              <div>
                <h3 className={`text-sm font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Participation Rates
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Breakfast', value: selectedSchoolData.breakfast_participation_rate, benchmark: 35 },
                    { label: 'Lunch', value: selectedSchoolData.lunch_participation_rate, benchmark: 75 },
                    { label: 'Snack', value: selectedSchoolData.snack_participation_rate, benchmark: 25 }
                  ].map(({ label, value, benchmark }) => (
                    <div key={label} className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {label}
                        </span>
                        <span className={`text-sm ${value >= benchmark ? 'text-green-500' : 'text-amber-500'}`}>
                          {value.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className={`h-2 rounded-full ${value >= benchmark ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(100, value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate(`/schools/${selectedSchoolData.school_id}`)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  View School Details
                  <ChevronDown className="w-4 h-4 ml-2 rotate-270" />
                </button>
              </div>
            </>
          )}
        </div>
      </SlideOutPanel>
    </Card>
  );
};