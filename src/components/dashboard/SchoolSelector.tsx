import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { School, ChevronDown, Building, Check } from 'lucide-react';

interface SchoolSelectorProps {
  selectedSchool: string;
  schools: Array<{ id: string; name: string }>;
  onSchoolChange: (schoolId: string) => void;
}

export const SchoolSelector: React.FC<SchoolSelectorProps> = ({
  selectedSchool = 'district',
  schools = [],
  onSchoolChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const darkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSchoolSelect = (schoolId: string) => {
    onSchoolChange(schoolId);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedSchool === 'district') {
      return 'All Schools';
    }
    return schools.find(s => s.id === selectedSchool)?.name || 'Select School';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          darkMode 
            ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } transition-colors border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <School className="w-4 h-4" />
        <span className="text-sm font-medium">{getDisplayText()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden z-50 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="py-2">
            <button
              onClick={() => handleSchoolSelect('district')}
              className={`w-full flex items-center px-4 py-2 text-left ${
                selectedSchool === 'district'
                  ? darkMode 
                    ? 'bg-gray-700 text-white'
                    : 'bg-indigo-50 text-indigo-600'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Building className={`w-4 h-4 ${
                selectedSchool === 'district'
                  ? darkMode ? 'text-white' : 'text-indigo-600'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`ml-3 text-sm font-medium flex-1 ${
                selectedSchool === 'district'
                  ? darkMode ? 'text-white' : 'text-indigo-600'
                  : darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                All Schools
              </span>
              {selectedSchool === 'district' && (
                <Check className={`w-4 h-4 ${
                  darkMode ? 'text-white' : 'text-indigo-600'
                }`} />
              )}
            </button>

            <div className={`mx-4 my-2 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

            {schools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSchoolSelect(school.id)}
                className={`w-full flex items-center px-4 py-2 text-left ${
                  selectedSchool === school.id
                    ? darkMode 
                      ? 'bg-gray-700 text-white'
                      : 'bg-indigo-50 text-indigo-600'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <School className={`w-4 h-4 ${
                  selectedSchool === school.id
                    ? darkMode ? 'text-white' : 'text-indigo-600'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`ml-3 text-sm font-medium flex-1 ${
                  selectedSchool === school.id
                    ? darkMode ? 'text-white' : 'text-indigo-600'
                    : darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {school.name}
                </span>
                {selectedSchool === school.id && (
                  <Check className={`w-4 h-4 ${
                    darkMode ? 'text-white' : 'text-indigo-600'
                  }`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};