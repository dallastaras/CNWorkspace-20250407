import React from 'react';
import { useStore } from '../../store/useStore';
import { School, ChevronDown, ChevronRight } from 'lucide-react';

interface SchoolSummaryProps {
  schools: Array<{
    id: string;
    name: string;
    totalStudents: number;
    dietaryStudents: number;
    profiles: Array<{
      name: string;
      count: number;
    }>;
  }>;
  expandedSchools: Record<string, boolean>;
  onToggleSchool: (schoolId: string) => void;
}

export const SchoolSummary: React.FC<SchoolSummaryProps> = ({
  schools,
  expandedSchools,
  onToggleSchool
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
      <div className="p-6">
        <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          School Summary
        </h2>
        <div className="space-y-4">
          {schools.map((school) => (
            <div key={school.id}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => onToggleSchool(school.id)}
              >
                <div className="flex items-center space-x-3">
                  <School className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {school.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {school.dietaryStudents} of {school.totalStudents} students
                      ({((school.dietaryStudents / school.totalStudents) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
                {expandedSchools[school.id] ? (
                  <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </div>

              {expandedSchools[school.id] && (
                <div className={`mt-4 ml-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="space-y-3">
                    {school.profiles.map((profile, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {profile.name}
                        </span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {profile.count} students
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};