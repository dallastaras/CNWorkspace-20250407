import React from 'react';
import { useStore } from '../../store/useStore';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { List, Calendar, Users, Book, Clock, Star } from 'lucide-react';

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
}

interface MenuCycleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCycle: (cycle: MenuCycle) => void;
  selectedCycle?: MenuCycle;
}

export const MenuCycleSelector: React.FC<MenuCycleSelectorProps> = ({
  isOpen,
  onClose,
  onSelectCycle,
  selectedCycle
}) => {
  const darkMode = useStore((state) => state.darkMode);

  // Sample menu cycles - replace with real data
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
      endDate: '2025-03-28'
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
      endDate: '2025-03-28'
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
      endDate: '2025-03-28'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 80) return darkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 70) return darkMode ? 'text-amber-400' : 'text-amber-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Menu Cycles"
      icon={<List className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle="Select a menu cycle to view"
    >
      <div className="px-4 py-6 sm:px-6">
        {selectedCycle && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Current Selection
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Program
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {selectedCycle.program}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Meal Pattern
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {selectedCycle.mealPattern}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Audience
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {selectedCycle.audience}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Length
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {selectedCycle.length}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {menuCycles.map((cycle) => (
            <button
              key={cycle.id}
              onClick={() => onSelectCycle(cycle)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedCycle?.id === cycle.id
                  ? darkMode
                    ? 'bg-indigo-900/20 border border-indigo-500'
                    : 'bg-indigo-50 border border-indigo-200'
                  : darkMode
                    ? 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {cycle.name}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cycle.program}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(cycle.score)}`}>
                  {cycle.score}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Book className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cycle.mealPattern}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cycle.audience}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cycle.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(cycle.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SlideOutPanel>
  );
};